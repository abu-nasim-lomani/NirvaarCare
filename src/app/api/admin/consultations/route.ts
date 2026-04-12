import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { pushNotification } from "@/lib/notifications";

async function verifyManagerOrAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single();
    return data?.role === "manager" || data?.role === "admin";
}

// POST: Schedule online consultation
export async function POST(req: Request) {
    if (!(await verifyManagerOrAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const body = await req.json();
    const { booking_id, task_id, doctor_id, customer_id, scheduled_at, meeting_link, notes } = body;

    if (!booking_id || !scheduled_at) {
        return NextResponse.json({ error: "booking_id and scheduled_at are required" }, { status: 400 });
    }

    const adminClient = createAdminClient();

    const { data: consult, error } = await adminClient
        .from("consultations")
        .insert({
            booking_id,
            task_id: task_id || null,
            doctor_id: doctor_id || null,
            customer_id: customer_id || null,
            type: "online",
            scheduled_at,
            meeting_link: meeting_link || null,
            notes: notes || null,
            status: "scheduled",
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
        title: "🖥️ Online Doctor Consultation Scheduled",
        message: `Your online doctor consultation is scheduled for ${new Date(scheduled_at).toLocaleString("en-BD", { dateStyle: "medium", timeStyle: "short" })}. ${meeting_link ? "Meeting link has been provided." : "Meeting link will be shared closer to the date."}`,
    });

    // Notify doctor if assigned
    if (doctor_id) {
        await pushNotification({
            recipient_role: "doctor",
            recipient_id: doctor_id,
            booking_id,
            task_id: task_id || undefined,
            type: "info",
            title: "New Online Consultation Assigned",
            message: `You have a new online consultation scheduled for ${new Date(scheduled_at).toLocaleString("en-BD", { dateStyle: "medium", timeStyle: "short" })}.`,
        });
    }

    return NextResponse.json({ success: true, consultation: consult });
}

// GET: All consultations (manager view)
export async function GET() {
    if (!(await verifyManagerOrAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const adminClient = createAdminClient();
    const { data, error } = await adminClient
        .from("consultations")
        .select(`
            *,
            service_bookings (id, service_name_en, patient_name, requester_name, requester_phone)
        `)
        .order("scheduled_at", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ consultations: data });
}
