import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { pushNotification } from "@/lib/notifications";

// POST: Submit feedback
export async function POST(req: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { booking_id, task_id, rating, comment, service_name } = body;

    if (!booking_id || !rating) {
        return NextResponse.json({ error: "booking_id and rating are required" }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const { error } = await adminClient.from("service_feedback").insert({
        booking_id,
        task_id: task_id || null,
        customer_id: user.id,
        rating,
        comment: comment || null,
        service_name: service_name || null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Notify manager
    await pushNotification({
        recipient_role: "manager",
        booking_id,
        task_id: task_id || undefined,
        type: "info",
        title: `⭐ New Feedback Received — ${rating}/5 Stars`,
        message: comment
            ? `Customer rated this service ${rating}/5: "${comment}"`
            : `Customer rated this service ${rating}/5 stars.`,
    });

    return NextResponse.json({ success: true });
}

// GET: All feedback (manager)
export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single();
    if (role?.role !== "manager" && role?.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const adminClient = createAdminClient();
    const { data, error } = await adminClient
        .from("service_feedback")
        .select("*, service_bookings(service_name_en, patient_name)")
        .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ feedback: data });
}
