"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
    CalendarCheck, Clock, CheckCircle2, XCircle,
    ArrowRight, Bell, Loader2, MapPin, Microscope,
    AlertTriangle, CircleDashed
} from "lucide-react";

type Task = {
    id: string;
    status: string;
    created_at: string;
    approved_at?: string;
    service_bookings: {
        service_name_en: string;
        patient_name: string;
        requester_name: string;
        requester_phone: string;
        scheduled_at?: string;
        booking_data: Record<string, any>;
    };
};

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    pending_approval:  { label: "Pending Your Approval", color: "text-amber-600 dark:text-amber-400",  bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800", icon: <Clock size={16} /> },
    approved:          { label: "Approved — Ready",       color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800", icon: <CheckCircle2 size={16} /> },
    travelling:        { label: "On the Way",             color: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800", icon: <MapPin size={16} /> },
    arrived:           { label: "Arrived at Home",        color: "text-teal-600 dark:text-teal-400",    bg: "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800", icon: <CheckCircle2 size={16} /> },
    sample_collected:  { label: "Sample Collected",       color: "text-indigo-600 dark:text-indigo-400",bg: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800", icon: <Microscope size={16} /> },
    sample_sent_to_lab:{ label: "Sample Sent to Lab",     color: "text-purple-600 dark:text-purple-400",bg: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800", icon: <CircleDashed size={16} /> },
    report_uploaded:   { label: "Report Uploaded",        color: "text-green-600 dark:text-green-400",  bg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800", icon: <CheckCircle2 size={16} /> },
    completed:         { label: "Completed ✓",            color: "text-gray-500",                        bg: "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700", icon: <CheckCircle2 size={16} /> },
    cancelled:         { label: "Cancelled",              color: "text-red-600 dark:text-red-400",      bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800", icon: <XCircle size={16} /> },
};

export default function CaregiverDashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [unread, setUnread] = useState(0);

    useEffect(() => {
        fetch("/api/caregiver/tasks")
            .then(r => r.json())
            .then(d => { setTasks(d.tasks || []); setLoading(false); });

        fetch("/api/notifications")
            .then(r => r.json())
            .then(d => setUnread((d.notifications || []).filter((n: any) => !n.is_read).length));
    }, []);

    const active = tasks.filter(t => !["completed", "cancelled"].includes(t.status));
    const history = tasks.filter(t => ["completed", "cancelled"].includes(t.status));

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-700 to-emerald-600 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                        My Assignments
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Review and manage your assigned service tasks.
                    </p>
                </div>
                {unread > 0 && (
                    <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-2 rounded-xl text-sm font-semibold">
                        <Bell size={16} className="animate-bounce" />
                        {unread} unread notification{unread > 1 ? "s" : ""}
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Active Tasks",    value: active.length,  icon: CalendarCheck, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
                    { label: "Pending Approval", value: tasks.filter(t => t.status === "pending_approval").length, icon: Clock, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30" },
                    { label: "Completed",        value: tasks.filter(t => t.status === "completed").length, icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
                    { label: "Cancelled",        value: tasks.filter(t => t.status === "cancelled").length, icon: XCircle, color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" },
                ].map((s, i) => (
                    <div key={i} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{s.value}</p>
                            </div>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg} ${s.color}`}>
                                <s.icon size={20} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Active Tasks */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Active Tasks</h2>
                {loading ? (
                    <div className="flex items-center gap-2 text-gray-400 py-8">
                        <Loader2 className="animate-spin" size={20} /> Loading tasks...
                    </div>
                ) : active.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-10 text-center text-gray-400">
                        <CalendarCheck size={36} className="mx-auto mb-3 text-gray-200 dark:text-gray-700" />
                        No active assignments at this time.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {active.map(task => {
                            const meta = STATUS_META[task.status] || STATUS_META.pending_approval;
                            const booking = task.service_bookings;
                            return (
                                <div key={task.id} className={`bg-white dark:bg-gray-900 border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all ${task.status === "pending_approval" ? "border-amber-300 dark:border-amber-700 ring-1 ring-amber-200 dark:ring-amber-900" : "border-gray-100 dark:border-gray-800"}`}>
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 flex-wrap mb-2">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${meta.bg} ${meta.color}`}>
                                                    {meta.icon} {meta.label}
                                                </span>
                                                {task.status === "pending_approval" && (
                                                    <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                                                        <AlertTriangle size={12} /> Action Required
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">{booking.service_name_en}</h3>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                Patient: <strong className="text-gray-700 dark:text-gray-300">{booking.patient_name}</strong>
                                                {booking.booking_data?.patAddress && <> • {booking.booking_data.patAddress}</>}
                                            </p>
                                            {booking.scheduled_at && (
                                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                    <Clock size={11} /> Scheduled: {format(new Date(booking.scheduled_at), "MMM d, yyyy 'at' h:mm a")}
                                                </p>
                                            )}
                                        </div>
                                        <Link
                                            href={`/dashboard/caregiver/task/${task.id}`}
                                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm whitespace-nowrap shadow-sm shadow-emerald-600/20"
                                        >
                                            {task.status === "pending_approval" ? "Review & Decide" : "Continue Task"}
                                            <ArrowRight size={15} />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* History */}
            {history.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Past Tasks</h2>
                    <div className="space-y-3">
                        {history.map(task => {
                            const meta = STATUS_META[task.status] || STATUS_META.completed;
                            return (
                                <Link key={task.id} href={`/dashboard/caregiver/task/${task.id}`}
                                    className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition opacity-70 hover:opacity-100">
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-white text-sm">{task.service_bookings.service_name_en}</p>
                                        <p className="text-xs text-gray-400">{task.service_bookings.patient_name} • {format(new Date(task.created_at), "MMM d, yyyy")}</p>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${meta.bg} ${meta.color}`}>
                                        {meta.icon} {meta.label}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
