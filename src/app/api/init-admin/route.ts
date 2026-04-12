import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

/**
 * GET /api/init-admin
 * One-time setup: inserts the 'admin' role for admin@nirvaarcare.com
 * into the user_roles table using the service role key (bypasses RLS).
 * Safe to call multiple times — uses upsert to avoid duplicates.
 */
export async function GET() {
    const supabase = createAdminClient();

    // 1. Look up the user by email via the admin auth API
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    const adminEmail = "admin@nirvaarcare.com";
    const adminUser = users.find((u) => u.email === adminEmail);

    if (!adminUser) {
        return NextResponse.json(
            { error: `User '${adminEmail}' not found in Supabase Auth. Please create the account first.` },
            { status: 404 }
        );
    }

    // 2. Upsert the role (safe to run multiple times)
    const { error: roleError } = await supabase
        .from("user_roles")
        .upsert(
            { user_id: adminUser.id, role: "admin" },
            { onConflict: "user_id" }
        );

    if (roleError) {
        return NextResponse.json(
            { error: `Role insert failed: ${roleError.message}` },
            { status: 500 }
        );
    }

    return NextResponse.json({
        success: true,
        message: `✅ Role 'admin' successfully assigned to ${adminEmail} (user_id: ${adminUser.id})`,
    });
}
