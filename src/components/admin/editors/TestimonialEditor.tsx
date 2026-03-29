"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/supabase";

export default function TestimonialEditor({
    localData,
    setLocalData,
}: {
    localData: any;
    setLocalData: (data: any) => void;
}) {
    const data = localData || {};
    const items = Array.isArray(data.items) ? data.items : [];
    const [activeIdx, setActiveIdx] = useState(0);
    const [isUploading, setIsUploading] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const updateItemProp = (idx: number, propPath: string, value: any) => {
        const newData = { ...data };
        const newItems = [...items];
        const item = { ...newItems[idx] };

        const keys = propPath.split(".");
        if (keys.length === 2) {
            item[keys[0]] = { ...item[keys[0]], [keys[1]]: value };
        } else {
            item[keys[0]] = value;
        }

        newItems[idx] = item;
        newData.items = newItems;
        setLocalData(newData);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemIndex: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(itemIndex);
        const url = await uploadImage(file, "avatars"); // Using avatars or images is fine
        setIsUploading(null);

        if (url) {
            updateItemProp(itemIndex, "image", url);
        } else {
            alert("Image upload failed.");
        }
    };

    const addNewTestimonial = () => {
        const template = {
            id: Date.now(),
            name: { bn: "নতুন গ্রাহক", en: "New Client" },
            role: { bn: "ঢাকা, বাংলাদেশ", en: "Dhaka, Bangladesh" },
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200",
            quote: { bn: "মতামত লিখুন...", en: "Write review here..." },
            rating: 5,
        };
        const newData = { ...data, items: [...items, template] };
        setLocalData(newData);
        setActiveIdx(items.length);
    };

    const deleteTestimonial = (idx: number) => {
        const newItems = items.filter((_: any, i: number) => i !== idx);
        setLocalData({ ...data, items: newItems });
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

            {/* Testimonials Array Editor */}
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-700 text-sm tracking-wide uppercase">
                        Reviews ({items.length})
                    </h3>
                    <button onClick={addNewTestimonial} className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1">
                        <Plus size={14} /> Add Review
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {items.map((_: any, idx: number) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIdx(idx)}
                            className={`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                activeIdx === idx
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            Review {idx + 1}
                        </button>
                    ))}
                </div>

                {/* Active Specific Form */}
                {items[activeIdx] && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b pb-2 mb-2">
                            <h4 className="font-semibold text-gray-800">Editing Review {activeIdx + 1}</h4>
                            <button onClick={() => deleteTestimonial(activeIdx)} className="text-red-500 hover:text-red-600 p-1 hover:bg-red-50 rounded" title="Delete Review">
                                <Trash2 size={16} />
                            </button>
                        </div>

                        {/* Image Uploader */}
                        <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center overflow-hidden group shrink-0">
                                {items[activeIdx].image ? (
                                    <img src={items[activeIdx].image} alt="Avatar" className="w-full h-full object-cover group-hover:opacity-30 transition-opacity" />
                                ) : (
                                    <ImageIcon className="text-gray-400 w-6 h-6" />
                                )}
                                
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-bold text-gray-800 bg-white/80" onClick={() => fileInputRef.current?.click()}>
                                    {isUploading === activeIdx ? <Loader2 size={14} className="animate-spin" /> : "Upload"}
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, activeIdx)} />
                            </div>
                            <div className="text-xs text-gray-500">
                                Square images (e.g., 200x200px) work best. Next.js will auto-crop them nicely.
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Name (EN)</label>
                                <input type="text" value={items[activeIdx].name?.en || ""} onChange={(e) => updateItemProp(activeIdx, "name.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Name (BN)</label>
                                <input type="text" value={items[activeIdx].name?.bn || ""} onChange={(e) => updateItemProp(activeIdx, "name.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Role/Location (EN)</label>
                                <input type="text" value={items[activeIdx].role?.en || ""} onChange={(e) => updateItemProp(activeIdx, "role.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Role/Location (BN)</label>
                                <input type="text" value={items[activeIdx].role?.bn || ""} onChange={(e) => updateItemProp(activeIdx, "role.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-amber-600 mb-1">Star Rating (1-5)</label>
                            <input type="number" min="1" max="5" value={items[activeIdx].rating || 5} onChange={(e) => updateItemProp(activeIdx, "rating", parseInt(e.target.value) || 5)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-amber-500" />
                        </div>

                        <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Quote / Review</label>
                            <textarea rows={4} placeholder="EN" value={items[activeIdx].quote?.en || ""} onChange={(e) => updateItemProp(activeIdx, "quote.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none mb-2 resize-y" />
                            <textarea rows={4} placeholder="BN" value={items[activeIdx].quote?.bn || ""} onChange={(e) => updateItemProp(activeIdx, "quote.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none resize-y" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
