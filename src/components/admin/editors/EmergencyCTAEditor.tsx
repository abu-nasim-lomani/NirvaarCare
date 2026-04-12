"use client";

export default function EmergencyCTAEditor({
    localData,
    setLocalData,
}: {
    localData: any;
    setLocalData: (data: any) => void;
}) {
    const data = localData || {};

    const set = (path: string, value: string) => {
        const newData = { ...data };
        const keys = path.split(".");
        if (keys.length === 1) {
            newData[keys[0]] = value;
        } else if (keys.length === 2) {
            newData[keys[0]] = { ...newData[keys[0]], [keys[1]]: value };
        } else if (keys.length === 3) {
            newData[keys[0]] = {
                ...newData[keys[0]],
                [keys[1]]: { ...(newData[keys[0]]?.[keys[1]] || {}), [keys[2]]: value }
            };
        }
        setLocalData(newData);
    };

    const LabelField = ({ label, path, textarea = false, hint = "" }: { label: string; path: string; textarea?: boolean; hint?: string }) => (
        <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
            {textarea ? (
                <textarea
                    rows={3}
                    value={path.split(".").reduce((obj: any, k) => obj?.[k] ?? "", data)}
                    onChange={e => set(path, e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-500 resize-y bg-white"
                />
            ) : (
                <input
                    type="text"
                    value={path.split(".").reduce((obj: any, k) => obj?.[k] ?? "", data)}
                    onChange={e => set(path, e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-emerald-500 bg-white"
                />
            )}
            {hint && <p className="text-[10px] text-gray-400 mt-1">{hint}</p>}
        </div>
    );

    const SectionCard = ({ title, color = "emerald", children }: { title: string; color?: string; children: React.ReactNode }) => (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
            <h4 className={`font-bold text-sm text-${color}-700 border-b border-gray-100 pb-2`}>{title}</h4>
            {children}
        </div>
    );

    return (
        <div className="space-y-5">

            {/* Section Header */}
            <SectionCard title="📌 Section Header" color="gray">
                <div className="grid grid-cols-2 gap-3">
                    <LabelField label="Title (EN)" path="title.en" textarea />
                    <LabelField label="Title (BN)" path="title.bn" textarea />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <LabelField label="Subtitle / Description (EN)" path="description.en" textarea />
                    <LabelField label="Subtitle / Description (BN)" path="description.bn" textarea />
                </div>
            </SectionCard>

            {/* Contact Form Labels */}
            <SectionCard title="📧 Contact Form (Left Side)" color="emerald">
                <div className="grid grid-cols-2 gap-3">
                    <LabelField label="Form Heading (EN)" path="formTitle.en" />
                    <LabelField label="Form Heading (BN)" path="formTitle.bn" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <LabelField label="Form Subtitle (EN)" path="formSubtitle.en" />
                    <LabelField label="Form Subtitle (BN)" path="formSubtitle.bn" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <LabelField label="Submit Button (EN)" path="submitText.en" />
                    <LabelField label="Submit Button (BN)" path="submitText.bn" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <LabelField label="Success Message (EN)" path="successText.en" />
                    <LabelField label="Success Message (BN)" path="successText.bn" />
                </div>
                <LabelField
                    label="Form Submission Email (receives messages)"
                    path="formRecipientEmail"
                    hint="The email address where submitted forms will be sent."
                />
            </SectionCard>

            {/* Emergency Call Card */}
            <SectionCard title="🚨 Emergency Call Card (Right Side)" color="red">
                <div className="grid grid-cols-2 gap-3">
                    <LabelField label="Card Heading (EN)" path="emergencyTitle.en" />
                    <LabelField label="Card Heading (BN)" path="emergencyTitle.bn" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <LabelField label="Card Description (EN)" path="emergencyDesc.en" textarea />
                    <LabelField label="Card Description (BN)" path="emergencyDesc.bn" textarea />
                </div>
                <LabelField
                    label="Phone Number (displayed + call link)"
                    path="phone"
                    hint="e.g. +8801715-599599 — used for href=tel: and displayed on screen."
                />
                <div className="grid grid-cols-2 gap-3">
                    <LabelField label="Call Button Text (EN)" path="buttonText.en" />
                    <LabelField label="Call Button Text (BN)" path="buttonText.bn" />
                </div>
            </SectionCard>

            {/* Bottom Info Cards */}
            <SectionCard title="ℹ️ Info Badges (Bottom of Right Card)" color="teal">
                <div className="grid grid-cols-2 gap-3">
                    <LabelField label="Badge 1 Label (EN)" path="badge1.en" />
                    <LabelField label="Badge 1 Label (BN)" path="badge1.bn" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <LabelField label="Support Email (displayed in badge 2)" path="supportEmail" />
                    <LabelField label="Badge 2 Label (EN)" path="badge2.en" />
                </div>
            </SectionCard>

        </div>
    );
}
