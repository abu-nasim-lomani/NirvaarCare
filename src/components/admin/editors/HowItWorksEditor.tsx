"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function HowItWorksEditor({
    localData,
    setLocalData,
}: {
    localData: any;
    setLocalData: (data: any) => void;
}) {
    const data = localData || {};
    const steps = Array.isArray(data.steps) ? data.steps : [];
    const [activeIdx, setActiveIdx] = useState(0);

    const updateGlobalProp = (propPath: string, value: string) => {
        const newData = { ...data };
        const keys = propPath.split(".");
        if (keys.length === 2) {
            newData[keys[0]] = { ...newData[keys[0]], [keys[1]]: value };
        } else {
            newData[keys[0]] = value;
        }
        setLocalData(newData);
    };

    const updateStepProp = (idx: number, propPath: string, value: string) => {
        const newData = { ...data };
        const newSteps = [...steps];
        const step = { ...newSteps[idx] };

        const keys = propPath.split(".");
        if (keys.length === 2) {
            step[keys[0]] = { ...step[keys[0]], [keys[1]]: value };
        } else {
            step[keys[0]] = value;
        }

        newSteps[idx] = step;
        newData.steps = newSteps;
        setLocalData(newData);
    };

    const addNewStep = () => {
        const template = {
            id: Date.now(),
            icon: "PhoneCall",
            title: { bn: "নতুন ধাপ", en: "New Step" },
            description: { bn: "ধাপের বিস্তারিত...", en: "Step details..." },
        };
        const newData = { ...data, steps: [...steps, template] };
        setLocalData(newData);
        setActiveIdx(steps.length);
    };

    const deleteStep = (idx: number) => {
        const newSteps = steps.filter((_: any, i: number) => i !== idx);
        setLocalData({ ...data, steps: newSteps });
        setActiveIdx(Math.max(0, idx - 1));
    };

    if (!data) return null;

    return (
        <div className="space-y-6">
            {/* Global Section Details */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
                <h4 className="font-semibold text-gray-800 text-sm border-b pb-2">Section Header</h4>
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Badge (EN)</label>
                            <input type="text" value={data.badge?.en || ""} onChange={(e) => updateGlobalProp("badge.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Badge (BN)</label>
                            <input type="text" value={data.badge?.bn || ""} onChange={(e) => updateGlobalProp("badge.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Main Title (EN)</label>
                            <textarea rows={2} value={data.title?.en || ""} onChange={(e) => updateGlobalProp("title.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500 resize-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Main Title (BN)</label>
                            <textarea rows={2} value={data.title?.bn || ""} onChange={(e) => updateGlobalProp("title.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500 resize-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Steps Array Editor */}
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-700 text-sm tracking-wide uppercase">
                        Work Steps ({steps.length})
                    </h3>
                    <button onClick={addNewStep} className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1">
                        <Plus size={14} /> Add Step
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {steps.map((_: any, idx: number) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIdx(idx)}
                            className={`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                activeIdx === idx
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            Step {idx + 1}
                        </button>
                    ))}
                </div>

                {/* Active Specific Form */}
                {steps[activeIdx] && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b pb-2 mb-2">
                            <h4 className="font-semibold text-gray-800">Editing Step {activeIdx + 1}</h4>
                            <button onClick={() => deleteStep(activeIdx)} className="text-red-500 hover:text-red-600 p-1 hover:bg-red-50 rounded" title="Delete Step">
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                Icon Type (Lucide)
                            </label>
                            <select
                                value={steps[activeIdx].icon}
                                onChange={(e) => updateStepProp(activeIdx, "icon", e.target.value)}
                                className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500"
                            >
                                <option value="PhoneCall">PhoneCall</option>
                                <option value="ClipboardCheck">ClipboardCheck</option>
                                <option value="FileEdit">FileEdit</option>
                                <option value="HeartHandshake">HeartHandshake</option>
                            </select>
                        </div>

                        <div className="space-y-3 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                            <label className="block text-xs font-semibold text-emerald-700 mb-1">Step Title</label>
                            <input type="text" placeholder="EN" value={steps[activeIdx].title?.en || ""} onChange={(e) => updateStepProp(activeIdx, "title.en", e.target.value)} className="w-full text-sm border border-emerald-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none mb-2" />
                            <input type="text" placeholder="BN" value={steps[activeIdx].title?.bn || ""} onChange={(e) => updateStepProp(activeIdx, "title.bn", e.target.value)} className="w-full text-sm border border-emerald-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none" />
                        </div>

                        <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                            <textarea rows={4} placeholder="EN" value={steps[activeIdx].description?.en || ""} onChange={(e) => updateStepProp(activeIdx, "description.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none mb-2 resize-y" />
                            <textarea rows={4} placeholder="BN" value={steps[activeIdx].description?.bn || ""} onChange={(e) => updateStepProp(activeIdx, "description.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none resize-y" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
