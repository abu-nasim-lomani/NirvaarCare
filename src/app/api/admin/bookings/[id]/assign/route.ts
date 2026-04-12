import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { pushNotification } from "@/lib/notifications";

async function verifyManagerOrAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single();
    return data?.role === "manager" || data?.role === "admin";
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
    if (!(await verifyManagerOrAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { id } = await context.params;
        const body = await req.json();
        const { assigned_caregiver_id, assigned_partner_id, scheduled_at, manager_notes } = body;

        if (!assigned_caregiver_id || !assigned_partner_id || !scheduled_at) {
            return NextResponse.json({ error: "Caregiver, Partner, and Schedule date are required." }, { status: 400 });
        }

        const adminClient = createAdminClient();

        // 1. Update booking status
        const { error: bookingError } = await adminClient
            .from("service_bookings")
            .update({
                status: "Processing",
                assigned_caregiver_id,
                assigned_partner_id,
                scheduled_at,
                manager_notes: manager_notes || null,
            })
            .eq("id", id);

        if (bookingError) return NextResponse.json({ error: bookingError.message }, { status: 500 });

        // 1.5 Fetch booking to check if it has_transport
        const { data: bookingInfo } = await adminClient
            .from("service_bookings")
            .select("has_transport")
            .eq("id", id)
            .single();
        
        const taskType = bookingInfo?.has_transport ? "diagnostic_escort" : "sample_collection";

        // 2. Create caregiver_task record (if not already exists)
        const { data: existingTask } = await adminClient
            .from("caregiver_tasks")
            .select("id")
            .eq("booking_id", id)
            .single();

        let taskId: string | undefined;

        if (!existingTask) {
            const { data: newTask, error: taskError } = await adminClient
                .from("caregiver_tasks")
                .insert({
                    booking_id: id,
                    caregiver_id: assigned_caregiver_id,
                    partner_id: assigned_partner_id,
                    status: "pending_approval",
                    task_type: taskType
                })
                .select("id")
                .single();

            if (taskError) return NextResponse.json({ error: "Task creation failed: " + taskError.message }, { status: 500 });
            taskId = newTask?.id;
        } else {
            // Update existing task with new caregiver/partner if re-assigned
            await adminClient.from("caregiver_tasks").update({
                caregiver_id: assigned_caregiver_id,
                partner_id: assigned_partner_id,
                status: "pending_approval",
                task_type: taskType
            }).eq("booking_id", id);
            taskId = existingTask.id;
        }

        // 3. Notify caregiver about the new assignment
        await pushNotification({
            recipient_role: "caregiver",
            recipient_id: assigned_caregiver_id,
            booking_id: id,
            task_id: taskId,
            type: "info",
            title: "New Assignment",
            message: "You have been assigned a new Diagnostic & Medical service task. Please review and approve.",
        });

        return NextResponse.json({ success: true, message: "Booking confirmed and assigned!", taskId });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
