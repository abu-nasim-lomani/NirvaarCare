import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { pushNotification } from "@/lib/notifications";

// Status → next timestamp field mapping
const STATUS_TIMESTAMP: Record<string, string> = {
    approved: "approved_at",
    travelling: "travelling_at",
    arrived: "arrived_at",
    sample_collected: "sample_collected_at",     // sample collection flow
    sample_sent_to_lab: "sample_sent_at",        // sample collection flow
    patient_picked_up: "picked_up_at",           // escort flow
    arrived_at_center: "arrived_at_center_at",   // escort flow
    patient_dropped_off: "dropped_off_at",       // escort flow
    report_uploaded: "report_uploaded_at",
    completed: "completed_at",
};

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const adminClient = createAdminClient();

    const { data: task, error } = await adminClient
        .from("caregiver_tasks")
        .select(`
            *,
            service_bookings (
                id, service_name_en, patient_name, requester_name, 
                requester_phone, scheduled_at, booking_data,
                assigned_partner_id
            ),
            sample_entries (*),
            lab_submissions (*)
        `)
        .eq("id", id)
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ task });
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const adminClient = createAdminClient();
    const body = await req.json();
    const { status, cancel_reason, caregiver_notes } = body;

    // Verify this caregiver owns this task
    const { data: task } = await adminClient
        .from("caregiver_tasks")
        .select("caregiver_id, booking_id, status")
        .eq("id", id)
        .single();

    if (!task || task.caregiver_id !== user.id) {
        return NextResponse.json({ error: "Task not found or unauthorized" }, { status: 403 });
    }

    // Build update payload
    const updatePayload: Record<string, any> = {
        status,
        updated_at: new Date().toISOString(),
    };
    if (cancel_reason) updatePayload.cancel_reason = cancel_reason;
    if (caregiver_notes) updatePayload.caregiver_notes = caregiver_notes;

    // Auto-stamp timestamp for this step
    const tsField = STATUS_TIMESTAMP[status];
    if (tsField) updatePayload[tsField] = new Date().toISOString();

    const { error } = await adminClient
        .from("caregiver_tasks")
        .update(updatePayload)
        .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // --- Notifications based on status ---
    const bookingId = task.booking_id;

    if (status === "cancelled") {
        await pushNotification({
            recipient_role: "manager",
            booking_id: bookingId,
            task_id: id,
            type: "critical",
            title: "🚨 Caregiver Cancelled Assignment",
            message: `The assigned caregiver has cancelled the task. Reason: ${cancel_reason || "Not specified"}. Immediate reassignment required.`,
        });
    } else if (status === "arrived") {
        await pushNotification({
            recipient_role: "manager",
            booking_id: bookingId,
            task_id: id,
            type: "info",
            title: "Caregiver Arrived at Patient Home",
            message: "The caregiver has arrived at the patient's home and is starting the service.",
        });
    } else if (status === "sample_collected") {
        await pushNotification({
            recipient_role: "manager",
            booking_id: bookingId,
            task_id: id,
            type: "info",
            title: "Samples Collected",
            message: "Caregiver has collected patient samples and is coordinating with the diagnostic center.",
        });
    } else if (status === "sample_sent_to_lab") {
        await pushNotification({
            recipient_role: "manager",
            booking_id: bookingId,
            task_id: id,
            type: "info",
            title: "Samples Submitted to Lab",
            message: "Samples have been submitted to the diagnostic partner. Waiting for lab report.",
        });
    } else if (status === "patient_picked_up") {
        await pushNotification({
            recipient_role: "manager",
            booking_id: bookingId,
            task_id: id,
            type: "info",
            title: "Patient Picked Up",
            message: "Caregiver has picked up the patient and is heading to the diagnostic center.",
        });
    } else if (status === "arrived_at_center") {
        await pushNotification({
            recipient_role: "manager",
            booking_id: bookingId,
            task_id: id,
            type: "info",
            title: "Arrived at Diagnostic Center",
            message: "Caregiver and patient have arrived at the diagnostic center.",
        });
    } else if (status === "patient_dropped_off") {
        await pushNotification({
            recipient_role: "manager",
            booking_id: bookingId,
            task_id: id,
            type: "info",
            title: "Patient Dropped Off",
            message: "Caregiver has successfully dropped off the patient back at home.",
        });
    }

    return NextResponse.json({ success: true });
}
