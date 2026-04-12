"use client";

import { useState } from "react";
import { Plus, Trash2, ShieldCheck, Activity, Eye, Clock } from "lucide-react";

// টাইপ ডিফাইন করা যাতে অটো-সাজেশন পাওয়া যায়
interface LangString {
    bn: string;
    en: string;
}

interface Feature {
    id: number;
    icon: string;
    title: LangString;
    description: LangString;
}

interface WhyChooseUsData {
    badge?: LangString;
    title?: LangString;
    subtitle?: LangString;
    features?: Feature[];
}

interface Props {
    localData: WhyChooseUsData;
    setLocalData: (data: WhyChooseUsData) => void;
}

export default function WhyChooseUsEditor({ localData, setLocalData }: Props) {
    // ডাটা ডিফাইন করা
    const data = localData || {};
    const features = Array.isArray(data.features) ? data.features : [];
    const [activeIdx, setActiveIdx] = useState(0);

    // গ্লোবাল প্রোপার্টি (badge, title, subtitle) আপডেট করার ফাংশন
    const updateGlobalProp = (section: keyof WhyChooseUsData, lang: "en" | "bn", value: string) => {
        setLocalData({
            ...data,
            [section]: {
                ...(data[section] as LangString),
                [lang]: value,
            },
        });
    };

    // ফিচারের প্রোপার্টি আপডেট করার ফাংশন
    const updateFeatureProp = (idx: number, field: keyof Feature, value: any) => {
        const updatedFeatures = [...features];
        updatedFeatures[idx] = { ...updatedFeatures[idx], [field]: value };
        setLocalData({ ...data, features: updatedFeatures });
    };

    // ফিচারের ল্যাঙ্গুয়েজ প্রোপার্টি (title.en, description.bn) আপডেট
    const updateFeatureLangProp = (idx: number, field: "title" | "description", lang: "en" | "bn", value: string) => {
        const updatedFeatures = [...features];
        updatedFeatures[idx] = {
            ...updatedFeatures[idx],
            [field]: { ...updatedFeatures[idx][field], [lang]: value },
        };
        setLocalData({ ...data, features: updatedFeatures });
    };

    const addNewFeature = () => {
        const template: Feature = {
            id: Date.now(),
            icon: "ShieldCheck",
            title: { bn: "নতুন বৈশিষ্ট্য", en: "New Feature" },
            description: { bn: "বিস্তারিত...", en: "Details..." },
        };
        setLocalData({ ...data, features: [...features, template] });
        setActiveIdx(features.length);
    };

    const deleteFeature = (idx: number) => {
        const updatedFeatures = features.filter((_, i) => i !== idx);
        setLocalData({ ...data, features: updatedFeatures });
        if (activeIdx >= updatedFeatures.length) {
            setActiveIdx(Math.max(0, updatedFeatures.length - 1));
        }
    };

    return (
        <div className="space-y-6">
            {/* Section Header Editor */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                <h4 className="font-bold text-gray-800 text-sm border-b pb-2 uppercase tracking-wider">
                    Section Header
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Badge */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Badge (EN/BN)</label>
                        <input
                            type="text"
                            placeholder="English"
                            value={data.badge?.en || ""}
                            onChange={(e) => updateGlobalProp("badge", "en", e.target.value)}
                            className="w-full text-sm border rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                        <input
                            type="text"
                            placeholder="Bengali"
                            value={data.badge?.bn || ""}
                            onChange={(e) => updateGlobalProp("badge", "bn", e.target.value)}
                            className="w-full text-sm border rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Main Title</label>
                        <textarea
                            rows={2}
                            placeholder="English"
                            value={data.title?.en || ""}
                            onChange={(e) => updateGlobalProp("title", "en", e.target.value)}
                            className="w-full text-sm border rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                        <textarea
                            rows={2}
                            placeholder="Bengali"
                            value={data.title?.bn || ""}
                            onChange={(e) => updateGlobalProp("title", "bn", e.target.value)}
                            className="w-full text-sm border rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Features Editor */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-700 text-sm tracking-wide uppercase">
                        Features List ({features.length})
                    </h3>
                    <button
                        onClick={addNewFeature}
                        className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all"
                    >
                        <Plus size={16} /> Add New
                    </button>
                </div>

                {/* Tabs for Features */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
                    {features.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIdx(idx)}
                            className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeIdx === idx
                                    ? "bg-emerald-600 text-white shadow-md"
                                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            Feature {idx + 1}
                        </button>
                    ))}
                </div>

                {/* Active Feature Form */}
                {features[activeIdx] ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center justify-between border-b pb-3">
                            <h4 className="font-bold text-gray-800">Edit Feature {activeIdx + 1}</h4>
                            <button
                                onClick={() => deleteFeature(activeIdx)}
                                className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        {/* Icon Picker */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Icon Type</label>
                                <select
                                    value={features[activeIdx].icon}
                                    onChange={(e) => updateFeatureProp(activeIdx, "icon", e.target.value)}
                                    className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                                >
                                    <option value="ShieldCheck">Shield Check</option>
                                    <option value="Activity">Activity Pulse</option>
                                    <option value="Eye">Eye / Vision</option>
                                    <option value="Clock">Clock / Time</option>
                                </select>
                            </div>
                        </div>

                        {/* Title & Description */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3 p-4 bg-emerald-50/30 rounded-xl border border-emerald-100">
                                <label className="block text-xs font-bold text-emerald-700 uppercase">Feature Title</label>
                                <input
                                    type="text"
                                    placeholder="English Title"
                                    value={features[activeIdx].title?.en || ""}
                                    onChange={(e) => updateFeatureLangProp(activeIdx, "title", "en", e.target.value)}
                                    className="w-full text-sm border-emerald-100 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Bengali Title"
                                    value={features[activeIdx].title?.bn || ""}
                                    onChange={(e) => updateFeatureLangProp(activeIdx, "title", "bn", e.target.value)}
                                    className="w-full text-sm border-emerald-100 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div className="space-y-3 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                                <label className="block text-xs font-bold text-gray-700 uppercase">Description</label>
                                <textarea
                                    rows={3}
                                    placeholder="English Description"
                                    value={features[activeIdx].description?.en || ""}
                                    onChange={(e) => updateFeatureLangProp(activeIdx, "description", "en", e.target.value)}
                                    className="w-full text-sm border-gray-200 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <textarea
                                    rows={3}
                                    placeholder="Bengali Description"
                                    value={features[activeIdx].description?.bn || ""}
                                    onChange={(e) => updateFeatureLangProp(activeIdx, "description", "bn", e.target.value)}
                                    className="w-full text-sm border-gray-200 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10 border-2 border-dashed rounded-xl text-gray-400">
                        No features added. Click "Add New" to start.
                    </div>
                )}
            </div>
        </div>
    );
}