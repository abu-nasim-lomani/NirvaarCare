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

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
    if (!(await verifyManagerOrAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const adminClient = createAdminClient();
        const { id: userId } = await context.params;

        // Security: Prevent users from deleting Super Admins
        const { data: roleCheck } = await adminClient
            .from("user_roles")
            .select("role")
            .eq("user_id", userId)
            .single();

        if (roleCheck?.role === "admin") {
            return NextResponse.json({ error: "Cannot delete super admins." }, { status: 403 });
        }

        // Delete user from Auth. This should cascade delete their record in user_roles 
        // if user_roles has ON DELETE CASCADE configured. If not, we should delete it manually first just in case.
        await adminClient.from("user_roles").delete().eq("user_id", userId);

        const { error } = await adminClient.auth.admin.deleteUser(userId);
        
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: "User deleted successfully." });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
    if (!(await verifyManagerOrAdmin())) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const adminClient = createAdminClient();
        const { id: userId } = await context.params;
        
        // Update user properties via Admin API
        const { error } = await adminClient.auth.admin.updateUserById(userId, {
            user_metadata: {
                full_name: body.full_name,
                phone: body.phone,
            },
            ...(body.password ? { password: body.password } : {})
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: "User updated successfully." });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
