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

    const { data: tasks, error } = await adminClient
        .from("caregiver_tasks")
        .select(`
            *,
            service_bookings (
                id,
                service_name_en,
                patient_name,
                requester_name,
                requester_phone,
                scheduled_at,
                has_transport,
                report_type,
                booking_data
            ),
            sample_entries (*),
            lab_submissions (*)
        `)
        .not("status", "in", "(completed,cancelled)")
        .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Enrich with caregiver name from auth.users
    const caregiversIds = [...new Set(tasks?.map(t => t.caregiver_id) || [])];
    const caregiversMeta: Record<string, string> = {};

    for (const cgId of caregiversIds) {
        const { data: u } = await adminClient.auth.admin.getUserById(cgId);
        if (u?.user) {
            caregiversMeta[cgId] = u.user.user_metadata?.full_name || u.user.email || cgId;
        }
    }

    const enriched = (tasks || []).map(t => ({
        ...t,
        caregiver_name: caregiversMeta[t.caregiver_id] || "Unknown",
    }));

    return NextResponse.json({ tasks: enriched });
}

export async function PATCH(req: Request) {
    if (!(await verifyManagerOrAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { task_id, status, manager_decision } = body;

    const adminClient = createAdminClient();

    const updateData: Record<string, any> = {};
    if (status) updateData.status = status;
    if (manager_decision) updateData.manager_decision = manager_decision;
    if (status === "completed") updateData.completed_at = new Date().toISOString();

    await adminClient.from("caregiver_tasks").update(updateData).eq("id", task_id);

    return NextResponse.json({ success: true });
}
