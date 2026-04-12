"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { format, isPast, formatDistanceToNow } from "date-fns";
import {
    Stethoscope, CalendarDays, CheckCircle2, Clock, Loader2,
    RefreshCw, Video, Bell, ExternalLink, Circle, ChevronDown, ChevronRight
} from "lucide-react";

type Consultation = {
    id: string;
    scheduled_at: string;
    status: string;
    type: string;
    meeting_link?: string;
    notes?: string;
    service_bookings?: {
        service_name_en: string;
        patient_name: string;
        requester_phone?: string;
    };
};

const STATUS_STYLE: Record<string, string> = {
    scheduled:  "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
    confirmed:  "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300",
    completed:  "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800",
    cancelled:  "bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30",
};

export default function DoctorDashboard() {
    const supabase = createClient();
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [marking, setMarking] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [toast, setToast] = useState<{ msg: string; visible: boolean }>({ msg: "", visible: false });

    const showToast = (msg: string) => {
        setToast({ msg, visible: true });
        setTimeout(() => setToast({ msg: "", visible: false }), 4000);
    };

    const fetchAll = useCallback(async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        const [consultRes, notifRes] = await Promise.all([
            supabase
                .from("consultations")
                .select(`*, service_bookings(service_name_en, patient_name, requester_phone)`)
                .eq("doctor_id", user.id)
                .order("scheduled_at", { ascending: true }),
            fetch("/api/notifications"),
        ]);

        setConsultations((consultRes.data as any) || []);
        const notifData = await notifRes.json();
        setNotifications(notifData.notifications || []);
        setLoading(false);
    }, [supabase]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const markDone = async (id: string) => {
        setMarking(id);
        await fetch(`/api/admin/consultations/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "completed" }),
        });
        showToast("Consultation marked as completed ✓");
        await fetchAll();
        setMarking(null);
    };

    const markNotifRead = async () => {
        const ids = notifications.filter((n: any) => !n.is_read).map((n: any) => n.id);
        if (!ids.length) return;
        await fetch("/api/notifications", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids }),
        });
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    };

    const upcoming = consultations.filter(c => !isPast(new Date(c.scheduled_at)) && c.status !== "completed");
    const past = consultations.filter(c => isPast(new Date(c.scheduled_at)) || c.status === "completed");
    const unread = notifications.filter((n: any) => !n.is_read).length;

    return (
        <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto">
            {/* Toast */}
            <div className={`fixed top-6 right-6 z-[200] transition-all duration-500 ${toast.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
                <div className="flex items-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-medium min-w-[260px]">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                    {toast.msg}
                </div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Stethoscope size={24} className="text-blue-500" />
                        Doctor Dashboard
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Your scheduled online consultations
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {unread > 0 && (
                        <button onClick={markNotifRead}
                            className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-1.5 rounded-xl hover:bg-red-100 transition">
                            <Bell size={13} className="animate-bounce" /> {unread} New Alert{unread > 1 ? "s" : ""}
                        </button>
                    )}
                    <button onClick={fetchAll} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition">
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Upcoming",  value: upcoming.length,                                       color: "text-blue-600",    bg: "bg-blue-50 dark:bg-blue-900/20" },
                    { label: "Completed", value: past.filter(c => c.status === "completed").length,    color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
                    { label: "Total",     value: consultations.length,                                  color: "text-gray-600",    bg: "bg-gray-50 dark:bg-gray-800" },
                ].map((s, i) => (
                    <div key={i} className={`${s.bg} rounded-2xl p-4`}>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{s.label}</p>
                        <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Upcoming Consultations */}
            {loading ? (
                <div className="flex items-center gap-2 text-gray-400 py-12 justify-center">
                    <Loader2 className="animate-spin" size={20} /> Loading consultations...
                </div>
            ) : upcoming.length > 0 ? (
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                        <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Clock size={16} className="text-blue-400" /> Upcoming Consultations
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                        {upcoming.map(c => {
                            const isExpanded = expanded === c.id;
                            const isNear = new Date(c.scheduled_at).getTime() - Date.now() < 3600000; // within 1hr
                            return (
                                <div key={c.id} className={isNear ? "bg-blue-50/40 dark:bg-blue-900/10" : ""}>
                                    <div className="p-5 flex items-start gap-4 cursor-pointer"
                                        onClick={() => setExpanded(isExpanded ? null : c.id)}>
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${isNear ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-800"}`}>
                                            <Video size={17} className={isNear ? "text-blue-500" : "text-gray-500"} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${STATUS_STYLE[c.status]}`}>
                                                    {c.status.replace(/_/g, " ").replace(/\b\w/g, s => s.toUpperCase())}
                                                </span>
                                                {isNear && (
                                                    <span className="text-xs text-blue-700 dark:text-blue-300 font-bold bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full animate-pulse">
                                                        Starting Soon
                                                    </span>
                                                )}
                                            </div>
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                {c.service_bookings?.patient_name || "Patient"}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {c.service_bookings?.service_name_en}
                                            </p>
                                            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1 flex items-center gap-1">
                                                <CalendarDays size={12} />
                                                {format(new Date(c.scheduled_at), "EEEE, MMM d · h:mm a")}
                                            </p>
                                        </div>
                                        {isExpanded ? <ChevronDown size={16} className="text-gray-400 shrink-0 mt-1" /> : <ChevronRight size={16} className="text-gray-400 shrink-0 mt-1" />}
                                    </div>

                                    {isExpanded && (
                                        <div className="px-5 pb-5 space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                                            {/* Meeting Link */}
                                            {c.meeting_link ? (
                                                <a
                                                    href={c.meeting_link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition justify-center"
                                                >
                                                    <Video size={16} /> Join Meeting <ExternalLink size={13} />
                                                </a>
                                            ) : (
                                                <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
                                                    Meeting link not yet available. Please check back before the consultation.
                                                </p>
                                            )}
                                            {c.notes && (
                                                <p className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-3">
                                                    <strong>Manager Note:</strong> {c.notes}
                                                </p>
                                            )}
                                            {c.service_bookings?.requester_phone && (
                                                <p className="text-xs text-gray-500">
                                                    Contact: <a href={`tel:${c.service_bookings.requester_phone}`} className="text-blue-600 hover:underline">{c.service_bookings.requester_phone}</a>
                                                </p>
                                            )}
                                            {/* Mark Done */}
                                            <button
                                                onClick={() => markDone(c.id)}
                                                disabled={marking === c.id}
                                                className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition"
                                            >
                                                {marking === c.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                                Mark Consultation as Completed
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-12 text-center text-gray-400 shadow-sm">
                    <Stethoscope size={40} className="mx-auto mb-3 text-gray-200 dark:text-gray-700" />
                    <p className="font-medium">No upcoming consultations</p>
                    <p className="text-sm mt-1">New consultations assigned by the manager will appear here.</p>
                </div>
            )}

            {/* Past Consultations */}
            {past.length > 0 && (
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                        <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-emerald-400" /> Past Consultations
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                        {past.map(c => (
                            <div key={c.id} className="px-5 py-4 flex items-center gap-4">
                                <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                                    <CheckCircle2 size={14} className="text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{c.service_bookings?.patient_name}</p>
                                    <p className="text-xs text-gray-400">{format(new Date(c.scheduled_at), "MMM d, h:mm a")}</p>
                                </div>
                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${STATUS_STYLE[c.status] || STATUS_STYLE.completed}`}>
                                    {c.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
