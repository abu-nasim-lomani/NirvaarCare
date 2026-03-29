"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function WhyChooseUsEditor({
    localData,
    setLocalData,
}: {
    localData: any;
    setLocalData: (data: any) => void;
}) {
    const data = localData || {};
    const features = Array.isArray(data.features) ? data.features : [];
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

    const updateFeatureProp = (idx: number, propPath: string, value: string) => {
        const newData = { ...data };
        const newFeatures = [...features];
        const feature = { ...newFeatures[idx] };

        const keys = propPath.split(".");
        if (keys.length === 2) {
            feature[keys[0]] = { ...feature[keys[0]], [keys[1]]: value };
        } else {
            feature[keys[0]] = value;
        }

        newFeatures[idx] = feature;
        newData.features = newFeatures;
        setLocalData(newData);
    };

    const addNewFeature = () => {
        const template = {
            id: Date.now(),
            icon: "ShieldCheck",
            title: { bn: "নতুন বৈশিষ্ট্য", en: "New Feature" },
            description: { bn: "বিস্তারিত...", en: "Details..." },
            image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289", // Fallback if ever needed
        };
        const newData = { ...data, features: [...features, template] };
        setLocalData(newData);
        setActiveIdx(features.length);
    };

    const deleteFeature = (idx: number) => {
        const newFeatures = features.filter((_: any, i: number) => i !== idx);
        setLocalData({ ...data, features: newFeatures });
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
                            <textarea rows={2} value={data.title?.en || ""} onChange={(e) => updateGlobalProp("title.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500 resize-y" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Main Title (BN)</label>
                            <textarea rows={2} value={data.title?.bn || ""} onChange={(e) => updateGlobalProp("title.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500 resize-y" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Array Editor */}
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-700 text-sm tracking-wide uppercase">
                        Features ({features.length})
                    </h3>
                    <button onClick={addNewFeature} className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1">
                        <Plus size={14} /> Add Feature
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {features.map((_: any, idx: number) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIdx(idx)}
                            className={`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                activeIdx === idx
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            Feature {idx + 1}
                        </button>
                    ))}
                </div>

                {/* Active Specific Form */}
                {features[activeIdx] && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b pb-2 mb-2">
                            <h4 className="font-semibold text-gray-800">Editing Feature {activeIdx + 1}</h4>
                            <button onClick={() => deleteFeature(activeIdx)} className="text-red-500 hover:text-red-600 p-1 hover:bg-red-50 rounded" title="Delete Feature">
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                Icon Type (Lucide)
                            </label>
                            <select
                                value={features[activeIdx].icon}
                                onChange={(e) => updateFeatureProp(activeIdx, "icon", e.target.value)}
                                className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500"
                            >
                                <option value="ShieldCheck">ShieldCheck</option>
                                <option value="ActivityPulse">ActivityPulse</option>
                                <option value="Eye">Eye</option>
                                <option value="Clock">Clock</option>
                            </select>
                        </div>

                        <div className="space-y-3 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                            <label className="block text-xs font-semibold text-emerald-700 mb-1">Feature Title</label>
                            <input type="text" placeholder="EN" value={features[activeIdx].title?.en || ""} onChange={(e) => updateFeatureProp(activeIdx, "title.en", e.target.value)} className="w-full text-sm border border-emerald-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none mb-2" />
                            <input type="text" placeholder="BN" value={features[activeIdx].title?.bn || ""} onChange={(e) => updateFeatureProp(activeIdx, "title.bn", e.target.value)} className="w-full text-sm border border-emerald-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none" />
                        </div>

                        <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                            <textarea rows={4} placeholder="EN" value={features[activeIdx].description?.en || ""} onChange={(e) => updateFeatureProp(activeIdx, "description.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none mb-2 resize-y" />
                            <textarea rows={4} placeholder="BN" value={features[activeIdx].description?.bn || ""} onChange={(e) => updateFeatureProp(activeIdx, "description.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none resize-y" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
