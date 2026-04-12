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
    const socialLinks = Array.isArray(data.socialLinks) ? data.socialLinks : [];
    const offices = Array.isArray(data.offices) ? data.offices : [];
    
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const updateGlobalProp = (propPath: string, value: any) => {
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

    const addSocialLink = () => {
        updateGlobalProp("socialLinks", [...socialLinks, { platform: "Facebook", href: "https://" }]);
    };

    const deleteSocialLink = (idx: number) => {
        const newArray = socialLinks.filter((_: any, i: number) => i !== idx);
        updateGlobalProp("socialLinks", newArray);
    };

    const addOffice = () => {
        updateGlobalProp("offices", [...offices, { 
            name: { en: "New Office", bn: "নতুন অফিস" },
            mapUrl: "",
            mapEmbedUrl: "",
            phone: "",
            email: "",
            address: { en: "", bn: "" }
        }]);
    };

    const deleteOffice = (idx: number) => {
        const newArray = offices.filter((_: any, i: number) => i !== idx);
        updateGlobalProp("offices", newArray);
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

            {/* Social Links Panel */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-semibold text-gray-800 text-sm">Social Media Links ({socialLinks.length})</h4>
                    <button onClick={addSocialLink} className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1">
                        <Plus size={14} /> Add Link
                    </button>
                </div>
                <div className="space-y-3">
                    {socialLinks.map((link: any, idx: number) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <select 
                                value={link.platform || "Facebook"} 
                                onChange={(e) => updateArrayItem("socialLinks", idx, "platform", e.target.value)} 
                                className="w-full sm:w-[150px] text-xs font-semibold text-emerald-700 bg-white border border-gray-200 rounded px-2 py-2 outline-none"
                            >
                                <option value="Facebook">Facebook</option>
                                <option value="WhatsApp">WhatsApp</option>
                                <option value="YouTube">YouTube</option>
                                <option value="Instagram">Instagram</option>
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="Twitter">X / Twitter</option>
                            </select>
                            <input 
                                type="text" 
                                placeholder="https://" 
                                value={link.href || ""} 
                                onChange={(e) => updateArrayItem("socialLinks", idx, "href", e.target.value)} 
                                className="flex-1 text-sm border border-gray-200 rounded px-3 py-2 outline-none focus:border-emerald-500" 
                            />
                            <button onClick={() => deleteSocialLink(idx)} className="text-red-500 p-2 hover:bg-red-50 rounded shrink-0 self-end sm:self-auto border border-transparent hover:border-red-200"><Trash2 size={16} /></button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Offices Panel */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-semibold text-gray-800 text-sm">Office Branches ({offices.length})</h4>
                    <button onClick={addOffice} className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1">
                        <Plus size={14} /> Add Office
                    </button>
                </div>
                
                <div className="space-y-4">
                    {offices.map((office: any, idx: number) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4 relative">
                            <button onClick={() => deleteOffice(idx)} className="absolute top-2 right-2 text-red-500 p-1 hover:bg-red-50 rounded shrink-0">
                                <Trash2 size={16} />
                            </button>
                            
                            <h5 className="font-bold text-gray-700 text-xs uppercase mb-2 border-b border-gray-200 pb-1">Branch {idx + 1}</h5>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Office Name (EN)</label>
                                    <input type="text" value={office.name?.en || ""} onChange={(e) => updateArrayItem("offices", idx, "name.en", e.target.value)} className="w-full text-xs box-border border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-emerald-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Office Name (BN)</label>
                                    <input type="text" value={office.name?.bn || ""} onChange={(e) => updateArrayItem("offices", idx, "name.bn", e.target.value)} className="w-full text-xs box-border border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-emerald-500" />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                                    <input type="text" value={office.phone || ""} onChange={(e) => updateArrayItem("offices", idx, "phone", e.target.value)} className="w-full text-xs box-border border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-emerald-500" placeholder="e.g. 01715-599599" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
                                    <input type="text" value={office.email || ""} onChange={(e) => updateArrayItem("offices", idx, "email", e.target.value)} className="w-full text-xs box-border border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-emerald-500" placeholder="e.g. support@nirvaarcare.com" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Address (EN)</label>
                                    <textarea rows={2} value={office.address?.en || ""} onChange={(e) => updateArrayItem("offices", idx, "address.en", e.target.value)} className="w-full text-xs border border-gray-200 rounded-md px-2 py-1.5 outline-none focus:border-emerald-500 resize-y" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Address (BN)</label>
                                    <textarea rows={2} value={office.address?.bn || ""} onChange={(e) => updateArrayItem("offices", idx, "address.bn", e.target.value)} className="w-full text-xs border border-gray-200 rounded-md px-2 py-1.5 outline-none focus:border-emerald-500 resize-y" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Map Thumbnail Embed URL (iframe src)</label>
                                    <input type="text" value={office.mapEmbedUrl || ""} onChange={(e) => updateArrayItem("offices", idx, "mapEmbedUrl", e.target.value)} className="w-full text-xs box-border border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-emerald-500" placeholder="https://www.google.com/maps/embed?pb=..." />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Map Open Target URL (onClick link)</label>
                                    <input type="text" value={office.mapUrl || ""} onChange={(e) => updateArrayItem("offices", idx, "mapUrl", e.target.value)} className="w-full text-xs box-border border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-emerald-500" placeholder="https://maps.app.goo.gl/..." />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
