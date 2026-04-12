import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { pushNotification } from "@/lib/notifications";

// PATCH: Customer confirms or requests reschedule
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { action, reschedule_note } = body; // action: 'confirm' | 'reschedule'

    const adminClient = createAdminClient();

    if (action === "confirm") {
        const { error } = await adminClient
            .from("consultations")
            .update({ customer_confirmed: true, status: "confirmed" })
            .eq("id", id);

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        // Notify manager
        const { data: appt } = await adminClient.from("consultations").select("booking_id, task_id").eq("id", id).single();
        if (appt) {
            await pushNotification({
                recipient_role: "manager",
                booking_id: appt.booking_id,
                task_id: appt.task_id || undefined,
                type: "info",
                title: "✅ Patient Confirmed Doctor Appointment",
                message: "The patient has confirmed their doctor appointment. Everything is on track.",
            });
        }

        return NextResponse.json({ success: true, action: "confirmed" });

    } else if (action === "reschedule") {
        const { error } = await adminClient
            .from("consultations")
            .update({ status: "reschedule_requested" })
            .eq("id", id);

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        const { data: appt } = await adminClient.from("consultations").select("booking_id, task_id").eq("id", id).single();
        if (appt) {
            await pushNotification({
                recipient_role: "manager",
                booking_id: appt.booking_id,
                task_id: appt.task_id || undefined,
                type: "warning",
                title: "🔄 Patient Requested Reschedule",
                message: `The patient has requested to reschedule their doctor appointment.${reschedule_note ? ` Note: "${reschedule_note}"` : ""}`,
            });
        }

        return NextResponse.json({ success: true, action: "reschedule_requested" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
