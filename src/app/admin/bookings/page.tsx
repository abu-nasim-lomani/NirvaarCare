"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import {
    CheckCircle2, CircleDashed, Clock, FileWarning, Search,
    XCircle, FileText, ChevronDown, UserCheck, Building2,
    CalendarClock, ClipboardCheck, Loader2, ArrowRight, StickyNote,
    RefreshCw, MapPin, Microscope, FlaskConical, Upload, Activity
} from "lucide-react";

type CaregiverTask = {
    id: string;
    status: string;
    caregiver_id: string;
    approved_at?: string;
    travelling_at?: string;
    arrived_at?: string;
    sample_collected_at?: string;
    sample_sent_at?: string;
    report_uploaded_at?: string;
    completed_at?: string;
    cancel_reason?: string;
};

type Booking = {
    id: string;
    created_at: string;
    service_name_en: string;
    requester_name: string;
    requester_phone: string;
    patient_name: string;
    status: string;
    booking_data: Record<string, any>;
    assigned_caregiver_id?: string;
    assigned_partner_id?: string;
    scheduled_at?: string;
    manager_notes?: string;
    has_transport?: boolean;
    report_type?: string;
    caregiver_tasks?: CaregiverTask[];
};

type Personnel = { id: string; email: string; full_name: string };

// Caregiver task step labels & timestamps
const TASK_STEPS = [
    { key: "approved",           label: "Accepted",        ts: "approved_at" },
    { key: "travelling",         label: "Travelling",      ts: "travelling_at" },
    { key: "arrived",            label: "Arrived",         ts: "arrived_at" },
    { key: "sample_collected",   label: "Samples",         ts: "sample_collected_at" },
    { key: "sample_sent_to_lab", label: "Lab Sent",        ts: "sample_sent_at" },
    { key: "report_uploaded",    label: "Report Ready",    ts: "report_uploaded_at" },
    { key: "completed",          label: "Completed",       ts: "completed_at" },
];
const TASK_STATUS_ORDER = ["pending_approval","approved","travelling","arrived","sample_collected","sample_sent_to_lab","report_uploaded","completed"];

const TASK_STATUS_LABEL: Record<string, { label: string; color: string }> = {
    pending_approval:   { label: "Awaiting Caregiver",  color: "text-amber-600 dark:text-amber-400" },
    approved:           { label: "Caregiver Accepted",   color: "text-emerald-600 dark:text-emerald-400" },
    travelling:         { label: "On the Way",           color: "text-blue-600 dark:text-blue-400" },
    arrived:            { label: "Arrived at Home",      color: "text-teal-600 dark:text-teal-400" },
    sample_collected:   { label: "Samples Collected",   color: "text-indigo-600 dark:text-indigo-400" },
    sample_sent_to_lab: { label: "Sent to Lab",          color: "text-purple-600 dark:text-purple-400" },
    report_uploaded:    { label: "✓ Report Ready",       color: "text-green-600 dark:text-green-400" },
    completed:          { label: "✓ Completed",          color: "text-gray-500" },
    cancelled:          { label: "✗ Cancelled",          color: "text-red-500" },
};

const STATUSES = ["Pending", "Processing", "Hold", "Complete", "Cancelled"];

const STATUS_STYLES: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    Processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    Hold: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800",
    Complete: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
    Pending: <Clock className="w-3.5 h-3.5" />,
    Processing: <CircleDashed className="w-3.5 h-3.5 animate-spin" />,
    Hold: <FileWarning className="w-3.5 h-3.5" />,
    Complete: <CheckCircle2 className="w-3.5 h-3.5" />,
    Cancelled: <XCircle className="w-3.5 h-3.5" />,
};

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showAssignPanel, setShowAssignPanel] = useState(false);

    // Assignment Form State
    const [caregivers, setCaregivers] = useState<Personnel[]>([]);
    const [partners, setPartners] = useState<Personnel[]>([]);
    const [assignForm, setAssignForm] = useState({
        assigned_caregiver_id: "",
        assigned_partner_id: "",
        scheduled_at: "",
        manager_notes: "",
    });
    const [assigning, setAssigning] = useState(false);
    const [assignError, setAssignError] = useState("");
    // Toast state
    const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: "" });
    // Modal animation
    const [modalVisible, setModalVisible] = useState(false);

    const showToast = (message: string) => {
        setToast({ visible: true, message });
        setTimeout(() => setToast({ visible: false, message: "" }), 4000);
    };

    const closeModal = () => {
        setModalVisible(false);
        setTimeout(() => setSelectedBooking(null), 300); // wait for animation
    };

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        const res = await fetch("/api/admin/bookings");
        const data = await res.json();
        setBookings(data.bookings || []);
        setLoading(false);
    }, []);

    const fetchPersonnel = useCallback(async () => {
        const [cgRes, ptRes] = await Promise.all([
            fetch("/api/admin/personnel?role=caregiver"),
            fetch("/api/admin/personnel?role=partner"),
        ]);
        const cgData = await cgRes.json();
        const ptData = await ptRes.json();
        setCaregivers(cgData.personnel || []);
        setPartners(ptData.personnel || []);
    }, []);

    useEffect(() => {
        fetchBookings();
        fetchPersonnel();
    }, [fetchBookings, fetchPersonnel]);

    const updateStatus = async (id: string, newStatus: string) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
        await fetch("/api/admin/bookings", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status: newStatus }),
        });
    };

    const openDetails = (booking: Booking) => {
        setSelectedBooking(booking);
        setShowAssignPanel(false);
        setAssignError("");
        setAssignForm({
            assigned_caregiver_id: booking.assigned_caregiver_id || "",
            assigned_partner_id: booking.assigned_partner_id || "",
            scheduled_at: booking.scheduled_at ? booking.scheduled_at.slice(0, 16) : "",
            manager_notes: booking.manager_notes || "",
        });
        // small delay so animation plays correctly
        setTimeout(() => setModalVisible(true), 10);
    };

    const handleAssign = async (e: React.FormEvent) => {
        e.preventDefault();
        setAssigning(true);
        setAssignError("");

        try {
            const res = await fetch(`/api/admin/bookings/${selectedBooking!.id}/assign`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(assignForm),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Assignment failed");

            // Update table row optimistically
            setBookings(prev => prev.map(b =>
                b.id === selectedBooking!.id
                    ? { ...b, ...assignForm, status: "Processing" }
                    : b
            ));

            // Close modal with animation, then show toast
            closeModal();
            setTimeout(() => showToast("Booking confirmed & team assigned successfully! ✓"), 350);

        } catch (err: any) {
            setAssignError(err.message);
        } finally {
            setAssigning(false);
        }
    };

    const getPersonnelName = (list: Personnel[], id?: string) =>
        id ? (list.find(p => p.id === id)?.full_name || "Unknown") : "—";

    const filtered = bookings.filter(b =>
        (b.requester_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (b.patient_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (b.service_name_en?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto relative">
            {/* Toast Notification */}
            <div className={`fixed top-6 right-6 z-[200] transition-all duration-500 ease-in-out ${
                toast.visible
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-4 pointer-events-none"
            }`}>
                <div className="flex items-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-3.5 rounded-2xl shadow-2xl min-w-[280px] font-medium text-sm">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                        <CheckCircle2 size={14} className="text-white" />
                    </div>
                    {toast.message}
                </div>
            </div>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Master Booking List</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Review, confirm, and assign all incoming service bookings.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchBookings}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
                    </button>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search name or service..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm transition"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 dark:bg-gray-950/50 border-b border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">
                            <tr>
                                <th className="px-5 py-4 font-semibold">Date</th>
                                <th className="px-5 py-4 font-semibold">Service</th>
                                <th className="px-5 py-4 font-semibold">Requester</th>
                                <th className="px-5 py-4 font-semibold">Patient</th>
                                <th className="px-5 py-4 font-semibold">Assigned To</th>
                                <th className="px-5 py-4 font-semibold">Scheduled</th>
                                <th className="px-5 py-4 font-semibold">Booking Status</th>
                                <th className="px-5 py-4 font-semibold">Field Progress</th>
                                <th className="px-5 py-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                <tr><td colSpan={9} className="px-6 py-12 text-center text-gray-400">
                                    <Loader2 className="animate-spin inline mr-2 w-5 h-5" />Loading...
                                </td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={9} className="px-6 py-12 text-center text-gray-400">No bookings found.</td></tr>
                            ) : filtered.map(booking => (
                                <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition group">
                                    <td className="px-5 py-4 text-gray-500 dark:text-gray-400 text-xs">
                                        {format(new Date(booking.created_at), "MMM d, yyyy")}
                                        <br />
                                        <span className="text-gray-400">{format(new Date(booking.created_at), "h:mm a")}</span>
                                    </td>
                                    <td className="px-5 py-4 font-medium text-gray-900 dark:text-white max-w-[160px] truncate">
                                        {booking.service_name_en}
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="font-medium text-gray-900 dark:text-white">{booking.requester_name}</p>
                                        <p className="text-xs text-gray-400">{booking.requester_phone}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        <p className="font-medium text-gray-900 dark:text-white">{booking.patient_name}</p>
                                        <p className="text-xs text-gray-400">{booking.booking_data?.patBookingType || ""}</p>
                                    </td>
                                    <td className="px-5 py-4">
                                        {booking.assigned_caregiver_id ? (
                                            <div>
                                                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                    <UserCheck size={12} /> {getPersonnelName(caregivers, booking.assigned_caregiver_id)}
                                                </p>
                                                <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                                    <Building2 size={11} /> {getPersonnelName(partners, booking.assigned_partner_id)}
                                                </p>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">Not assigned</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 text-xs text-gray-500 dark:text-gray-400">
                                        {booking.scheduled_at
                                            ? <><p className="font-medium text-gray-800 dark:text-gray-200">{format(new Date(booking.scheduled_at), "MMM d, yyyy")}</p>
                                               <p className="text-gray-400">{format(new Date(booking.scheduled_at), "h:mm a")}</p></>
                                            : <span className="text-gray-300 dark:text-gray-600">—</span>
                                        }
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="relative inline-block">
                                            <select
                                                value={booking.status || "Pending"}
                                                onChange={e => updateStatus(booking.id, e.target.value)}
                                                className={`appearance-none pl-7 pr-7 py-1.5 rounded-full text-xs font-semibold border outline-none cursor-pointer ${STATUS_STYLES[booking.status] || STATUS_STYLES.Pending}`}
                                            >
                                                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                            <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                                {STATUS_ICONS[booking.status] || STATUS_ICONS.Pending}
                                            </div>
                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 opacity-40 pointer-events-none" />
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        {/* Field Progress: caregiver task status */}
                                        {(() => {
                                            const task = booking.caregiver_tasks?.[0];
                                            if (!task) return <span className="text-xs text-gray-300 dark:text-gray-600">—</span>;
                                            const meta = TASK_STATUS_LABEL[task.status];
                                            const stepIdx = TASK_STATUS_ORDER.indexOf(task.status);
                                            const pct = Math.round((stepIdx / (TASK_STATUS_ORDER.length - 1)) * 100);
                                            return (
                                                <div>
                                                    <p className={`text-xs font-semibold mb-1.5 ${meta?.color || "text-gray-500"}`}>
                                                        {meta?.label || task.status}
                                                    </p>
                                                    <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <button
                                            onClick={() => openDetails(booking)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-medium transition"
                                        >
                                            <FileText className="w-3.5 h-3.5" /> Review
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail + Assignment Modal */}
            {selectedBooking && (
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
                        modalVisible ? "opacity-100" : "opacity-0"
                    }`}
                    onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
                >
                    <div className={`bg-white dark:bg-gray-900 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex max-h-[92vh] transition-all duration-300 ${
                        modalVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
                    }`}>

                        {/* LEFT — Booking Details */}
                        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${showAssignPanel ? "hidden md:flex md:w-1/2" : "w-full"}`}>
                            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-start bg-gray-50 dark:bg-gray-950/50 shrink-0">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Booking Review</h3>
                                    <p className="text-xs text-gray-400 mt-0.5">ID: {selectedBooking.id.slice(0, 16)}...</p>
                                </div>
                                <button onClick={closeModal} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                    <XCircle className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-5 space-y-5">
                                {/* Status + Service */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                                        <p className="text-xs text-gray-400 mb-1">Service</p>
                                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{selectedBooking.service_name_en}</p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
                                        <p className="text-xs text-gray-400 mb-1">Status</p>
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[selectedBooking.status] || STATUS_STYLES.Pending}`}>
                                            {STATUS_ICONS[selectedBooking.status]} {selectedBooking.status}
                                        </span>
                                    </div>
                                    
                                    {/* Transport & Hardcopy Badges */}
                                    {(selectedBooking.has_transport || selectedBooking.report_type === 'hardcopy') && (
                                        <div className="col-span-2 flex gap-2">
                                            {selectedBooking.has_transport && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                                    🚗 Transport/Escort Requested
                                                </span>
                                            )}
                                            {selectedBooking.report_type === 'hardcopy' && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                                                    📄 Hardcopy Report Requested
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Requester */}
                                <section>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border-b border-emerald-100 dark:border-emerald-900/30 pb-2 mb-3">Requester Details</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        {[
                                            ["Name", selectedBooking.booking_data?.reqName],
                                            ["Phone", selectedBooking.booking_data?.reqPhone],
                                            ["Location", selectedBooking.booking_data?.reqLocation],
                                            ["Relation", selectedBooking.booking_data?.reqRelation],
                                            ["Best Call Time", selectedBooking.booking_data?.reqBestTime],
                                        ].map(([label, val]) => val ? (
                                            <div key={label}>
                                                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{val}</p>
                                            </div>
                                        ) : null)}
                                    </div>
                                </section>

                                {/* Patient */}
                                <section>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 border-b border-teal-100 dark:border-teal-900/30 pb-2 mb-3">Patient Details</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        {[
                                            ["Name", selectedBooking.booking_data?.patName],
                                            ["Age & Gender", selectedBooking.booking_data?.patAge ? `${selectedBooking.booking_data?.patAge} yrs, ${selectedBooking.booking_data?.patGender}` : null],
                                            ["Blood Group", selectedBooking.booking_data?.patBloodGroup],
                                            ["Phone", selectedBooking.booking_data?.patPhone],
                                            ["Address", selectedBooking.booking_data?.patAddress],
                                            ["Mobility", selectedBooking.booking_data?.patMobility],
                                            ["Booking Type", selectedBooking.booking_data?.patBookingType],
                                        ].map(([label, val]) => val ? (
                                            <div key={label} className={label === "Address" ? "col-span-2" : ""}>
                                                <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{val}</p>
                                            </div>
                                        ) : null)}
                                        {selectedBooking.booking_data?.patMedicalCond?.length > 0 && (
                                            <div className="col-span-2">
                                                <p className="text-xs text-gray-400 mb-1">Medical Conditions</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {selectedBooking.booking_data.patMedicalCond.map((c: string) => (
                                                        <span key={c} className="px-2.5 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs rounded-full border border-red-100 dark:border-red-900/30">{c}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {selectedBooking.booking_data?.patNotes && (
                                            <div className="col-span-2">
                                                <p className="text-xs text-gray-400 mb-1">Special Instructions</p>
                                                <p className="text-sm text-gray-700 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 p-3 rounded-xl">{selectedBooking.booking_data.patNotes}</p>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* Dynamic Service Requirements */}
                                <section>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 border-b border-indigo-100 dark:border-indigo-900/30 pb-2 mb-3">Service Requirements</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        {Object.entries(selectedBooking.booking_data || {}).map(([key, value]) => {
                                            if (key.startsWith("req") || key.startsWith("pat")) return null;
                                            if (!value || (Array.isArray(value) && value.length === 0)) return null;
                                            if (value === "Select...") return null;
                                            const label = key.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
                                            return (
                                                <div key={key} className={typeof value === "string" && value.length > 50 ? "col-span-2" : ""}>
                                                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {Array.isArray(value) ? value.join(", ") : String(value)}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            </div>

                            {/* CTA */}
                            {!showAssignPanel && (
                                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-950/50 shrink-0">
                                    <button
                                        onClick={() => setShowAssignPanel(true)}
                                        className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition shadow-lg shadow-emerald-600/20"
                                    >
                                        <ClipboardCheck size={18} /> Confirm & Assign Resources <ArrowRight size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* RIGHT — Assignment Panel */}
                        {showAssignPanel && (
                            <div className="w-full md:w-1/2 border-l border-gray-100 dark:border-gray-800 flex flex-col">
                                <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-emerald-50 dark:bg-emerald-900/10 shrink-0">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-emerald-800 dark:text-emerald-300 text-lg flex items-center gap-2">
                                                <ClipboardCheck size={20} /> Assignment Panel
                                            </h3>
                                            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-0.5">
                                                Assign team and schedule for: <strong>{selectedBooking.service_name_en}</strong>
                                            </p>
                                        </div>
                                        <button onClick={() => setShowAssignPanel(false)} className="text-gray-400 hover:text-gray-600 p-1.5">
                                            <XCircle size={18} />
                                        </button>
                                    </div>
                                </div>

                                <form onSubmit={handleAssign} className="flex-1 overflow-y-auto p-5 space-y-5">
                                    {assignError && (
                                        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-xl">
                                            {assignError}
                                        </div>
                                    )}

                                    {/* Caregiver */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <UserCheck size={16} className="text-emerald-500" /> Assign Caregiver
                                        </label>
                                        <select
                                            required
                                            value={assignForm.assigned_caregiver_id}
                                            onChange={e => setAssignForm(f => ({ ...f, assigned_caregiver_id: e.target.value }))}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                        >
                                            <option value="">— Select a Caregiver —</option>
                                            {caregivers.map(c => (
                                                <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>
                                            ))}
                                        </select>
                                        {caregivers.length === 0 && (
                                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5 flex items-center gap-1">
                                                <FileWarning size={12} /> No caregivers found. Add them via Personnel & Roster.
                                            </p>
                                        )}
                                    </div>

                                    {/* Partner */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <Building2 size={16} className="text-purple-500" /> Diagnostic Partner
                                        </label>
                                        <select
                                            required
                                            value={assignForm.assigned_partner_id}
                                            onChange={e => setAssignForm(f => ({ ...f, assigned_partner_id: e.target.value }))}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                        >
                                            <option value="">— Select a Partner Lab —</option>
                                            {partners.map(p => (
                                                <option key={p.id} value={p.id}>{p.full_name} ({p.email})</option>
                                            ))}
                                        </select>
                                        {partners.length === 0 && (
                                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5 flex items-center gap-1">
                                                <FileWarning size={12} /> No partners found. Add them via Partner Coordination.
                                            </p>
                                        )}
                                    </div>

                                    {/* Schedule */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <CalendarClock size={16} className="text-blue-500" /> Schedule Date & Time
                                        </label>
                                        <input
                                            required
                                            type="datetime-local"
                                            value={assignForm.scheduled_at}
                                            min={new Date().toISOString().slice(0, 16)}
                                            onChange={e => setAssignForm(f => ({ ...f, scheduled_at: e.target.value }))}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                        />
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            <StickyNote size={16} className="text-gray-400" /> Manager Notes (Optional)
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={assignForm.manager_notes}
                                            onChange={e => setAssignForm(f => ({ ...f, manager_notes: e.target.value }))}
                                            placeholder="Internal notes for the caregiver or team..."
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={assigning}
                                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-2xl transition shadow-lg shadow-emerald-600/20"
                                    >
                                        {assigning
                                            ? <><Loader2 className="animate-spin" size={18} /> Saving...</>
                                            : <><CheckCircle2 size={18} /> Confirm & Save Assignment</>
                                        }
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
