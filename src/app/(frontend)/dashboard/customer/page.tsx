"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { format, formatDistanceToNow, isPast } from "date-fns";
import {
    Activity, Clock, FileText, HeartPulse, Stethoscope, Bell,
    CheckCircle2, XCircle, CalendarDays, Loader2, RefreshCw,
    ChevronDown, ChevronRight, AlertCircle, MessageSquare, ThumbsUp
} from "lucide-react";

type Appointment = {
    id: string;
    scheduled_at: string;
    status: string;
    type: string;
    appointment_note?: string;
    meeting_link?: string;
    customer_confirmed: boolean;
    is_later: boolean;
    service_bookings?: {
        service_name_en: string;
        patient_name: string;
    };
};

type Notification = {
    id: string;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    created_at: string;
};

type Booking = {
    id: string;
    service_name_en: string;
    patient_name: string;
    status: string;
    scheduled_at?: string;
    created_at: string;
    caregiver_tasks?: { status: string }[];
};

const APPT_STATUS_STYLE: Record<string, string> = {
    scheduled:            "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
    confirmed:            "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300",
    reschedule_requested: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300",
    completed:            "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400",
};

const TASK_STATUS_LABEL: Record<string, { label: string; pct: number }> = {
    pending_approval:   { label: "Awaiting Caregiver",  pct: 10 },
    approved:           { label: "Caregiver Accepted",   pct: 25 },
    travelling:         { label: "Caregiver On the Way", pct: 40 },
    arrived:            { label: "Arrived at Home",      pct: 55 },
    sample_collected:   { label: "Samples Collected",    pct: 70 },
    sample_sent_to_lab: { label: "Sent to Lab",          pct: 82 },
    patient_picked_up:  { label: "In Transit to Center", pct: 70 },
    arrived_at_center:  { label: "At Diagnostic Center", pct: 82 },
    patient_dropped_off:{ label: "Returned Home",        pct: 90 },
    report_uploaded:    { label: "Report Ready",         pct: 95 },
    completed:          { label: "Service Completed",    pct: 100 },
};

export default function CustomerDashboard() {
    const supabase = createClient();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [feedbacks, setFeedbacks] = useState<string[]>([]); // list of booking_ids that have feedback
    const [loading, setLoading] = useState(true);
    const [expandedAppt, setExpandedAppt] = useState<string | null>(null);
    const [rescheduleNote, setRescheduleNote] = useState("");
    const [acting, setActing] = useState<string | null>(null);

    // Feedback State
    const [feedbackBooking, setFeedbackBooking] = useState<string | null>(null);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submittingFeedback, setSubmittingFeedback] = useState(false);
    const [toast, setToast] = useState<{ msg: string; visible: boolean }>({ msg: "", visible: false });

    const showToast = (msg: string) => {
        setToast({ msg, visible: true });
        setTimeout(() => setToast({ msg: "", visible: false }), 4000);
    };

    const fetchAll = useCallback(async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        const [apptRes, notifRes, bookingData, feedbackData] = await Promise.all([
            fetch("/api/customer/appointments"),
            fetch("/api/notifications"),
            supabase.from("service_bookings")
                .select("id, service_name_en, patient_name, status, scheduled_at, created_at, caregiver_tasks(status)")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(10),
            supabase.from("service_feedback").select("booking_id").eq("customer_id", user.id),
        ]);

        const apptData = await apptRes.json();
        const notifData = await notifRes.json();

        setAppointments(apptData.appointments || []);
        setNotifications(notifData.notifications || []);
        setBookings((bookingData.data as any) || []);
        setFeedbacks(((feedbackData.data as any) || []).map((f: any) => f.booking_id));
        setLoading(false);
    }, [supabase]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const respondToAppt = async (apptId: string, action: "confirm" | "reschedule") => {
        setActing(apptId);
        const res = await fetch(`/api/admin/appointments/${apptId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action, reschedule_note: rescheduleNote }),
        });
        if (res.ok) {
            showToast(action === "confirm" ? "Appointment confirmed! ✓" : "Reschedule request sent to manager.");
            setRescheduleNote("");
            setExpandedAppt(null);
            await fetchAll();
        }
        setActing(null);
    };

    const submitFeedback = async (bookingId: string) => {
        if (!rating) return;
        setSubmittingFeedback(true);
        const res = await fetch("/api/customer/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ booking_id: bookingId, rating, comment }),
        });
        if (res.ok) {
            showToast("Feedback submitted successfully. Thank you! 💖");
            setFeedbacks(f => [...f, bookingId]);
        }
        setFeedbackBooking(null);
        setSubmittingFeedback(false);
    };

    const markNotifRead = async (ids: string[]) => {
        if (ids.length === 0) return;
        await fetch("/api/notifications", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids }),
        });
        setNotifications(prev => prev.map(n => ids.includes(n.id) ? { ...n, is_read: true } : n));
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;
    const upcomingAppts = appointments.filter(a => !isPast(new Date(a.scheduled_at)));
    const activeBookings = bookings.filter(b => !["Complete", "Cancelled"].includes(b.status));
    const completedPendingFeedback = bookings.filter(b => b.status === "Complete" && !feedbacks.includes(b.id));

    return (
        <div className="space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Toast */}
            <div className={`fixed top-6 right-6 z-[200] transition-all duration-500 ${toast.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
                <div className="flex items-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-medium">
                    <CheckCircle2 size={16} className="text-emerald-400 dark:text-emerald-600" />
                    {toast.msg}
                </div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-700 to-emerald-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                        My Health Dashboard
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                        Track your appointments, service progress, and notifications.
                    </p>
                </div>
                <button onClick={fetchAll} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition">
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Active Services",      value: activeBookings.length,  icon: HeartPulse,    color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
                    { label: "Unread Alerts",         value: unreadCount,            icon: Bell,          color: "text-red-600",     bg: "bg-red-50 dark:bg-red-900/20" },
                    { label: "Upcoming Appointments", value: upcomingAppts.length,   icon: CalendarDays,  color: "text-blue-600",    bg: "bg-blue-50 dark:bg-blue-900/20" },
                    { label: "Reports Ready",         value: bookings.filter(b => b.caregiver_tasks?.[0]?.status === "report_uploaded").length, icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
                ].map((s, i) => (
                    <div key={i} className={`${s.bg} rounded-2xl p-4`}>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{s.label}</p>
                            <s.icon size={16} className={s.color} />
                        </div>
                        <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Appointments Section */}
            {appointments.length > 0 && (
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Stethoscope size={18} className="text-blue-500" /> Doctor Appointments
                        </h2>
                        <span className="text-xs text-gray-400">{appointments.length} scheduled</span>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                        {appointments.map(appt => {
                            const isExpanded = expandedAppt === appt.id;
                            const past = isPast(new Date(appt.scheduled_at));
                            const needsAction = appt.type !== "online" && appt.status === "scheduled" && !appt.customer_confirmed && !past;
                            const isOnline = appt.type === "online";

                            return (
                                <div key={appt.id} className={`transition-all ${needsAction ? "bg-blue-50/50 dark:bg-blue-900/5" : ""}`}>
                                    <div
                                        className="px-6 py-4 flex items-start gap-4 cursor-pointer"
                                        onClick={() => setExpandedAppt(isExpanded ? null : appt.id)}
                                    >
                                        {/* Icon */}
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${needsAction ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-800"}`}>
                                            {isOnline ? <MessageSquare size={18} className={needsAction ? "text-purple-600" : "text-gray-500"} /> : <CalendarDays size={18} className={needsAction ? "text-blue-600" : "text-gray-500"} />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${APPT_STATUS_STYLE[appt.status] || "bg-gray-100 text-gray-500 border-gray-200"}`}>
                                                    {appt.status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                                                </span>
                                                {needsAction && (
                                                    <span className="text-xs text-blue-700 dark:text-blue-300 font-bold bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                                                        ⚡ Action Required
                                                    </span>
                                                )}
                                                {appt.is_later && (
                                                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">Advance Schedule</span>
                                                )}
                                            </div>
                                            <p className="font-bold text-gray-900 dark:text-white mt-1">
                                                {isOnline ? "Online Doctor Consultation" : "Doctor Appointment"} — {appt.service_bookings?.patient_name || "Patient"}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                                {format(new Date(appt.scheduled_at), "EEEE, MMMM d yyyy · h:mm a")}
                                            </p>
                                            {appt.appointment_note && (
                                                <p className="text-xs text-gray-400 italic mt-1">"{appt.appointment_note}"</p>
                                            )}
                                        </div>
                                        {isExpanded ? <ChevronDown size={16} className="text-gray-400 shrink-0 mt-1" /> : <ChevronRight size={16} className="text-gray-400 shrink-0 mt-1" />}
                                    </div>

                                    {/* Action Panel for in-person */}
                                    {isExpanded && needsAction && (
                                        <div className="px-6 pb-5 space-y-3">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Please confirm your availability for this appointment or request a reschedule.
                                            </p>
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <button
                                                    onClick={() => respondToAppt(appt.id, "confirm")}
                                                    disabled={acting === appt.id}
                                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition"
                                                >
                                                    {acting === appt.id ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                                                    Confirm Appointment
                                                </button>
                                                <button
                                                    onClick={() => respondToAppt(appt.id, "reschedule")}
                                                    disabled={acting === appt.id}
                                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 font-bold rounded-xl text-sm transition hover:bg-amber-50"
                                                >
                                                    <RefreshCw size={15} /> Request Reschedule
                                                </button>
                                            </div>
                                            <textarea
                                                placeholder="Reason for reschedule (optional)..."
                                                value={rescheduleNote}
                                                onChange={e => setRescheduleNote(e.target.value)}
                                                rows={2}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none resize-none"
                                            />
                                        </div>
                                    )}

                                    {isExpanded && appt.status === "confirmed" && (
                                        <div className="px-6 pb-5">
                                            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-sm font-semibold bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3">
                                                <CheckCircle2 size={15} /> You have confirmed this appointment. We look forward to seeing you!
                                            </div>
                                        </div>
                                    )}

                                    {/* Online Meeting Link */}
                                    {isExpanded && isOnline && !past && (
                                        <div className="px-6 pb-5 space-y-3">
                                            {appt.meeting_link ? (
                                                <a href={appt.meeting_link} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm transition">
                                                    Join Online Meeting
                                                </a>
                                            ) : (
                                                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 text-sm font-semibold bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
                                                    Meeting link will be provided by the manager shortly.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Active Service Progress */}
            {activeBookings.length > 0 && (
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                        <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Activity size={18} className="text-emerald-500" /> Active Service Progress
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                        {activeBookings.map(booking => {
                            const task = (booking as any).caregiver_tasks?.[0];
                            const taskMeta = task ? TASK_STATUS_LABEL[task.status] : null;
                            return (
                                <div key={booking.id} className="px-6 py-4">
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">{booking.service_name_en}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">Patient: {booking.patient_name}</p>
                                        </div>
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 ${
                                            booking.status === "Processing" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                                            booking.status === "Complete" ? "bg-emerald-100 text-emerald-700" :
                                            "bg-amber-100 text-amber-700"
                                        }`}>{booking.status}</span>
                                    </div>
                                    {taskMeta ? (
                                        <>
                                            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">{taskMeta.label}</p>
                                            <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-700"
                                                    style={{ width: `${taskMeta.pct}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                                                <span>Started</span>
                                                <span>{taskMeta.pct}%</span>
                                                <span>Complete</span>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">Awaiting assignment...</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Pending Feedback */}
            {completedPendingFeedback.length > 0 && (
                <div className="bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-800 rounded-3xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-emerald-50/50 dark:bg-emerald-900/10">
                        <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <ThumbsUp size={18} className="text-emerald-500" /> Share Your Feedback
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                        {completedPendingFeedback.map(booking => {
                            const isFeedbackOpen = feedbackBooking === booking.id;
                            return (
                                <div key={booking.id} className="px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">{booking.service_name_en}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Completed on {format(new Date(booking.created_at), "MMM d, yyyy")}</p>
                                        </div>
                                        <button
                                            onClick={() => { setFeedbackBooking(isFeedbackOpen ? null : booking.id); setRating(5); setComment(""); }}
                                            className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-800/40 font-semibold rounded-xl text-sm transition"
                                        >
                                            {isFeedbackOpen ? "Cancel" : "Rate Service"}
                                        </button>
                                    </div>
                                    {isFeedbackOpen && (
                                        <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 fade-in">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">How would you rate your experience?</p>
                                                <div className="flex items-center gap-2">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <button key={star} onClick={() => setRating(star)} className={`text-2xl transition-transform hover:scale-110 ${star <= rating ? "text-amber-400" : "text-gray-200 dark:text-gray-700"}`}>
                                                            ★
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <textarea
                                                placeholder="Tell us what you loved or what we can improve..."
                                                value={comment}
                                                onChange={e => setComment(e.target.value)}
                                                rows={3}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none resize-none"
                                            />
                                            <button
                                                onClick={() => submitFeedback(booking.id)}
                                                disabled={submittingFeedback}
                                                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition w-full sm:w-auto"
                                            >
                                                {submittingFeedback ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                                                Submit Feedback
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Notifications */}
            {notifications.length > 0 && (
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Bell size={18} className="text-amber-500" /> Notifications
                            {unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{unreadCount}</span>
                            )}
                        </h2>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => markNotifRead(notifications.filter(n => !n.is_read).map(n => n.id))}
                                className="text-xs text-emerald-600 hover:underline font-medium"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-800 max-h-80 overflow-y-auto">
                        {notifications.map(n => (
                            <div
                                key={n.id}
                                onClick={() => !n.is_read && markNotifRead([n.id])}
                                className={`px-6 py-4 flex items-start gap-3 cursor-pointer transition ${!n.is_read ? "bg-emerald-50/60 dark:bg-emerald-900/10 hover:bg-emerald-50 dark:hover:bg-emerald-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800/30"}`}
                            >
                                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                                    n.type === "critical" ? "bg-red-500" :
                                    n.type === "warning" ? "bg-amber-500" :
                                    n.is_read ? "bg-gray-300 dark:bg-gray-700" : "bg-emerald-500"
                                }`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{n.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{n.message}</p>
                                </div>
                                <span className="text-[10px] text-gray-400 shrink-0">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && appointments.length === 0 && bookings.length === 0 && notifications.length === 0 && (
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-16 text-center shadow-sm">
                    <HeartPulse size={48} className="mx-auto text-gray-200 dark:text-gray-700 mb-4" />
                    <p className="text-gray-500 font-medium">No active services yet.</p>
                    <p className="text-gray-400 text-sm mt-1">Your appointments, service progress, and notifications will appear here.</p>
                </div>
            )}
        </div>
    );
}
