import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Customer fetches their own appointments
export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const adminClient = createAdminClient();

    // Get appointments where the customer_id matches OR booking belongs to the customer
    const { data, error } = await adminClient
        .from("consultations")
        .select(`
            *,
            service_bookings (
                id, service_name_en, patient_name, scheduled_at
            )
        `)
        .or(`customer_id.eq.${user.id}`)
        .order("scheduled_at", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ appointments: data });
}
