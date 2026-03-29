"use client";

import { useState, useRef } from "react";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/supabase";

export default function NavbarEditor({
    localData,
    setLocalData,
}: {
    localData: any;
    setLocalData: (data: any) => void;
}) {
    const data = localData || {};
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const updateProp = (prop: string, value: string) => {
        const newData = { ...data };
        const keys = prop.split(".");
        if (keys.length === 2) {
            newData[keys[0]] = { ...newData[keys[0]], [keys[1]]: value };
        } else {
            newData[keys[0]] = value;
        }
        setLocalData(newData);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const url = await uploadImage(file, "images");
        setIsUploading(false);

        if (url) {
            updateProp("logoUrl", url);
        } else {
            alert("Image upload failed. Ensure 'images' bucket exists and is public.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-5">
                <h4 className="font-semibold text-gray-800 text-sm border-b pb-2">Navbar Logo</h4>
                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase">Logo Image (Leave empty for default text logo)</label>
                    <div className="relative h-24 w-64 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden group">
                        {data.logoUrl ? (
                            <img 
                                src={data.logoUrl} 
                                alt="Logo Preview" 
                                className="h-full w-auto object-contain opacity-80 group-hover:opacity-30 transition-opacity p-2"
                            />
                        ) : (
                            <ImageIcon className="text-gray-400 w-8 h-8" />
                        )}
                        
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-white text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium shadow-sm flex items-center gap-2"
                            >
                                {isUploading ? <Loader2 size={14} className="animate-spin" /> : (data.logoUrl ? "Change Logo" : "Upload Logo")}
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
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
                <h4 className="font-semibold text-gray-800 text-sm border-b pb-2">Emergency Hotline Button</h4>
                
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Desktop Text (EN)</label>
                        <input type="text" placeholder="e.g. Emergency" value={data.emergencyText?.en || ""} onChange={(e) => updateProp("emergencyText.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Desktop Text (BN)</label>
                        <input type="text" placeholder="e.g. জরুরি সেবা" value={data.emergencyText?.bn || ""} onChange={(e) => updateProp("emergencyText.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Mobile Text (EN)</label>
                        <input type="text" placeholder="e.g. Emergency Hotline" value={data.emergencyTextMobile?.en || ""} onChange={(e) => updateProp("emergencyTextMobile.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Mobile Text (BN)</label>
                        <input type="text" placeholder="e.g. জরুরি সেবা (হটলাইন)" value={data.emergencyTextMobile?.bn || ""} onChange={(e) => updateProp("emergencyTextMobile.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number / URL</label>
                    <input type="text" placeholder="tel:+8801700000000" value={data.emergencyUrl || ""} onChange={(e) => updateProp("emergencyUrl", e.target.value)} className="w-full text-sm border border-emerald-200 bg-emerald-50 rounded-md px-3 py-2 outline-none focus:border-emerald-500" />
                    <p className="text-xs text-gray-500 mt-1">Use <code>tel:</code> prefix for direct phone calls.</p>
                </div>
            </div>
        </div>
    );
}
