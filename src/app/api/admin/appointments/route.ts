import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { pushNotification } from "@/lib/notifications";

async function verifyManagerOrAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, user: null };
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single();
    const ok = data?.role === "manager" || data?.role === "admin";
    return { ok, user };
}

// POST: Create a doctor appointment from manager decision
export async function POST(req: Request) {
    const { ok } = await verifyManagerOrAdmin();
    if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const body = await req.json();
    const {
        booking_id,
        task_id,
        customer_id,
        scheduled_at,
        is_later,
        notify_caregiver,
        caregiver_id,
        appointment_note,
    } = body;

    if (!booking_id || !scheduled_at) {
        return NextResponse.json({ error: "booking_id and scheduled_at are required" }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Create consultation record (type = in_person = doctor appointment)
    const { data: appt, error } = await adminClient
        .from("consultations")
        .insert({
            booking_id,
            task_id: task_id || null,
            customer_id: customer_id || null,
            type: "in_person",
            scheduled_at,
            status: "scheduled",
            is_later: is_later || false,
            notify_caregiver: notify_caregiver || false,
            appointment_note: appointment_note || null,
        })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Notify customer
    await pushNotification({
        recipient_role: "customer",
        booking_id,
        task_id: task_id || undefined,
        type: "info",
        title: "🩺 Doctor Appointment Scheduled",
        message: `A doctor appointment has been scheduled for you on ${new Date(scheduled_at).toLocaleString("en-BD", { dateStyle: "medium", timeStyle: "short" })}. Please confirm your availability.`,
    });

    // Optionally notify caregiver
    if (notify_caregiver && caregiver_id) {
        await pushNotification({
            recipient_role: "caregiver",
            recipient_id: caregiver_id,
            booking_id,
            task_id: task_id || undefined,
            type: "info",
            title: "Doctor Appointment Scheduled",
            message: `A doctor appointment has been scheduled for the patient on ${new Date(scheduled_at).toLocaleString("en-BD", { dateStyle: "medium", timeStyle: "short" })}.`,
        });
    }

    return NextResponse.json({ success: true, appointment: appt });
}

// GET: All appointments (manager view)
export async function GET() {
    const { ok } = await verifyManagerOrAdmin();
    if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const adminClient = createAdminClient();

    const { data, error } = await adminClient
        .from("consultations")
        .select(`
            *,
            service_bookings (
                id, service_name_en, patient_name, requester_name, requester_phone
            )
        `)
        .eq("type", "in_person")
        .order("scheduled_at", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Check "Later" appointments needing pre-notification
    const now = new Date();
    for (const appt of data || []) {
        if (!appt.is_later || appt.pre_notification_sent) continue;
        const apptDate = new Date(appt.scheduled_at);
        const hoursUntil = (apptDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        // Notify if appointment is within 24 hours and pre-notification not sent
        if (hoursUntil <= 24 && hoursUntil > 0) {
            await pushNotification({
                recipient_role: "manager",
                booking_id: appt.booking_id,
                type: "warning",
                title: "⏰ Upcoming Doctor Appointment — Tomorrow",
                message: `A scheduled doctor appointment (${appt.service_bookings?.patient_name}) is in ${Math.round(hoursUntil)} hours. Please ensure everything is arranged.`,
            });
            await adminClient
                .from("consultations")
                .update({ pre_notification_sent: true })
                .eq("id", appt.id);
        }
    }

    return NextResponse.json({ appointments: data });
}
