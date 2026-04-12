"use client";

import { Trash2, Plus } from "lucide-react";

export default function WhatWeDoEditor({
    localData,
    setLocalData,
}: {
    localData: any;
    setLocalData: (data: any) => void;
}) {
    // Ensure it's an object
    const data = localData && typeof localData === "object" && !Array.isArray(localData) ? localData : {};

    const updateProp = (propPath: string, value: any) => {
        const newData = { ...data };
        
        const keys = propPath.split(".");
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        
        setLocalData(newData);
    };

    const paragraphs = data.paragraphs || [];

    const addParagraph = () => {
        updateProp("paragraphs", [...paragraphs, { en: "New Paragraph", bn: "নতুন অনুচ্ছেদ" }]);
    };

    const updateParagraph = (idx: number, lang: "en"|"bn", val: string) => {
        const newParas = [...paragraphs];
        newParas[idx] = { ...newParas[idx], [lang]: val };
        updateProp("paragraphs", newParas);
    };

    const deleteParagraph = (idx: number) => {
        const newParas = paragraphs.filter((_: any, i: number) => i !== idx);
        updateProp("paragraphs", newParas);
    };

    return (
        <div className="space-y-6">
            
            {/* Header Area */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Badge / Tagline (EN)</label>
                        <input type="text" value={data.badge?.en || ""} onChange={(e) => updateProp("badge.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Badge / Tagline (BN)</label>
                        <input type="text" value={data.badge?.bn || ""} onChange={(e) => updateProp("badge.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500" />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Section Title (EN)</label>
                        <input type="text" value={data.title?.en || ""} onChange={(e) => updateProp("title.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Section Title (BN)</label>
                        <input type="text" value={data.title?.bn || ""} onChange={(e) => updateProp("title.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500" />
                    </div>
                </div>
            </div>

            {/* Paragraphs */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800 text-sm">Description Paragraphs ({paragraphs.length})</h4>
                    <button onClick={addParagraph} className="text-emerald-600 hover:text-emerald-700 text-xs font-medium flex items-center gap-1">
                        <Plus size={12} /> Add Paragraph
                    </button>
                </div>

                <div className="space-y-4 mt-3">
                    {paragraphs.map((p: any, i: number) => (
                        <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100 relative group">
                            <button onClick={() => deleteParagraph(i)} className="absolute -top-2 -right-2 bg-white border border-gray-200 text-red-500 p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 size={12} />
                            </button>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Paragraph {i + 1}</label>
                            <textarea rows={6} placeholder="EN Text" value={p.en} onChange={(e) => updateParagraph(i, "en", e.target.value)} className="w-full text-xs border border-gray-200 rounded-md px-2 py-1.5 mb-2 focus:border-emerald-500 outline-none resize-y" />
                            <textarea rows={6} placeholder="BN Text" value={p.bn} onChange={(e) => updateParagraph(i, "bn", e.target.value)} className="w-full text-xs border border-gray-200 rounded-md px-2 py-1.5 focus:border-emerald-500 outline-none resize-y" />
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
