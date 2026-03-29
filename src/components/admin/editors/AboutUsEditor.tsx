"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/supabase";

export default function AboutUsEditor({
    localData,
    setLocalData,
}: {
    localData: any;
    setLocalData: (data: any) => void;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const url = await uploadImage(file, "images");
        setIsUploading(false);

        if (url) {
            updateProp("image1", url);
        } else {
            alert("Image upload failed. Ensure 'images' bucket exists and is public.");
        }
    };

    const paragraphs = data.philosophyParagraphs || [];

    const addParagraph = () => {
        updateProp("philosophyParagraphs", [...paragraphs, { en: "New Paragraph", bn: "নতুন অনুচ্ছেদ" }]);
    };

    const updateParagraph = (idx: number, lang: "en"|"bn", val: string) => {
        const newParas = [...paragraphs];
        newParas[idx] = { ...newParas[idx], [lang]: val };
        updateProp("philosophyParagraphs", newParas);
    };

    const deleteParagraph = (idx: number) => {
        const newParas = paragraphs.filter((_: any, i: number) => i !== idx);
        updateProp("philosophyParagraphs", newParas);
    };

    return (
        <div className="space-y-6">
            
            {/* Image Upload Area */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase">Main Image</label>
                <div className="relative h-48 w-full rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden group">
                    {data.image1 ? (
                        <img 
                            src={data.image1} 
                            alt="Preview" 
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-30 transition-opacity"
                        />
                    ) : (
                        <ImageIcon className="text-gray-400 w-8 h-8" />
                    )}
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium shadow-sm flex items-center gap-2"
                        >
                            {isUploading ? <Loader2 size={14} className="animate-spin" /> : "Upload Image"}
                        </button>
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageUpload}
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Badge (EN)</label>
                        <input type="text" value={data.badge?.en || ""} onChange={(e) => updateProp("badge.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Badge (BN)</label>
                        <input type="text" value={data.badge?.bn || ""} onChange={(e) => updateProp("badge.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500" />
                    </div>
                </div>
            </div>

            {/* Experience Box */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
                <h4 className="font-semibold text-gray-800 text-sm">Experience Floating Box</h4>
                <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Years (e.g. 5+)" value={data.yearsExperience?.en || ""} onChange={(e) => updateProp("yearsExperience.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none" />
                    <input type="text" placeholder="BN (e.g. ৫+)" value={data.yearsExperience?.bn || ""} onChange={(e) => updateProp("yearsExperience.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Text (e.g. Years of Trust)" value={data.experienceText?.en || ""} onChange={(e) => updateProp("experienceText.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none" />
                    <input type="text" placeholder="BN" value={data.experienceText?.bn || ""} onChange={(e) => updateProp("experienceText.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none" />
                </div>
            </div>

            {/* Title & Tagline */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
                <h4 className="font-semibold text-gray-800 text-sm">Main Header Tagline</h4>
                    <textarea rows={4} placeholder="Tagline EN" value={data.tagline?.en || ""} onChange={(e) => updateProp("tagline.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500 resize-y" />
                    <textarea rows={4} placeholder="Tagline BN" value={data.tagline?.bn || ""} onChange={(e) => updateProp("tagline.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500 resize-y" />
            </div>

            {/* Vision & Mission */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
                <div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-2 text-emerald-600">🎯 Vision</h4>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <input type="text" placeholder="Title EN" value={data.vision?.title?.en || ""} onChange={(e) => updateProp("vision.title.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none" />
                        <input type="text" placeholder="Title BN" value={data.vision?.title?.bn || ""} onChange={(e) => updateProp("vision.title.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none" />
                    </div>
                    <textarea rows={4} placeholder="Text EN" value={data.vision?.text?.en || ""} onChange={(e) => updateProp("vision.text.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none resize-y mb-1" />
                    <textarea rows={4} placeholder="Text BN" value={data.vision?.text?.bn || ""} onChange={(e) => updateProp("vision.text.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none resize-y" />
                </div>
                <div className="pt-4 border-t border-gray-100">
                    <h4 className="font-semibold text-gray-800 text-sm mb-2 text-emerald-600">🚀 Mission</h4>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <input type="text" placeholder="Title EN" value={data.mission?.title?.en || ""} onChange={(e) => updateProp("mission.title.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none" />
                        <input type="text" placeholder="Title BN" value={data.mission?.title?.bn || ""} onChange={(e) => updateProp("mission.title.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none" />
                    </div>
                    <textarea rows={4} placeholder="Text EN" value={data.mission?.text?.en || ""} onChange={(e) => updateProp("mission.text.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none resize-y mb-1" />
                    <textarea rows={4} placeholder="Text BN" value={data.mission?.text?.bn || ""} onChange={(e) => updateProp("mission.text.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none resize-y" />
                </div>
            </div>

            {/* Philosophy Paragraphs */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800 text-sm">Philosophy Paragraphs ({paragraphs.length})</h4>
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
