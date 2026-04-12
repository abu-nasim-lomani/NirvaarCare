import { createAdminClient } from "./supabase/admin";

type PushInput = {
    recipient_role: string;
    recipient_id?: string;
    booking_id?: string;
    task_id?: string;
    type: "info" | "warning" | "critical";
    title: string;
    message: string;
};

export async function pushNotification(n: PushInput) {
    const admin = createAdminClient();
    await admin.from("notifications").insert({
        recipient_role: n.recipient_role,
        recipient_id: n.recipient_id ?? null,
        booking_id: n.booking_id ?? null,
        task_id: n.task_id ?? null,
        type: n.type,
        title: n.title,
        message: n.message,
    });
}
