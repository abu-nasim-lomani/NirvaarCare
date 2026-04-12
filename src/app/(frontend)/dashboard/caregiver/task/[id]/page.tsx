"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
    CheckCircle2, XCircle, MapPin, Microscope, FlaskConical,
    Upload, Clock, AlertTriangle, Loader2, Plus, Trash2,
    ArrowRight, Building2, ChevronRight, FileText
} from "lucide-react";

// ---- Types ----
type SampleEntry = { sample_type: string; test_name: string; quantity: string; notes: string };
type Task = {
    id: string;
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
        requester_phone: string;
        scheduled_at?: string;
        booking_data: Record<string, any>;
        assigned_partner_id?: string;
    };
    task_type: string;
    sample_entries: any[];
    lab_submissions: any[];
};

// ---- Workflow Steps definition ----
const DIAGNOSTIC_STEPS: Record<string, any[]>  = {
    sample_collection: [
        { key: "approved",          label: "Assignment Accepted",          icon: CheckCircle2,  color: "emerald" },
        { key: "travelling",        label: "Travelling to Patient",        icon: MapPin,         color: "blue" },
        { key: "arrived",           label: "Arrived at Patient Home",      icon: CheckCircle2,  color: "teal" },
        { key: "sample_collected",  label: "Sample Collection",            icon: Microscope,     color: "indigo" },
        { key: "sample_sent_to_lab",label: "Samples Sent to Lab",          icon: FlaskConical,   color: "purple" },
        { key: "report_uploaded",   label: "Lab Report Uploaded",          icon: Upload,         color: "green" },
    ],
    diagnostic_escort: [
        { key: "approved",          label: "Assignment Accepted",          icon: CheckCircle2,  color: "emerald" },
        { key: "travelling",        label: "Travelling to Patient",        icon: MapPin,         color: "blue" },
        { key: "arrived",           label: "Arrived at Patient Home",      icon: CheckCircle2,  color: "teal" },
        { key: "patient_picked_up",  label: "Patient Picked Up",           icon: ArrowRight,     color: "indigo" },
        { key: "arrived_at_center",  label: "Arrived at Diag Center",      icon: Building2,      color: "purple" },
        { key: "patient_dropped_off",label: "Patient Dropped Off (Home)",  icon: CheckCircle2,   color: "green" },
        { key: "completed",          label: "Job Completed",               icon: CheckCircle2,   color: "green" },
    ]
};

const STATUS_ORDER_MAP: Record<string, string[]> = {
    sample_collection: ["pending_approval", "approved", "travelling", "arrived", "sample_collected", "sample_sent_to_lab", "report_uploaded", "completed"],
    diagnostic_escort: ["pending_approval", "approved", "travelling", "arrived", "patient_picked_up", "arrived_at_center", "patient_dropped_off", "completed"]
};

function TimeLog({ label, ts }: { label: string; ts?: string }) {
    if (!ts) return null;
    return (
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Clock size={11} className="shrink-0" />
            <span className="font-medium text-gray-600 dark:text-gray-300">{label}:</span>
            {format(new Date(ts), "MMM d, h:mm a")}
        </div>
    );
}

export default function TaskWorkflowPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [actioning, setActioning] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [showCancel, setShowCancel] = useState(false);

    // Sample entry state
    const [samples, setSamples] = useState<SampleEntry[]>([{ sample_type: "blood", test_name: "", quantity: "", notes: "" }]);
    const [submittingSamples, setSubmittingSamples] = useState(false);

    // Lab submit state
    const [labTrackingRef, setLabTrackingRef] = useState("");
    const [labNotes, setLabNotes] = useState("");
    const [submittingLab, setSubmittingLab] = useState(false);

    const fetchTask = async () => {
        const res = await fetch(`/api/caregiver/tasks/${id}`);
        const data = await res.json();
        setTask(data.task);
        if (data.task?.sample_entries?.length > 0) {
            setSamples(data.task.sample_entries.map((s: any) => ({
                sample_type: s.sample_type,
                test_name: s.test_name,
                quantity: s.quantity || "",
                notes: s.notes || "",
            })));
        }
        setLoading(false);
    };

    useEffect(() => { fetchTask(); }, [id]);

    const updateStatus = async (newStatus: string, extra: Record<string, any> = {}) => {
        setActioning(true);
        await fetch(`/api/caregiver/tasks/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus, ...extra }),
        });
        await fetchTask();
        setActioning(false);
    };

    const submitSamples = async () => {
        const valid = samples.filter(s => s.sample_type && s.test_name);
        if (valid.length === 0) return alert("Please fill in at least one complete sample entry.");
        setSubmittingSamples(true);
        await fetch(`/api/caregiver/tasks/${id}/samples`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ samples: valid }),
        });
        await updateStatus("sample_collected");
        setSubmittingSamples(false);
    };

    const submitLabEntry = async () => {
        if (!task?.service_bookings.assigned_partner_id) return alert("No partner assigned.");
        setSubmittingLab(true);
        await fetch(`/api/caregiver/tasks/${id}/lab-submit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                partner_id: task.service_bookings.assigned_partner_id,
                tracking_ref: labTrackingRef,
                notes: labNotes,
            }),
        });
        await fetchTask();
        setSubmittingLab(false);
    };

    const handleCancel = async () => {
        if (!cancelReason.trim()) return alert("Please provide a reason for cancellation.");
        await updateStatus("cancelled", { cancel_reason: cancelReason });
        setShowCancel(false);
    };

    if (loading) return (
        <div className="flex items-center justify-center py-24 text-gray-400">
            <Loader2 className="animate-spin mr-2" size={24} /> Loading task...
        </div>
    );
    if (!task) return <div className="text-center py-24 text-gray-400">Task not found.</div>;

    const taskType = task.task_type || 'sample_collection';
    const activeSteps = DIAGNOSTIC_STEPS[taskType] || DIAGNOSTIC_STEPS.sample_collection;
    const activeOrder = STATUS_ORDER_MAP[taskType] || STATUS_ORDER_MAP.sample_collection;

    const currentStepIndex = activeOrder.indexOf(task.status);
    const booking = task.service_bookings;
    const isCancelled = task.status === "cancelled";

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-400">
            {/* Header */}
            <div>
                <button onClick={() => router.back()} className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mb-4 flex items-center gap-1">
                    ← Back to Assignments
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{booking.service_name_en}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Patient: <strong className="text-gray-700 dark:text-gray-300">{booking.patient_name}</strong>
                    {booking.booking_data?.patAddress && <> • {booking.booking_data.patAddress}</>}
                </p>
                {booking.scheduled_at && (
                    <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-1">
                        <Clock size={12} /> Scheduled: {format(new Date(booking.scheduled_at), "EEEE, MMM d, yyyy 'at' h:mm a")}
                    </p>
                )}
                {booking.requester_phone && (
                    <p className="text-sm text-gray-400 mt-0.5">
                        Contact: <a href={`tel:${booking.requester_phone}`} className="text-emerald-600 hover:underline">{booking.requester_phone}</a>
                    </p>
                )}
            </div>

            {/* Cancelled State */}
            {isCancelled && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-5">
                    <p className="font-bold text-red-700 dark:text-red-300 flex items-center gap-2 mb-1">
                        <XCircle size={18} /> This assignment was cancelled
                    </p>
                    {task.cancel_reason && <p className="text-sm text-red-600 dark:text-red-400">Reason: {task.cancel_reason}</p>}
                </div>
            )}

            {/* STEP 0: Pending Approval */}
            {task.status === "pending_approval" && (
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 space-y-4">
                    <h2 className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2 text-lg">
                        <AlertTriangle size={20} /> Action Required: Review Assignment
                    </h2>
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                        You have been assigned to this diagnostic service task. Please review the patient details above and decide whether to accept or decline.
                    </p>
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => updateStatus("approved")}
                            disabled={actioning}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition"
                        >
                            {actioning ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={18} />}
                            Accept Assignment
                        </button>
                        <button
                            onClick={() => setShowCancel(true)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold rounded-xl transition"
                        >
                            <XCircle size={18} /> Decline
                        </button>
                    </div>
                    {showCancel && (
                        <div className="mt-4 space-y-3">
                            <textarea
                                placeholder="Please provide a reason for declining..."
                                value={cancelReason}
                                onChange={e => setCancelReason(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-red-300 dark:border-red-700 bg-white dark:bg-gray-900 rounded-xl outline-none text-sm resize-none text-gray-900 dark:text-white"
                            />
                            <div className="flex gap-2">
                                <button onClick={handleCancel} className="px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold">Confirm Decline</button>
                                <button onClick={() => setShowCancel(false)} className="px-5 py-2 border border-gray-200 rounded-xl text-sm">Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Timeline */}
            {!isCancelled && task.status !== "pending_approval" && (
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
                    <h2 className="font-bold text-gray-900 dark:text-white mb-6">Task Progress</h2>
                    <div className="space-y-1">
                        {activeSteps.map((step, i) => {
                            const stepIndex = activeOrder.indexOf(step.key);
                            const isDone = currentStepIndex > stepIndex;
                            const isCurrent = currentStepIndex === stepIndex;
                            const isPending = currentStepIndex < stepIndex;

                            const tsMap: Record<string, string | undefined> = {
                                approved: task.approved_at,
                                travelling: task.travelling_at,
                                arrived: task.arrived_at,
                                sample_collected: task.sample_collected_at,
                                sample_sent_to_lab: task.sample_sent_at,
                                patient_picked_up: (task as any).picked_up_at,
                                arrived_at_center: (task as any).arrived_at_center_at,
                                patient_dropped_off: (task as any).dropped_off_at,
                                report_uploaded: task.report_uploaded_at,
                                completed: task.completed_at
                            };

                            return (
                                <div key={step.key} className="flex items-start gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                                            isDone ? "bg-emerald-500 border-emerald-500 text-white" :
                                            isCurrent ? "bg-white dark:bg-gray-900 border-emerald-500 text-emerald-500" :
                                            "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400"
                                        }`}>
                                            <step.icon size={16} />
                                        </div>
                                        {i < activeSteps.length - 1 && (
                                            <div className={`w-0.5 h-8 mt-1 ${isDone ? "bg-emerald-400" : "bg-gray-200 dark:bg-gray-700"}`} />
                                        )}
                                    </div>
                                    <div className="pb-6 flex-1">
                                        <p className={`font-semibold text-sm ${isDone ? "text-emerald-700 dark:text-emerald-400" : isCurrent ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>
                                            {step.label}
                                            {isDone && " ✓"}
                                            {isCurrent && " ← Current"}
                                        </p>
                                        {tsMap[step.key] && (
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {format(new Date(tsMap[step.key]!), "MMM d, h:mm a")}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* STEP: Travelling */}
            {task.status === "approved" && (
                <ActionCard title="Step 1: Go to Patient Home" icon={<MapPin className="text-blue-500" size={20} />}
                    description="Mark when you start travelling to the patient's home.">
                    {booking.booking_data?.patAddress && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-xl mb-4">
                            📍 {booking.booking_data.patAddress}
                        </p>
                    )}
                    <ActionButton label="I'm On My Way" onClick={() => updateStatus("travelling")} loading={actioning} />
                </ActionCard>
            )}

            {task.status === "travelling" && (
                <ActionCard title="Step 1: Arrived?" icon={<MapPin className="text-teal-500" size={20} />}
                    description="Confirm when you have reached the patient's location.">
                    <ActionButton label="I've Arrived at Patient Home" onClick={() => updateStatus("arrived")} loading={actioning} />
                </ActionCard>
            )}

            {/* --- SAMPLE COLLECTION WORKFLOW --- */}
            {taskType === 'sample_collection' && (
                <>
                    {/* STEP: Sample Collection (Step C) */}
                    {task.status === "arrived" && (
                        <ActionCard title="Step 2: Sample Collection" icon={<Microscope className="text-indigo-500" size={20} />}
                            description="Enter all samples collected from the patient.">
                            <div className="space-y-3 mb-4">
                                {samples.map((s, i) => (
                                    <div key={i} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl space-y-3 border border-gray-200 dark:border-gray-700">
                                        <div className="flex gap-2">
                                            <select
                                                value={s.sample_type}
                                                onChange={e => { const ns = [...samples]; ns[i].sample_type = e.target.value; setSamples(ns); }}
                                                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm outline-none"
                                            >
                                                {["blood", "urine", "stool", "swab", "sputum", "other"].map(t => (
                                                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                                                ))}
                                            </select>
                                            {samples.length > 1 && (
                                                <button onClick={() => setSamples(samples.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 p-2">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            placeholder="Test name (e.g., CBC, Blood Sugar, HbA1c)"
                                            value={s.test_name}
                                            onChange={e => { const ns = [...samples]; ns[i].test_name = e.target.value; setSamples(ns); }}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm outline-none"
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                placeholder="Quantity (e.g., 5ml)"
                                                value={s.quantity}
                                                onChange={e => { const ns = [...samples]; ns[i].quantity = e.target.value; setSamples(ns); }}
                                                className="w-1/2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm outline-none"
                                            />
                                            <input
                                                placeholder="Notes (optional)"
                                                value={s.notes}
                                                onChange={e => { const ns = [...samples]; ns[i].notes = e.target.value; setSamples(ns); }}
                                                className="w-1/2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm outline-none"
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setSamples([...samples, { sample_type: "blood", test_name: "", quantity: "", notes: "" }])}
                                    className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                    <Plus size={16} /> Add another sample
                                </button>
                            </div>
                            <ActionButton label="Submit Samples & Confirm Collection" onClick={submitSamples} loading={submittingSamples} />
                        </ActionCard>
                    )}

                    {/* STEP: Send to Lab (Step D) */}
                    {task.status === "sample_collected" && (
                        <ActionCard title="Step 3: Submit Samples to Lab" icon={<FlaskConical className="text-purple-500" size={20} />}
                            description="Record the submission of samples to the diagnostic partner lab.">
                            {task.sample_entries.length > 0 && (
                                <div className="mb-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl p-3">
                                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2 uppercase tracking-wide">Collected Samples</p>
                                    {task.sample_entries.map((s: any, i: number) => (
                                        <p key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            <ChevronRight size={12} className="text-indigo-400" />
                                            {s.test_name} <span className="text-gray-400">({s.sample_type})</span>
                                            {s.quantity && <span className="text-gray-400">· {s.quantity}</span>}
                                        </p>
                                    ))}
                                </div>
                            )}
                            <div className="space-y-3 mb-4">
                                <input
                                    placeholder="Tracking Reference / Token No. (optional)"
                                    value={labTrackingRef}
                                    onChange={e => setLabTrackingRef(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm outline-none"
                                />
                                <textarea
                                    placeholder="Additional notes for the lab (optional)"
                                    value={labNotes}
                                    onChange={e => setLabNotes(e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm outline-none resize-none"
                                />
                            </div>
                            <ActionButton label="Confirm Samples Submitted to Lab" onClick={submitLabEntry} loading={submittingLab} />
                        </ActionCard>
                    )}
                </>
            )}

            {/* --- DIAGNOSTIC ESCORT WORKFLOW --- */}
            {taskType === 'diagnostic_escort' && (
                <>
                    {task.status === "arrived" && (
                        <ActionCard title="Step 2: Transport Patient" icon={<ArrowRight className="text-indigo-500" size={20} />}
                            description="Confirm when you have picked up the patient and are travelling to the diagnostic center.">
                            <ActionButton label="Patient Picked Up (Heading to Center)" onClick={() => updateStatus("patient_picked_up")} loading={actioning} />
                        </ActionCard>
                    )}

                    {task.status === "patient_picked_up" && (
                        <ActionCard title="Step 3: Arrived at Diagnostic Center" icon={<Building2 className="text-purple-500" size={20} />}
                            description="Confirm when you have reached the diagnostic center with the patient.">
                            <ActionButton label="Arrived at Diagnostic Center" onClick={() => updateStatus("arrived_at_center")} loading={actioning} />
                        </ActionCard>
                    )}

                    {task.status === "arrived_at_center" && (
                        <ActionCard title="Step 4: Return Patient Home" icon={<CheckCircle2 className="text-green-500" size={20} />}
                            description="After tests are complete, drop the patient back at their home.">
                            <ActionButton label="Patient Safely Dropped Off at Home" onClick={() => updateStatus("patient_dropped_off")} loading={actioning} />
                        </ActionCard>
                    )}
                </>
            )}

            {/* STEP: Waiting for Lab Report */}
            {task.status === "sample_sent_to_lab" && (
                <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-2xl p-5 text-center">
                    <FlaskConical size={32} className="mx-auto text-purple-400 mb-3" />
                    <h3 className="font-bold text-purple-800 dark:text-purple-300">Samples Submitted — Awaiting Lab Report</h3>
                    <p className="text-sm text-purple-600/70 dark:text-purple-400/70 mt-1">
                        The diagnostic partner will upload the report via their dashboard. You will be notified when it is ready.
                    </p>
                    {task.lab_submissions?.[0]?.tracking_ref && (
                        <p className="text-xs text-gray-500 mt-2">Tracking Ref: <strong>{task.lab_submissions[0].tracking_ref}</strong></p>
                    )}
                </div>
            )}

            {/* STEP: Report Ready */}
            {(task.status === "report_uploaded" || task.status === "completed") && (
                <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5">
                    <FileText size={28} className="text-emerald-500 mb-2" />
                    <h3 className="font-bold text-emerald-800 dark:text-emerald-300 text-lg">Lab Report Uploaded ✓</h3>
                    <p className="text-sm text-emerald-600/70 dark:text-emerald-400/70 mt-1">The diagnostic partner has uploaded the final report. The manager is reviewing next steps.</p>
                    {task.lab_submissions?.[0]?.report_url && (
                        <a href={task.lab_submissions[0].report_url} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-emerald-700 hover:underline">
                            <FileText size={15} /> View Report
                        </a>
                    )}
                </div>
            )}

            {/* Time Log Summary */}
            {task.status !== "pending_approval" && !isCancelled && (
                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">Time Log</h3>
                    <div className="space-y-1.5">
                        <TimeLog label="Assignment Accepted" ts={task.approved_at} />
                        <TimeLog label="Started Travelling"  ts={task.travelling_at} />
                        <TimeLog label="Arrived at Home"     ts={task.arrived_at} />
                        <TimeLog label="Sample Collected"    ts={task.sample_collected_at} />
                        <TimeLog label="Sent to Lab"         ts={task.sample_sent_at} />
                        <TimeLog label="Patient Picked Up"   ts={(task as any).picked_up_at} />
                        <TimeLog label="Arrived at Center"   ts={(task as any).arrived_at_center_at} />
                        <TimeLog label="Patient Dropped Off" ts={(task as any).dropped_off_at} />
                        <TimeLog label="Report Uploaded"     ts={task.report_uploaded_at} />
                        <TimeLog label="Task Completed"      ts={task.completed_at} />
                    </div>
                </div>
            )}
        </div>
    );
}

// ---- Helper Components ----
function ActionCard({ title, icon, description, children }: { title: string; icon: React.ReactNode; description: string; children: React.ReactNode }) {
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
                {icon}
                <div>
                    <h2 className="font-bold text-gray-900 dark:text-white text-lg">{title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
                </div>
            </div>
            {children}
        </div>
    );
}

function ActionButton({ label, onClick, loading }: { label: string; onClick: () => void; loading?: boolean }) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-sm shadow-emerald-600/20"
        >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
            {label}
        </button>
    );
}
