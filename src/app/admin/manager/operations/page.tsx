"use client";

import { useEffect, useState, useCallback } from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
    CheckCircle2, MapPin, Microscope,
    Clock, Loader2, RefreshCw,
    UserCheck, FileText, ChevronDown, ChevronRight,
    Stethoscope, MessageSquare, ThumbsUp, Bell, Circle,
    CalendarClock, CalendarDays, X
} from "lucide-react";

type Task = {
    id: string;
    booking_id: string;
    caregiver_id: string;
    caregiver_name: string;
    status: string;
    cancel_reason?: string;
    approved_at?: string;
    travelling_at?: string;
    arrived_at?: string;
    sample_collected_at?: string;
    sample_sent_at?: string;
    report_uploaded_at?: string;
    completed_at?: string;
    service_bookings: {
        id: string;
        service_name_en: string;
        patient_name: string;
        requester_name: string;
        requester_phone?: string;
        scheduled_at?: string;
        booking_data: Record<string, any>;
    };
    sample_entries: any[];
    lab_submissions: any[];
};

const STEP_CONFIG = [
    { key: "approved",           label: "Assignment Accepted",     ts_field: "approved_at",         color: "emerald" },
    { key: "travelling",         label: "Travelling to Patient",   ts_field: "travelling_at",        color: "blue"    },
    { key: "arrived",            label: "Arrived at Home",         ts_field: "arrived_at",           color: "teal"    },
    { key: "sample_collected",   label: "Sample Collected",        ts_field: "sample_collected_at",  color: "indigo"  },
    { key: "sample_sent_to_lab", label: "Samples Sent to Lab",     ts_field: "sample_sent_at",       color: "purple"  },
    { key: "report_uploaded",    label: "Report Uploaded",         ts_field: "report_uploaded_at",   color: "green"   },
];

const STATUS_ORDER = ["pending_approval","approved","travelling","arrived","sample_collected","sample_sent_to_lab","report_uploaded","completed"];

const STATUS_BADGE: Record<string, string> = {
    pending_approval:   "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300",
    approved:           "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300",
    travelling:         "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
    arrived:            "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300",
    sample_collected:   "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300",
    sample_sent_to_lab: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300",
    report_uploaded:    "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300",
};

export default function ManagerOperationsPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [lastRefreshed, setLastRefreshed] = useState(new Date());
    const [deciding, setDeciding] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unread, setUnread] = useState(0);

    // Appointment scheduling state
    const [apptTaskId, setApptTaskId] = useState<string | null>(null);
    const [apptForm, setApptForm] = useState({
        scheduled_at: "",
        is_later: false,
        notify_caregiver: false,
        appointment_note: "",
    });
    const [submittingAppt, setSubmittingAppt] = useState(false);

    // Online consultation state
    const [consultTaskId, setConsultTaskId] = useState<string | null>(null);
    const [consultForm, setConsultForm] = useState({
        scheduled_at: "",
        meeting_link: "",
        notes: "",
    });
    const [submittingConsult, setSubmittingConsult] = useState(false);

    const fetchAll = useCallback(async () => {
        const [taskRes, notifRes] = await Promise.all([
            fetch("/api/admin/operations"),
            fetch("/api/notifications"),
        ]);
        const taskData = await taskRes.json();
        const notifData = await notifRes.json();
        setTasks(taskData.tasks || []);
        setNotifications(notifData.notifications || []);
        setUnread((notifData.notifications || []).filter((n: any) => !n.is_read).length);
        setLastRefreshed(new Date());
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchAll();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchAll, 30000);
        return () => clearInterval(interval);
    }, [fetchAll]);

    const markAllRead = async () => {
        const ids = notifications.filter(n => !n.is_read).map((n: any) => n.id);
        if (ids.length === 0) return;
        await fetch("/api/notifications", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids }),
        });
        setUnread(0);
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    };

    const handleDecision = async (taskId: string, bookingId: string, decision: string) => {
        if (decision === "doctor_appointment") {
            setApptTaskId(taskId);
            setConsultTaskId(null);
            setApptForm({ scheduled_at: "", is_later: false, notify_caregiver: false, appointment_note: "" });
            return;
        }
        if (decision === "online_consultation") {
            setConsultTaskId(taskId);
            setApptTaskId(null);
            setConsultForm({ scheduled_at: "", meeting_link: "", notes: "" });
            return;
        }

        setDeciding(taskId);
        if (decision === "close") {
            await fetch("/api/admin/operations", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ task_id: taskId, status: "completed" }),
            });
            await fetch("/api/notifications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipient_role: "customer",
                    booking_id: bookingId,
                    task_id: taskId,
                    type: "info",
                    title: "Service Completed — Feedback Requested",
                    message: "Your diagnostic service has been completed. Please take a moment to share your feedback.",
                }),
            }).catch(() => {});
        }
        await fetchAll();
        setDeciding(null);
    };

    const submitAppointment = async (task: Task) => {
        if (!apptForm.scheduled_at) return alert("Please select appointment date & time.");
        setSubmittingAppt(true);
        const res = await fetch("/api/admin/appointments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                booking_id: task.booking_id,
                task_id: task.id,
                caregiver_id: task.caregiver_id,
                scheduled_at: apptForm.scheduled_at,
                is_later: apptForm.is_later,
                notify_caregiver: apptForm.notify_caregiver,
                appointment_note: apptForm.appointment_note,
            }),
        });
        if (res.ok) {
            setApptTaskId(null);
            await fetchAll();
        }
        setSubmittingAppt(false);
    };

    const submitConsultation = async (task: Task) => {
        if (!consultForm.scheduled_at) return alert("Please select consultation date & time.");
        setSubmittingConsult(true);
        const res = await fetch("/api/admin/consultations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                booking_id: task.booking_id,
                task_id: task.id,
                caregiver_id: task.caregiver_id,
                scheduled_at: consultForm.scheduled_at,
                meeting_link: consultForm.meeting_link || null,
                notes: consultForm.notes || null,
            }),
        });
        if (res.ok) {
            setConsultTaskId(null);
            await fetchAll();
        }
        setSubmittingConsult(false);
    };

    const getTs = (task: Task, field: string): string | undefined => (task as any)[field];


    const tasksByUrgency = [
        ...tasks.filter(t => t.status === "report_uploaded"),
        ...tasks.filter(t => t.status === "pending_approval"),
        ...tasks.filter(t => !["report_uploaded", "pending_approval"].includes(t.status)),
    ];

    return (
        <div className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        Live Operations Monitor
                        <span className="relative flex h-2.5 w-2.5 ml-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Real-time tracking of all active caregiver field operations.
                        <span className="ml-2 text-xs text-gray-400">
                            Last updated: {formatDistanceToNow(lastRefreshed, { addSuffix: true })}
                        </span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {unread > 0 && (
                        <button onClick={markAllRead}
                            className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition">
                            <Bell size={15} className="animate-bounce" /> {unread} Alert{unread > 1 ? "s" : ""} — Mark Read
                        </button>
                    )}
                    <button onClick={fetchAll}
                        className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Active Tasks",       value: tasks.length,                                             color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
                    { label: "Needs Decision",      value: tasks.filter(t => t.status === "report_uploaded").length,color: "text-green-600",   bg: "bg-green-50 dark:bg-green-900/20" },
                    { label: "Pending Approval",    value: tasks.filter(t => t.status === "pending_approval").length,color: "text-amber-600",   bg: "bg-amber-50 dark:bg-amber-900/20" },
                    { label: "In Field",            value: tasks.filter(t => ["travelling","arrived","sample_collected","sample_sent_to_lab"].includes(t.status)).length, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
                ].map((s, i) => (
                    <div key={i} className={`rounded-2xl border p-4 ${s.bg} border-transparent`}>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{s.label}</p>
                        <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Active Task Cards */}
            {loading ? (
                <div className="flex items-center gap-3 text-gray-400 py-12 justify-center">
                    <Loader2 className="animate-spin" size={22} /> Loading operations...
                </div>
            ) : tasksByUrgency.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-12 text-center text-gray-400">
                    <CheckCircle2 size={40} className="mx-auto mb-3 text-gray-200 dark:text-gray-700" />
                    No active field operations right now.
                </div>
            ) : (
                <div className="space-y-4">
                    {tasksByUrgency.map(task => {
                        const currentStepIdx = STATUS_ORDER.indexOf(task.status);
                        const isExpanded = expanded === task.id;
                        const needsDecision = task.status === "report_uploaded";
                        const isCritical = task.status === "pending_approval";

                        return (
                            <div key={task.id} className={`bg-white dark:bg-gray-900 rounded-2xl border shadow-sm transition-all ${
                                needsDecision ? "border-green-300 dark:border-green-700 ring-1 ring-green-200 dark:ring-green-900" :
                                isCritical ? "border-amber-300 dark:border-amber-700 ring-1 ring-amber-200 dark:ring-amber-900" :
                                "border-gray-100 dark:border-gray-800"
                            }`}>
                                {/* Card Header */}
                                <div
                                    className="p-5 flex items-start justify-between gap-4 cursor-pointer"
                                    onClick={() => setExpanded(isExpanded ? null : task.id)}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-2">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_BADGE[task.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                                                <Circle size={7} className="fill-current" />
                                                {task.status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                                            </span>
                                            {needsDecision && (
                                                <span className="text-xs text-green-700 dark:text-green-300 font-bold bg-green-50 dark:bg-green-900/20 px-2.5 py-0.5 rounded-full border border-green-200 dark:border-green-800">
                                                    ⚡ Awaiting Your Decision
                                                </span>
                                            )}
                                            {task.service_bookings?.has_transport && (
                                                <span className="text-xs text-amber-700 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-900/20 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                                                    🚗 Transport
                                                </span>
                                            )}
                                            {task.service_bookings?.report_type === 'hardcopy' && (
                                                <span className="text-xs text-blue-700 dark:text-blue-300 font-bold bg-blue-50 dark:bg-blue-900/20 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                                                    📄 Hardcopy
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-gray-900 dark:text-white truncate">
                                            {task.service_bookings.service_name_en}
                                        </h3>
                                        <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <UserCheck size={11} /> {task.caregiver_name}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin size={11} /> {task.service_bookings.patient_name}
                                            </span>
                                            {task.service_bookings.scheduled_at && (
                                                <span className="flex items-center gap-1">
                                                    <CalendarClock size={11} />
                                                    {format(new Date(task.service_bookings.scheduled_at), "MMM d, h:mm a")}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {isExpanded ? <ChevronDown size={18} className="text-gray-400 shrink-0 mt-1" /> : <ChevronRight size={18} className="text-gray-400 shrink-0 mt-1" />}
                                </div>

                                {/* Mini Progress Bar */}
                                <div className="px-5 pb-4">
                                    <div className="flex items-center gap-1.5">
                                        {STEP_CONFIG.map((step, idx) => {
                                            const stepOrderIdx = STATUS_ORDER.indexOf(step.key);
                                            const isDone = currentStepIdx > stepOrderIdx;
                                            const isCurr = currentStepIdx === stepOrderIdx;
                                            return (
                                                <div key={step.key} className="flex items-center gap-1.5 flex-1">
                                                    <div className={`h-1.5 flex-1 rounded-full transition-all ${
                                                        isDone ? "bg-emerald-500" :
                                                        isCurr ? "bg-emerald-300 dark:bg-emerald-700" :
                                                        "bg-gray-200 dark:bg-gray-700"
                                                    }`} title={step.label} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                                        <span>Accepted</span>
                                        <span>Travelling</span>
                                        <span>Arrived</span>
                                        <span>Samples</span>
                                        <span>Lab</span>
                                        <span>Report</span>
                                    </div>
                                </div>

                                {/* Expanded Detail */}
                                {isExpanded && (
                                    <div className="border-t border-gray-100 dark:border-gray-800 p-5 space-y-5">
                                        {/* Timeline */}
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Time Log</h4>
                                            <div className="space-y-2">
                                                {STEP_CONFIG.map(step => {
                                                    const ts = getTs(task, step.ts_field);
                                                    if (!ts) return null;
                                                    return (
                                                        <div key={step.key} className="flex items-center gap-3 text-sm">
                                                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                                                            <span className="font-medium text-gray-700 dark:text-gray-300">{step.label}</span>
                                                            <span className="text-gray-400 text-xs ml-auto">{format(new Date(ts), "h:mm a")}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Samples collected */}
                                        {task.sample_entries.length > 0 && (
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-2">Samples Collected</h4>
                                                <div className="space-y-1.5">
                                                    {task.sample_entries.map((s: any, i: number) => (
                                                        <div key={i} className="flex items-center gap-2 text-sm bg-indigo-50 dark:bg-indigo-900/10 px-3 py-2 rounded-lg">
                                                            <Microscope size={13} className="text-indigo-400" />
                                                            <span className="font-medium text-gray-800 dark:text-gray-200">{s.test_name}</span>
                                                            <span className="text-gray-400 text-xs">({s.sample_type})</span>
                                                            {s.quantity && <span className="text-gray-400 text-xs">· {s.quantity}</span>}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Lab report */}
                                        {task.lab_submissions.length > 0 && task.lab_submissions[0].report_url && (
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-green-500 mb-2">Lab Report</h4>
                                                <a
                                                    href={task.lab_submissions[0].report_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 text-sm text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-2.5 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition font-medium"
                                                >
                                                    <FileText size={15} /> View Uploaded Report
                                                </a>
                                            </div>
                                        )}

                                        {/* POST-REPORT MANAGER DECISION */}
                                        {task.status === "report_uploaded" && (
                                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 space-y-4">
                                                <h4 className="font-bold text-emerald-800 dark:text-emerald-300 text-base">
                                                    📋 Post-Report Decision Required
                                                </h4>
                                                <p className="text-sm text-emerald-700/80 dark:text-emerald-400/80">
                                                    Choose the next step for this patient based on the lab report:
                                                </p>

                                                {/* Appointment Scheduling Form (opens inline) */}
                                                {apptTaskId === task.id ? (
                                                    <div className="bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-800 rounded-xl p-4 space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <h5 className="font-bold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                                                                <Stethoscope size={16} /> Schedule Doctor Appointment
                                                            </h5>
                                                            <button onClick={() => setApptTaskId(null)} className="text-gray-400 hover:text-gray-600">
                                                                <X size={16} />
                                                            </button>
                                                        </div>

                                                        {/* Timing Type */}
                                                        <div className="flex gap-3">
                                                            {[
                                                                { value: false, label: "Schedule Now", desc: "Patient notified immediately" },
                                                                { value: true,  label: "Schedule for Later", desc: "Reminder sent before the date" },
                                                            ].map(opt => (
                                                                <label key={String(opt.value)}
                                                                    className={`flex-1 flex flex-col gap-1 p-3 rounded-xl border cursor-pointer transition ${apptForm.is_later === opt.value ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600" : "border-gray-200 dark:border-gray-700 hover:border-blue-300"}`}>
                                                                    <input type="radio" className="sr-only" checked={apptForm.is_later === opt.value}
                                                                        onChange={() => setApptForm(f => ({ ...f, is_later: opt.value }))} />
                                                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{opt.label}</span>
                                                                    <span className="text-xs text-gray-400">{opt.desc}</span>
                                                                </label>
                                                            ))}
                                                        </div>

                                                        {/* Date & Time */}
                                                        <div>
                                                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                                                                <CalendarDays size={12} className="inline mr-1" />
                                                                Appointment Date & Time
                                                            </label>
                                                            <input
                                                                type="datetime-local"
                                                                value={apptForm.scheduled_at}
                                                                onChange={e => setApptForm(f => ({ ...f, scheduled_at: e.target.value }))}
                                                                min={new Date().toISOString().slice(0, 16)}
                                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                                            />
                                                        </div>

                                                        {/* Notify Caregiver Toggle */}
                                                        <label className="flex items-center gap-3 cursor-pointer select-none">
                                                            <div className="relative">
                                                                <input type="checkbox" className="sr-only"
                                                                    checked={apptForm.notify_caregiver}
                                                                    onChange={e => setApptForm(f => ({ ...f, notify_caregiver: e.target.checked }))} />
                                                                <div className={`w-10 h-6 rounded-full transition-colors ${apptForm.notify_caregiver ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"}`} />
                                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${apptForm.notify_caregiver ? "translate-x-5" : "translate-x-1"}`} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900 dark:text-white">Notify Caregiver</p>
                                                                <p className="text-xs text-gray-400">Also inform the assigned caregiver</p>
                                                            </div>
                                                        </label>

                                                        {/* Notes */}
                                                        <textarea
                                                            placeholder="Appointment notes (optional)..."
                                                            value={apptForm.appointment_note}
                                                            onChange={e => setApptForm(f => ({ ...f, appointment_note: e.target.value }))}
                                                            rows={2}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none resize-none text-gray-900 dark:text-white"
                                                        />

                                                        <button
                                                            onClick={() => submitAppointment(task)}
                                                            disabled={submittingAppt}
                                                            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition"
                                                        >
                                                            {submittingAppt ? <Loader2 size={17} className="animate-spin" /> : <CalendarDays size={17} />}
                                                            Confirm Appointment & Notify Patient
                                                        </button>
                                                    </div>
                                                ) : consultTaskId === task.id ? (
                                                    <div className="bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-800 rounded-xl p-4 space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <h5 className="font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
                                                                <MessageSquare size={16} /> Schedule Online Consultation
                                                            </h5>
                                                            <button onClick={() => setConsultTaskId(null)} className="text-gray-400 hover:text-gray-600">
                                                                <X size={16} />
                                                            </button>
                                                        </div>

                                                        {/* Date & Time */}
                                                        <div>
                                                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                                                                <CalendarDays size={12} className="inline mr-1" />
                                                                Consultation Date & Time
                                                            </label>
                                                            <input
                                                                type="datetime-local"
                                                                value={consultForm.scheduled_at}
                                                                onChange={e => setConsultForm(f => ({ ...f, scheduled_at: e.target.value }))}
                                                                min={new Date().toISOString().slice(0, 16)}
                                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                                                            />
                                                        </div>

                                                        {/* Meeting Link */}
                                                        <div>
                                                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                                                                Meeting Link (Optional)
                                                            </label>
                                                            <input
                                                                type="url"
                                                                placeholder="e.g. https://meet.google.com/..."
                                                                value={consultForm.meeting_link}
                                                                onChange={e => setConsultForm(f => ({ ...f, meeting_link: e.target.value }))}
                                                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                                                            />
                                                            <p className="text-[10px] text-gray-400 mt-1">Leave empty to provide later</p>
                                                        </div>

                                                        {/* Notes */}
                                                        <textarea
                                                            placeholder="Instructions for the doctor/patient..."
                                                            value={consultForm.notes}
                                                            onChange={e => setConsultForm(f => ({ ...f, notes: e.target.value }))}
                                                            rows={2}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none resize-none text-gray-900 dark:text-white"
                                                        />

                                                        <button
                                                            onClick={() => submitConsultation(task)}
                                                            disabled={submittingConsult}
                                                            className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition"
                                                        >
                                                            {submittingConsult ? <Loader2 size={17} className="animate-spin" /> : <MessageSquare size={17} />}
                                                            Confirm Consultation & Notify
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        <button
                                                            onClick={() => handleDecision(task.id, task.booking_id, "doctor_appointment")}
                                                            className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition text-center"
                                                        >
                                                            <Stethoscope size={22} className="text-blue-500" />
                                                            <span className="text-sm font-bold text-gray-900 dark:text-white">Doctor Appointment</span>
                                                            <span className="text-xs text-gray-400">Schedule in-person visit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDecision(task.id, task.booking_id, "online_consultation")}
                                                            disabled={deciding === task.id}
                                                            className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-800 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition text-center"
                                                        >
                                                            <MessageSquare size={22} className="text-purple-500" />
                                                            <span className="text-sm font-bold text-gray-900 dark:text-white">Online Consultation</span>
                                                            <span className="text-xs text-gray-400">Arrange video call with doctor</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDecision(task.id, task.booking_id, "close")}
                                                            disabled={deciding === task.id}
                                                            className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-900 border border-emerald-200 dark:border-emerald-800 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition text-center"
                                                        >
                                                            {deciding === task.id ? <Loader2 size={22} className="animate-spin text-emerald-500" /> : <ThumbsUp size={22} className="text-emerald-500" />}
                                                            <span className="text-sm font-bold text-gray-900 dark:text-white">Close Service</span>
                                                            <span className="text-xs text-gray-400">Collect feedback & complete</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Patient Contact Info */}
                                        {task.service_bookings.requester_phone && (
                                            <div className="flex items-center gap-2 text-sm text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-3">
                                                Contact: <a href={`tel:${task.service_bookings.requester_phone}`} className="text-emerald-600 hover:underline font-medium">{task.service_bookings.requester_phone}</a>
                                                {task.service_bookings.booking_data?.patAddress && (
                                                    <span className="text-gray-400">• {task.service_bookings.booking_data.patAddress}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Recent Notifications Panel */}
            {notifications.length > 0 && (
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Bell size={17} /> Recent Activity Feed
                        </h2>
                        {unread > 0 && (
                            <button onClick={markAllRead} className="text-xs text-emerald-600 hover:underline">Mark all read</button>
                        )}
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-gray-800 max-h-72 overflow-y-auto">
                        {notifications.slice(0, 15).map((n: any) => (
                            <div key={n.id} className={`px-5 py-3 flex items-start gap-3 ${!n.is_read ? "bg-emerald-50/50 dark:bg-emerald-900/10" : ""}`}>
                                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                                    n.type === "critical" ? "bg-red-500" :
                                    n.type === "warning" ? "bg-amber-500" : "bg-emerald-400"
                                }`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{n.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{n.message}</p>
                                </div>
                                <span className="text-xs text-gray-400 shrink-0">
                                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
