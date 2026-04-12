import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { pushNotification } from "@/lib/notifications";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const adminClient = createAdminClient();
    const { data, error } = await adminClient
        .from("sample_entries")
        .select("*")
        .eq("task_id", id)
        .order("collected_at", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ samples: data });
}

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { samples } = body; // array of { sample_type, test_name, quantity, notes }

    if (!samples || samples.length === 0) {
        return NextResponse.json({ error: "At least one sample entry is required" }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Delete existing entries and replace with new ones (full replace)
    await adminClient.from("sample_entries").delete().eq("task_id", id);

    const entries = samples.map((s: any) => ({
        task_id: id,
        sample_type: s.sample_type,
        test_name: s.test_name,
        quantity: s.quantity || null,
        notes: s.notes || null,
    }));

    const { error } = await adminClient.from("sample_entries").insert(entries);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Get booking_id to notify manager
    const { data: task } = await adminClient
        .from("caregiver_tasks")
        .select("booking_id")
        .eq("id", id)
        .single();

    if (task) {
        const sampleList = samples.map((s: any) => `${s.test_name} (${s.sample_type})`).join(", ");
        await pushNotification({
            recipient_role: "manager",
            booking_id: task.booking_id,
            task_id: id,
            type: "info",
            title: "Sample Collection Details Submitted",
            message: `Caregiver submitted sample details: ${sampleList}`,
        });
    }

    return NextResponse.json({ success: true });
}
