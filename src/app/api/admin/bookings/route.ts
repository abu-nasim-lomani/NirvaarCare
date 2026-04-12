import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function verifyManagerOrAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single();
    return data?.role === "manager" || data?.role === "admin";
}

export async function GET() {
    if (!(await verifyManagerOrAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const adminClient = createAdminClient();

    const { data, error } = await adminClient
        .from("service_bookings")
        .select(`
            *,
            caregiver_tasks (
                id, status, caregiver_id,
                approved_at, travelling_at, arrived_at,
                sample_collected_at, sample_sent_at,
                report_uploaded_at, completed_at, cancel_reason
            )
        `)
        .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ bookings: data });
}

export async function PATCH(req: Request) {
    if (!(await verifyManagerOrAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) return NextResponse.json({ error: "id and status are required" }, { status: 400 });

    const adminClient = createAdminClient();
    const { error } = await adminClient
        .from("service_bookings")
        .update({ status })
        .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
}
