import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { pushNotification } from "@/lib/notifications";

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params; // lab_submission id
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { report_url } = body;

    if (!report_url) {
        return NextResponse.json({ error: "report_url is required" }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Verify this partner owns this submission
    const { data: submission } = await adminClient
        .from("lab_submissions")
        .select("task_id, partner_id")
        .eq("id", id)
        .single();

    if (!submission || submission.partner_id !== user.id) {
        return NextResponse.json({ error: "Not found or unauthorized" }, { status: 403 });
    }

    // Update lab_submission with report URL
    await adminClient
        .from("lab_submissions")
        .update({
            report_url,
            report_uploaded_at: new Date().toISOString(),
        })
        .eq("id", id);

    // Update the task status to report_uploaded
    await adminClient
        .from("caregiver_tasks")
        .update({
            status: "report_uploaded",
            report_uploaded_at: new Date().toISOString(),
        })
        .eq("id", submission.task_id);

    // Get booking_id for notification
    const { data: task } = await adminClient
        .from("caregiver_tasks")
        .select("booking_id")
        .eq("id", submission.task_id)
        .single();

    if (task) {
        await pushNotification({
            recipient_role: "manager",
            booking_id: task.booking_id,
            task_id: submission.task_id,
            type: "info",
            title: "📋 Lab Report Uploaded",
            message: "The diagnostic partner has uploaded the lab report. Please review and decide on next steps.",
        });
    }

    return NextResponse.json({ success: true, message: "Report uploaded successfully." });
}
