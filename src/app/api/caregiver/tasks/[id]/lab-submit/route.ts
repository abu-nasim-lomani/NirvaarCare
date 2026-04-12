import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { pushNotification } from "@/lib/notifications";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { partner_id, tracking_ref, notes } = body;

    if (!partner_id) {
        return NextResponse.json({ error: "partner_id is required" }, { status: 400 });
    }

    const adminClient = createAdminClient();

    const { data: submission, error } = await adminClient
        .from("lab_submissions")
        .insert({
            task_id: id,
            partner_id,
            tracking_ref: tracking_ref || null,
            notes: notes || null,
        })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Update task status
    await adminClient
        .from("caregiver_tasks")
        .update({ status: "sample_sent_to_lab", sample_sent_at: new Date().toISOString() })
        .eq("id", id);

    // Get booking_id for notification
    const { data: task } = await adminClient
        .from("caregiver_tasks")
        .select("booking_id")
        .eq("id", id)
        .single();

    if (task) {
        await pushNotification({
            recipient_role: "manager",
            booking_id: task.booking_id,
            task_id: id,
            type: "info",
            title: "Samples Submitted to Lab",
            message: `Samples have been submitted to the diagnostic partner lab.${tracking_ref ? ` Tracking Ref: ${tracking_ref}` : ""}`,
        });
    }

    return NextResponse.json({ success: true, submission });
}
