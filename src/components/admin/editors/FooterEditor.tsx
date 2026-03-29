"use client";

import React, { useState, useRef } from "react";
import { Plus, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/supabase";

export default function FooterEditor({
    localData,
    setLocalData,
}: {
    localData: any;
    setLocalData: (data: any) => void;
}) {
    const data = localData || {};
    const links = Array.isArray(data.quickLinks?.links) ? data.quickLinks.links : [];
    const contactItems = Array.isArray(data.contactInfo?.items) ? data.contactInfo.items : [];
    
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const updateGlobalProp = (propPath: string, value: string) => {
        const newData = { ...data };
        const keys = propPath.split(".");
        
        let target = newData;
        for (let i = 0; i < keys.length - 1; i++) {
            target[keys[i]] = target[keys[i]] ? { ...target[keys[i]] } : {};
            target = target[keys[i]];
        }
        target[keys[keys.length - 1]] = value;
        
        setLocalData(newData);
    };

    const updateArrayItem = (arrayPath: string, idx: number, propPath: string, value: any) => {
        const newData = { ...data };
        const keys = arrayPath.split(".");
        let arrRef = newData;
        for (let i = 0; i < keys.length; i++) {
            arrRef[keys[i]] = arrRef[keys[i]] ? (Array.isArray(arrRef[keys[i]]) ? [...arrRef[keys[i]]] : { ...arrRef[keys[i]] }) : (i === keys.length - 1 ? [] : {});
            arrRef = arrRef[keys[i]];
        }

        const newItem = { ...arrRef[idx] };
        
        const propKeys = propPath.split(".");
        let itemRef = newItem;
        for (let i = 0; i < propKeys.length - 1; i++) {
            itemRef[propKeys[i]] = itemRef[propKeys[i]] ? { ...itemRef[propKeys[i]] } : {};
            itemRef = itemRef[propKeys[i]];
        }
        itemRef[propKeys[propKeys.length - 1]] = value;

        arrRef[idx] = newItem;
        setLocalData(newData);
    };

    const addLink = () => {
        const newArray = [...links, { en: "New Link", bn: "নতুন লিংক", href: "#" }];
        updateGlobalProp("quickLinks.links", newArray as any);
    };

    const deleteLink = (idx: number) => {
        const newArray = links.filter((_: any, i: number) => i !== idx);
        updateGlobalProp("quickLinks.links", newArray as any);
    };

    const addContactItem = () => {
        const newArray = [...contactItems, { icon: "Mail", text: { en: "info@domain.com", bn: "info@domain.com" } }];
        updateGlobalProp("contactInfo.items", newArray as any);
    };

    const deleteContactItem = (idx: number) => {
        const newArray = contactItems.filter((_: any, i: number) => i !== idx);
        updateGlobalProp("contactInfo.items", newArray as any);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const url = await uploadImage(file, "images");
        setIsUploading(false);

        if (url) {
            updateGlobalProp("logoUrl", url);
        } else {
            alert("Image upload failed.");
        }
    };

    if (!data) return null;

    return (
        <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
                <h4 className="font-semibold text-gray-800 text-sm border-b pb-2">Brand Info</h4>
                
                <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase">Brand Logo (Leave empty for default icon)</label>
                    <div className="relative h-20 w-48 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden group">
                        {data.logoUrl ? (
                            <img src={data.logoUrl} alt="Logo" className="h-full w-auto object-contain opacity-80 group-hover:opacity-30 transition-opacity p-2" />
                        ) : (
                            <ImageIcon className="text-gray-400 w-6 h-6" />
                        )}
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => fileInputRef.current?.click()} className="bg-white text-gray-800 px-3 py-1 rounded-md text-xs font-medium shadow-sm flex items-center gap-1">
                                {isUploading ? <Loader2 size={12} className="animate-spin" /> : "Upload"}
                            </button>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Brand Description (EN)</label>
                        <textarea rows={3} value={data.brandDesc?.en || ""} onChange={(e) => updateGlobalProp("brandDesc.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500 resize-y" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Brand Description (BN)</label>
                        <textarea rows={3} value={data.brandDesc?.bn || ""} onChange={(e) => updateGlobalProp("brandDesc.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500 resize-y" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Copyright (EN)</label>
                        <input type="text" value={data.copyright?.en || ""} onChange={(e) => updateGlobalProp("copyright.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Copyright (BN)</label>
                        <input type="text" value={data.copyright?.bn || ""} onChange={(e) => updateGlobalProp("copyright.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500" />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-semibold text-gray-800 text-sm">Quick Links ({links.length})</h4>
                    <button onClick={addLink} className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1">
                        <Plus size={14} /> Add Link
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Links Title (EN)</label>
                        <input type="text" value={data.quickLinks?.title?.en || ""} onChange={(e) => updateGlobalProp("quickLinks.title.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Links Title (BN)</label>
                        <input type="text" value={data.quickLinks?.title?.bn || ""} onChange={(e) => updateGlobalProp("quickLinks.title.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500" />
                    </div>
                </div>
                
                <div className="space-y-3">
                    {links.map((link: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex-1 grid grid-cols-3 gap-2">
                                <input type="text" placeholder="EN" value={link.en || ""} onChange={(e) => updateArrayItem("quickLinks.links", idx, "en", e.target.value)} className="text-xs border border-gray-200 rounded px-2 py-1 outline-none" />
                                <input type="text" placeholder="BN" value={link.bn || ""} onChange={(e) => updateArrayItem("quickLinks.links", idx, "bn", e.target.value)} className="text-xs border border-gray-200 rounded px-2 py-1 outline-none" />
                                <input type="text" placeholder="Href" value={link.href || ""} onChange={(e) => updateArrayItem("quickLinks.links", idx, "href", e.target.value)} className="text-xs border border-gray-200 rounded px-2 py-1 outline-none" />
                            </div>
                            <button onClick={() => deleteLink(idx)} className="text-red-500 p-1 hover:bg-red-50 rounded shrink-0"><Trash2 size={16} /></button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-semibold text-gray-800 text-sm">Contact Details ({contactItems.length})</h4>
                    <button onClick={addContactItem} className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1">
                        <Plus size={14} /> Add Item
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Contact Title (EN)</label>
                        <input type="text" value={data.contactInfo?.title?.en || ""} onChange={(e) => updateGlobalProp("contactInfo.title.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Contact Title (BN)</label>
                        <input type="text" value={data.contactInfo?.title?.bn || ""} onChange={(e) => updateGlobalProp("contactInfo.title.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500" />
                    </div>
                </div>
                
                <div className="space-y-3">
                    {contactItems.map((item: any, idx: number) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                            <div className="flex items-center justify-between">
                                <select value={item.icon || "Phone"} onChange={(e) => updateArrayItem("contactInfo.items", idx, "icon", e.target.value)} className="text-xs font-semibold text-emerald-700 bg-white border border-gray-200 rounded px-2 py-1 outline-none">
                                    <option value="Phone">Phone</option>
                                    <option value="Mail">Mail</option>
                                    <option value="MapPin">MapPin</option>
                                </select>
                                <button onClick={() => deleteContactItem(idx)} className="text-red-500 p-1 hover:bg-red-50 rounded shrink-0"><Trash2 size={16} /></button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <input type="text" placeholder="EN Text" value={typeof item.text === 'object' ? item.text.en : item.text} onChange={(e) => {
                                    const val = e.target.value;
                                    const isObj = typeof item.text === 'object';
                                    updateArrayItem("contactInfo.items", idx, "text", isObj ? { ...item.text, en: val } : { en: val, bn: val });
                                }} className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 outline-none" />
                                
                                <input type="text" placeholder="BN Text" value={typeof item.text === 'object' ? item.text.bn : item.text} onChange={(e) => {
                                    const val = e.target.value;
                                    const isObj = typeof item.text === 'object';
                                    updateArrayItem("contactInfo.items", idx, "text", isObj ? { ...item.text, bn: val } : { en: item.text, bn: val });
                                }} className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 outline-none" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
