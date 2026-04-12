import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
                booking_data
            )
        `)
        .eq("caregiver_id", user.id)
        .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ tasks });
}
