import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// Security check helper
async function verifyManagerOrAdmin() {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
        return false;
    }

    const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

    if (roleData?.role !== "manager" && roleData?.role !== "admin") {
        return false;
    }

    return true;
}

export async function GET(req: Request) {
    if (!(await verifyManagerOrAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || "caregiver"; // default to caregivers

    const adminClient = createAdminClient();

    // 1. Fetch matching user_roles
    const { data: userRoles, error: roleError } = await adminClient
        .from("user_roles")
        .select("user_id")
        .eq("role", role);

    if (roleError) return NextResponse.json({ error: roleError.message }, { status: 500 });
    
    if (!userRoles || userRoles.length === 0) {
        return NextResponse.json({ personnel: [] });
    }

    const userIds = userRoles.map(r => r.user_id);

    // 2. Fetch specific list of auth users (This requires fetching all and filtering, wait...)
    // Admin API getusers doesn't accept arrays of IDs cleanly in standard method, we'll fetch all or paginated.
    // However, if we do listUsers, it brings users. Let's do listUsers and filter in memory since it's a small app.
    const { data: authData, error: usersError } = await adminClient.auth.admin.listUsers({
        perPage: 1000 // In production, we'd paginate or use edge functions
    });

    if (usersError) return NextResponse.json({ error: usersError.message }, { status: 500 });

    const personnel = authData.users
        .filter(u => userIds.includes(u.id))
        .map(u => ({
            id: u.id,
            email: u.email,
            full_name: u.user_metadata?.full_name || "Unknown Name",
            phone: u.user_metadata?.phone || "",
            created_at: u.created_at,
            last_sign_in_at: u.last_sign_in_at,
            role: role
        }));

    return NextResponse.json({ personnel });
}

export async function POST(req: Request) {
    if (!(await verifyManagerOrAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { email, password, full_name, phone, role } = body;

        if (!email || !password || !role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const adminClient = createAdminClient();

        // 1. Create User in Auth
        const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm for staff
            user_metadata: {
                full_name,
                phone
            }
        });

        if (authError) {
            return NextResponse.json({ error: authError.message }, { status: 400 });
        }

        const userId = authData.user.id;

        // 2. Insert Role into user_roles
        const { error: roleError } = await adminClient
            .from("user_roles")
            .insert({
                user_id: userId,
                role: role
            });

        if (roleError) {
            // Rollback auth creation if role fails
            await adminClient.auth.admin.deleteUser(userId);
            return NextResponse.json({ error: "Failed to assign role. User creation aborted." }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            message: `Successfully created ${role} account!`,
            id: userId 
        });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
