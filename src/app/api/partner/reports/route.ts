import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Partner fetches all lab_submissions assigned to them (where they need to upload reports)
export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const adminClient = createAdminClient();

    const { data, error } = await adminClient
        .from("lab_submissions")
        .select(`
            *,
            caregiver_tasks (
                id,
                status,
                arrived_at,
                sample_collected_at,
                service_bookings (
                    id,
                    service_name_en,
                    patient_name,
                    requester_name,
                    scheduled_at,
                    booking_data
                )
            )
        `)
        .eq("partner_id", user.id)
        .order("submitted_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ submissions: data });
}
