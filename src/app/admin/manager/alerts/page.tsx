"use client";

import { useState } from "react";
import { ShieldAlert, AlertTriangle, Check } from "lucide-react";

type Alert = {
    id: number;
    severity: "critical" | "warning" | "info";
    title: string;
    description: string;
    time: string;
    resolved: boolean;
};

const MOCK_ALERTS: Alert[] = [
    {
        id: 1,
        severity: "critical",
        title: "Caregiver Check-In Overdue",
        description: "Booking #OP-8419 — Assigned caregiver 'Hassan Ali' has not checked in at the patient location. 25 minutes overdue.",
        time: "2 mins ago",
        resolved: false,
    },
    {
        id: 2,
        severity: "warning",
        title: "Partner Lab Report Delay",
        description: "Diagnostic order from 'Medinova Lab' for patient 'Rahim Uddin' was expected 2 hours ago and is still pending upload.",
        time: "1 hour ago",
        resolved: false,
    },
    {
        id: 3,
        severity: "info",
        title: "New Doctor Account Created",
        description: "Dr. Salma Begum's account was successfully created and provisioned for tele-consultation access.",
        time: "3 hours ago",
        resolved: true,
    },
];

const SEVERITY_STYLES = {
    critical: {
        border: "border-red-200 dark:border-red-900/40",
        bg: "bg-red-50 dark:bg-red-900/10",
        icon: "text-red-500",
        badge: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
        dot: "bg-red-500 animate-pulse",
    },
    warning: {
        border: "border-amber-200 dark:border-amber-900/40",
        bg: "bg-amber-50 dark:bg-amber-900/10",
        icon: "text-amber-500",
        badge: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
        dot: "bg-amber-500",
    },
    info: {
        border: "border-blue-100 dark:border-blue-900/40",
        bg: "bg-blue-50/50 dark:bg-blue-900/10",
        icon: "text-blue-400",
        badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
        dot: "bg-blue-400",
    },
};

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);

    const resolve = (id: number) => {
        setAlerts(prev =>
            prev.map(a => (a.id === id ? { ...a, resolved: true } : a))
        );
    };

    const activeAlerts = alerts.filter(a => !a.resolved);
    const resolvedAlerts = alerts.filter(a => a.resolved);

    return (
        <div className="p-6 lg:p-10 max-w-5xl mx-auto w-full space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                    <ShieldAlert className="text-red-500" size={30} />
                    System Alerts
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Monitor and resolve critical operational issues in real time.</p>
            </div>

            {/* Summary Pills */}
            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-sm font-bold text-red-700 dark:text-red-300">{activeAlerts.filter(a => a.severity === "critical").length} Critical</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="text-sm font-bold text-amber-700 dark:text-amber-300">{activeAlerts.filter(a => a.severity === "warning").length} Warning</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <Check size={14} className="text-emerald-500" />
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{resolvedAlerts.length} Resolved</span>
                </div>
            </div>

            {/* Active Alerts */}
            {activeAlerts.length > 0 ? (
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Active Alerts</h2>
                    {activeAlerts.map((alert) => {
                        const styles = SEVERITY_STYLES[alert.severity];
                        return (
                            <div
                                key={alert.id}
                                className={`group flex items-start gap-5 p-5 rounded-2xl border ${styles.border} ${styles.bg} transition-all`}
                            >
                                <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${styles.dot}`}></div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h3 className="font-bold text-gray-900 dark:text-white">{alert.title}</h3>
                                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${styles.badge}`}>
                                            {alert.severity}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{alert.description}</p>
                                    <p className="text-xs text-gray-400 mt-2">{alert.time}</p>
                                </div>
                                <button
                                    onClick={() => resolve(alert.id)}
                                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-sm font-semibold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-4 py-2 rounded-xl shadow-sm"
                                >
                                    <Check size={14} /> Resolve
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
                    <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                        <ShieldAlert className="text-emerald-500" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">All Clear</h3>
                    <p className="text-gray-500">No active alerts at this time. Great work!</p>
                </div>
            )}

            {/* Resolved Alerts (collapsed) */}
            {resolvedAlerts.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Resolved</h2>
                    {resolvedAlerts.map((alert) => (
                        <div
                            key={alert.id}
                            className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 opacity-60"
                        >
                            <Check size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 line-through">{alert.title}</p>
                                <p className="text-xs text-gray-400 mt-0.5">Resolved • {alert.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
