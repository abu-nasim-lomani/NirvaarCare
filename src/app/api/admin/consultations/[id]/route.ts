import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { pushNotification } from "@/lib/notifications";

// PATCH: Doctor marks consultation as done, or manager updates
export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { status, meeting_link, notes } = body;

    const adminClient = createAdminClient();
    const updateData: Record<string, any> = {};
    if (status) updateData.status = status;
    if (meeting_link) updateData.meeting_link = meeting_link;
    if (notes !== undefined) updateData.notes = notes;

    const { error } = await adminClient.from("consultations").update(updateData).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // If marked done, notify manager
    if (status === "completed") {
        const { data: consult } = await adminClient
            .from("consultations")
            .select("booking_id, task_id")
            .eq("id", id)
            .single();
        if (consult) {
            await pushNotification({
                recipient_role: "manager",
                booking_id: consult.booking_id,
                task_id: consult.task_id || undefined,
                type: "info",
                title: "✅ Online Consultation Completed",
                message: "The doctor has marked the online consultation as completed.",
            });
        }
    }

    return NextResponse.json({ success: true });
}
