import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const adminClient = createAdminClient();

    // Get user's role to determine which notifications to fetch
    const { data: roleData } = await adminClient
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

    const role = roleData?.role;

    const { data, error } = await adminClient
        .from("notifications")
        .select("*")
        .or(`recipient_id.eq.${user.id},recipient_role.eq.${role}`)
        .order("created_at", { ascending: false })
        .limit(40);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ notifications: data });
}

export async function PATCH(req: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { ids } = body; // array of notification IDs to mark as read

    const adminClient = createAdminClient();
    await adminClient
        .from("notifications")
        .update({ is_read: true })
        .in("id", ids);

    return NextResponse.json({ success: true });
}
