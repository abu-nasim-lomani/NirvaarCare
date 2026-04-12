"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
    Upload, CheckCircle2, FlaskConical, Clock, Loader2,
    FileText, AlertCircle, ExternalLink
} from "lucide-react";

type Submission = {
    id: string;
    task_id: string;
    submitted_at: string;
    tracking_ref?: string;
    notes?: string;
    report_url?: string;
    report_uploaded_at?: string;
    caregiver_tasks: {
        id: string;
        status: string;
        arrived_at?: string;
        sample_collected_at?: string;
        service_bookings: {
            id: string;
            service_name_en: string;
            patient_name: string;
            requester_name: string;
            scheduled_at?: string;
            booking_data: Record<string, any>;
        };
    };
};

export default function PartnerDashboard() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState<string | null>(null);
    const [reportUrls, setReportUrls] = useState<Record<string, string>>({});
    const [toast, setToast] = useState("");

    const fetchSubmissions = async () => {
        const res = await fetch("/api/partner/reports");
        const data = await res.json();
        setSubmissions(data.submissions || []);
        setLoading(false);
    };

    useEffect(() => { fetchSubmissions(); }, []);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(""), 4000);
    };

    const handleUpload = async (submissionId: string) => {
        const url = reportUrls[submissionId];
        if (!url?.trim()) return alert("Please enter the report URL.");

        setUploading(submissionId);
        const res = await fetch(`/api/partner/reports/${submissionId}/upload`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ report_url: url }),
        });

        if (res.ok) {
            showToast("Report uploaded successfully! Manager has been notified. ✓");
            fetchSubmissions();
        }
        setUploading(null);
    };

    const pending = submissions.filter(s => !s.report_uploaded_at);
    const completed = submissions.filter(s => !!s.report_uploaded_at);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            {/* Toast */}
            <div className={`fixed top-6 right-6 z-50 transition-all duration-500 ${toast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
                <div className="flex items-center gap-3 bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-medium min-w-[280px]">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                    {toast}
                </div>
            </div>

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-indigo-600 dark:from-purple-400 dark:to-indigo-300 bg-clip-text text-transparent">
                    Lab Reports
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Upload test reports for samples received from NirvaarCare caregivers.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                    { label: "Pending Upload",   value: pending.length,    icon: AlertCircle,   color: "text-amber-600",  bg: "bg-amber-100 dark:bg-amber-900/30" },
                    { label: "Reports Uploaded", value: completed.length,  icon: CheckCircle2,  color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
                    { label: "Total Received",   value: submissions.length, icon: FlaskConical, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
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

            {/* Pending Uploads */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Pending Report Upload
                    {pending.length > 0 && (
                        <span className="ml-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-semibold">{pending.length}</span>
                    )}
                </h2>

                {loading ? (
                    <div className="flex items-center gap-2 text-gray-400 py-8">
                        <Loader2 className="animate-spin" size={20} /> Loading submissions...
                    </div>
                ) : pending.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-10 text-center text-gray-400">
                        <CheckCircle2 size={36} className="mx-auto mb-3 text-emerald-200 dark:text-emerald-900" />
                        All reports have been uploaded. Great work!
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pending.map(sub => {
                            const booking = sub.caregiver_tasks?.service_bookings;
                            return (
                                <div key={sub.id} className="bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 shadow-sm space-y-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-amber-200 dark:border-amber-800">
                                                    <AlertCircle size={11} /> Awaiting Upload
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">{booking?.service_name_en}</h3>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                Patient: <strong className="text-gray-700 dark:text-gray-300">{booking?.patient_name}</strong>
                                            </p>
                                            <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={11} /> Received: {format(new Date(sub.submitted_at), "MMM d, h:mm a")}
                                                </span>
                                                {sub.tracking_ref && <span>Ref: <strong className="text-gray-600 dark:text-gray-300">{sub.tracking_ref}</strong></span>}
                                            </div>
                                            {sub.notes && <p className="text-xs text-gray-400 mt-1">Notes: {sub.notes}</p>}
                                        </div>
                                    </div>

                                    {/* Upload area */}
                                    <div className="flex gap-3">
                                        <input
                                            placeholder="Paste report URL (Google Drive, Dropbox, etc.)"
                                            value={reportUrls[sub.id] || ""}
                                            onChange={e => setReportUrls(prev => ({ ...prev, [sub.id]: e.target.value }))}
                                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                                        />
                                        <button
                                            onClick={() => handleUpload(sub.id)}
                                            disabled={uploading === sub.id}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-sm transition"
                                        >
                                            {uploading === sub.id ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                                            Upload
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Completed */}
            {completed.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Uploaded Reports</h2>
                    <div className="space-y-3">
                        {completed.map(sub => {
                            const booking = sub.caregiver_tasks?.service_bookings;
                            return (
                                <div key={sub.id} className="flex items-center justify-between bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4 opacity-75 hover:opacity-100 transition">
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-white text-sm">{booking?.service_name_en}</p>
                                        <p className="text-xs text-gray-400">{booking?.patient_name} • Uploaded {sub.report_uploaded_at && format(new Date(sub.report_uploaded_at), "MMM d, h:mm a")}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                                            <CheckCircle2 size={13} /> Uploaded
                                        </span>
                                        {sub.report_url && (
                                            <a href={sub.report_url} target="_blank" rel="noreferrer"
                                                className="flex items-center gap-1 text-xs text-gray-400 hover:text-purple-600 transition">
                                                <ExternalLink size={13} /> View
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
