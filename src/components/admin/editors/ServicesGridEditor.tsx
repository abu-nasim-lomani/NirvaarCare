"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/supabase";

export default function ServicesGridEditor({
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

    const updateItemProp = (idx: number, propPath: string, value: string) => {
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
        const url = await uploadImage(file, "images");
        setIsUploading(null);

        if (url) {
            updateItemProp(itemIndex, "image", url);
        } else {
            alert("Image upload failed.");
        }
    };

    const addNewItem = () => {
        const template = {
            id: Date.now(),
            icon: "Activity",
            title: { bn: "নতুন সেবা", en: "New Service" },
            image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118",
            description: { bn: "বিস্তারিত তথ্য...", en: "Detailed information..." },
        };
        const newData = { ...data, items: [...items, template] };
        setLocalData(newData);
        setActiveIdx(items.length);
    };

    const deleteItem = (idx: number) => {
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
                            <textarea rows={2} value={data.title?.en || ""} onChange={(e) => updateGlobalProp("title.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500 resize-none" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Main Title (BN)</label>
                            <textarea rows={2} value={data.title?.bn || ""} onChange={(e) => updateGlobalProp("title.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500 resize-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Service Cards Array Editor */}
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-700 text-sm tracking-wide uppercase">
                        Service Cards ({items.length})
                    </h3>
                    <button onClick={addNewItem} className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1">
                        <Plus size={14} /> Add Service
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
                            Service {idx + 1}
                        </button>
                    ))}
                </div>

                {/* Active Specific Form */}
                {items[activeIdx] && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-5 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b pb-2 mb-2">
                            <h4 className="font-semibold text-gray-800">Editing Card {activeIdx + 1}</h4>
                            <button onClick={() => deleteItem(activeIdx)} className="text-red-500 hover:text-red-600 p-1 hover:bg-red-50 rounded" title="Delete Card">
                                <Trash2 size={16} />
                            </button>
                        </div>

                        {/* Image Uploader */}
                        {/* Note: the image isn't directly used in standard ServicesGrid render as image, but it's part of the data. Wait, actually I did add glowing ambient orbs but not an image background to the cards. Let's keep it if we ever need it, or ignore. The data schema contains 'image'. We will keep it. */}

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">
                                Icon Type (Lucide)
                            </label>
                            <select
                                value={items[activeIdx].icon}
                                onChange={(e) => updateItemProp(activeIdx, "icon", e.target.value)}
                                className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500"
                            >
                                <option value="Activity">Activity</option>
                                <option value="Stethoscope">Stethoscope</option>
                                <option value="Pill">Pill</option>
                                <option value="Ambulance">Ambulance</option>
                                <option value="ShoppingBag">ShoppingBag</option>
                                <option value="HeartHandshake">HeartHandshake</option>
                            </select>
                        </div>

                        <div className="space-y-3 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                            <label className="block text-xs font-semibold text-emerald-700 mb-1">Card Title</label>
                            <input type="text" placeholder="EN" value={items[activeIdx].title?.en || ""} onChange={(e) => updateItemProp(activeIdx, "title.en", e.target.value)} className="w-full text-sm border border-emerald-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none mb-2" />
                            <input type="text" placeholder="BN" value={items[activeIdx].title?.bn || ""} onChange={(e) => updateItemProp(activeIdx, "title.bn", e.target.value)} className="w-full text-sm border border-emerald-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none" />
                        </div>

                        <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                            <textarea rows={4} placeholder="EN" value={items[activeIdx].description?.en || ""} onChange={(e) => updateItemProp(activeIdx, "description.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none mb-2 resize-y" />
                            <textarea rows={4} placeholder="BN" value={items[activeIdx].description?.bn || ""} onChange={(e) => updateItemProp(activeIdx, "description.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none resize-y" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
