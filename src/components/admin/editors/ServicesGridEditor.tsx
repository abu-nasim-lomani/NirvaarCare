"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, Image as ImageIcon, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { uploadImage } from "@/lib/supabase";

export default function ServicesGridEditor({
    localData,
    setLocalData,
    onActiveIdxChange,
    hideGlobalHeader = false,
}: {
    localData: any;
    setLocalData: (data: any) => void;
    onActiveIdxChange?: (idx: number) => void;
    hideGlobalHeader?: boolean;
}) {
    const data = localData || {};
    const items = Array.isArray(data.items) ? data.items : [];
    const [activeIdx, setActiveIdx] = useState(0);
    const [activeTab, setActiveTab] = useState<"basic" | "details" | "benefits" | "steps" | "delivery" | "stories">("basic");
    const [isUploading, setIsUploading] = useState<number | null>(null);

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

    const updateItemProp = (idx: number, propPath: string, value: string | any) => {
        const newData = { ...data };
        const newItems = [...items];
        const item = { ...newItems[idx] };

        const keys = propPath.split(".");
        let current: any = item;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;

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
            extended: {
                videoUrl: "",
                tagline: { bn: "", en: "" },
                benefits: [],
                steps: []
            }
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

    const handleAddArrayItem = (idx: number, type: "benefits" | "steps" | "deliveries" | "stories") => {
        const currentArr = items[idx]?.extended?.[type] || [];
        
        let newItem: any;
        if (type === "benefits") {
            newItem = { icon: "check", bn: "নতুন বেনিফিট", en: "New Benefit" };
        } else if (type === "steps") {
            newItem = { bn: "নতুন স্টেপ", en: "New Step" };
        } else if (type === "deliveries") {
            newItem = { bn: "নতুন ডেলিভারি ধাপ", en: "New Delivery Phase" };
        } else if (type === "stories") {
            newItem = { 
                name: { bn: "গ্রাহকের নাম", en: "Client Name" }, 
                quote: { bn: "মতামত...", en: "Testimonial quote..." }, 
                rating: 5, 
                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2" 
            };
        }

        updateItemProp(idx, `extended.${type}`, [...currentArr, newItem]);
    };

    const handleDeleteArrayItem = (idx: number, type: "benefits" | "steps" | "deliveries" | "stories", arrIdx: number) => {
        const currentArr = items[idx]?.extended?.[type] || [];
        updateItemProp(idx, `extended.${type}`, currentArr.filter((_: any, i: number) => i !== arrIdx));
    };

    if (!data) return null;

    const activeItem = items[activeIdx];

    return (
        <div className="space-y-6">
            {/* Global Section Details */}
            {!hideGlobalHeader && (
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
            )}

            {/* Service Cards Array Editor */}
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-700 text-sm tracking-wide uppercase flex items-center gap-2">
                        Services Catalog
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-xs">{items.length}</span>
                    </h3>
                    <button onClick={addNewItem} className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1">
                        <Plus size={14} /> Add Service
                    </button>
                </div>

                {/* Service Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {items.map((srv: any, idx: number) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setActiveIdx(idx);
                                if (onActiveIdxChange) onActiveIdxChange(idx);
                            }}
                            className={`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                activeIdx === idx
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                            } border`}
                        >
                            {srv.title?.en || `Service ${idx + 1}`}
                        </button>
                    ))}
                </div>

                {/* Active Specific Form */}
                {activeItem && (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                        <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50/50">
                            <h4 className="font-bold text-gray-800 text-sm truncate pr-4">
                                {activeItem.title?.en || "New Service"}
                            </h4>
                            <button onClick={() => deleteItem(activeIdx)} className="text-red-500 hover:text-red-600 p-1.5 hover:bg-red-50 rounded transition-colors shrink-0" title="Delete Service">
                                <Trash2 size={16} />
                            </button>
                        </div>
                        
                        {/* Sub Tabs for editing sections of the service */}
                        <div className="flex bg-gray-50 border-b border-gray-200 px-1 overflow-x-auto scrollbar-thin">
                            <button onClick={() => setActiveTab('basic')} className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'basic' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Basic Info</button>
                            <button onClick={() => setActiveTab('details')} className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'details' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Details</button>
                            <button onClick={() => setActiveTab('benefits')} className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'benefits' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Benefits ({activeItem.extended?.benefits?.length || 0})</button>
                            <button onClick={() => setActiveTab('steps')} className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'steps' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Steps ({activeItem.extended?.steps?.length || 0})</button>
                            <button onClick={() => setActiveTab('delivery')} className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'delivery' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Delivery ({activeItem.extended?.deliveries?.length || 0})</button>
                            <button onClick={() => setActiveTab('stories')} className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === 'stories' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Stories ({activeItem.extended?.stories?.length || 0})</button>
                        </div>

                        <div className="p-4 space-y-4">
                            {activeTab === 'basic' && (
                                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">Service Icon</label>
                                            <select value={activeItem.icon} onChange={(e) => updateItemProp(activeIdx, "icon", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500">
                                                <option value="Activity">Activity</option>
                                                <option value="Stethoscope">Stethoscope</option>
                                                <option value="Pill">Pill</option>
                                                <option value="Ambulance">Ambulance</option>
                                                <option value="ShoppingBag">ShoppingBag</option>
                                                <option value="HeartHandshake">HeartHandshake</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">Service Image URL (Banner)</label>
                                            <input type="text" value={activeItem.image || ""} onChange={(e) => updateItemProp(activeIdx, "image", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500" placeholder="https://..." />
                                        </div>
                                    </div>

                                    <div className="space-y-3 p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                                        <label className="block text-xs font-semibold text-emerald-700 mb-1">Card Title</label>
                                        <input type="text" placeholder="EN" value={activeItem.title?.en || ""} onChange={(e) => updateItemProp(activeIdx, "title.en", e.target.value)} className="w-full text-sm border border-emerald-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none mb-2 bg-white" />
                                        <input type="text" placeholder="BN" value={activeItem.title?.bn || ""} onChange={(e) => updateItemProp(activeIdx, "title.bn", e.target.value)} className="w-full text-sm border border-emerald-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none bg-white" />
                                    </div>

                                    <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Short Description (for Home Card)</label>
                                        <textarea rows={3} placeholder="EN" value={activeItem.description?.en || ""} onChange={(e) => updateItemProp(activeIdx, "description.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none mb-2 resize-y bg-white" />
                                        <textarea rows={3} placeholder="BN" value={activeItem.description?.bn || ""} onChange={(e) => updateItemProp(activeIdx, "description.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none resize-y bg-white" />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'details' && (
                                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-3 p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
                                        <label className="block text-xs font-semibold text-indigo-700 mb-1">Page Tagline (Under Main Title)</label>
                                        <textarea rows={2} placeholder="EN" value={activeItem.extended?.tagline?.en || ""} onChange={(e) => updateItemProp(activeIdx, "extended.tagline.en", e.target.value)} className="w-full text-sm border border-indigo-200 rounded-md px-3 py-1.5 focus:border-indigo-500 outline-none bg-white" />
                                        <textarea rows={2} placeholder="BN" value={activeItem.extended?.tagline?.bn || ""} onChange={(e) => updateItemProp(activeIdx, "extended.tagline.bn", e.target.value)} className="w-full text-sm border border-indigo-200 rounded-md px-3 py-1.5 focus:border-indigo-500 outline-none bg-white mt-2" />
                                    </div>

                                    <div className="space-y-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                                        <label className="block text-xs font-semibold text-blue-700 mb-1">Detailed Overview (For Service Page Only)</label>
                                        <textarea rows={5} placeholder="Long detailed overview in EN..." value={activeItem.extended?.fullDescription?.en || ""} onChange={(e) => updateItemProp(activeIdx, "extended.fullDescription.en", e.target.value)} className="w-full text-sm border border-blue-200 rounded-md px-3 py-2 focus:border-blue-500 outline-none resize-y bg-white" />
                                        <textarea rows={5} placeholder="Long detailed overview in BN..." value={activeItem.extended?.fullDescription?.bn || ""} onChange={(e) => updateItemProp(activeIdx, "extended.fullDescription.bn", e.target.value)} className="w-full text-sm border border-blue-200 rounded-md px-3 py-2 focus:border-blue-500 outline-none resize-y bg-white mt-2" />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'benefits' && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                                    {(activeItem.extended?.benefits || []).map((ben: any, bIdx: number) => (
                                        <div key={bIdx} className="p-3 border border-gray-200 rounded-lg relative bg-white group">
                                            <button onClick={() => handleDeleteArrayItem(activeIdx, "benefits", bIdx)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 size={14} />
                                            </button>
                                            <div className="pr-6 space-y-2">
                                                <input type="text" value={ben.en || ""} onChange={(e) => updateItemProp(activeIdx, `extended.benefits.${bIdx}.en`, e.target.value)} placeholder="Benefit EN" className="w-full text-xs font-medium border-b border-gray-100 pb-1 outline-none focus:border-emerald-500 bg-transparent" />
                                                <input type="text" value={ben.bn || ""} onChange={(e) => updateItemProp(activeIdx, `extended.benefits.${bIdx}.bn`, e.target.value)} placeholder="Benefit BN" className="w-full text-xs font-medium border-b border-gray-100 pb-1 outline-none focus:border-emerald-500 bg-transparent" />
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={() => handleAddArrayItem(activeIdx, "benefits")} className="w-full py-2 border-2 border-dashed border-emerald-200 text-emerald-600 rounded-lg text-xs font-semibold hover:border-emerald-400 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1">
                                        <Plus size={14} /> Add Benefit
                                    </button>
                                </div>
                            )}

                            {activeTab === 'steps' && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                                    {(activeItem.extended?.steps || []).map((step: any, sIdx: number) => (
                                        <div key={sIdx} className="p-3 border border-gray-200 rounded-lg relative bg-white group flex gap-3">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs">{sIdx + 1}</div>
                                            <div className="flex-1 pr-6 space-y-2">
                                                <input type="text" value={step.en || ""} onChange={(e) => updateItemProp(activeIdx, `extended.steps.${sIdx}.en`, e.target.value)} placeholder="Step EN" className="w-full text-xs font-medium border-b border-gray-100 pb-1 outline-none focus:border-emerald-500 bg-transparent" />
                                                <input type="text" value={step.bn || ""} onChange={(e) => updateItemProp(activeIdx, `extended.steps.${sIdx}.bn`, e.target.value)} placeholder="Step BN" className="w-full text-xs font-medium border-b border-gray-100 pb-1 outline-none focus:border-emerald-500 bg-transparent" />
                                            </div>
                                            <button onClick={() => handleDeleteArrayItem(activeIdx, "steps", sIdx)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <button onClick={() => handleAddArrayItem(activeIdx, "steps")} className="w-full py-2 border-2 border-dashed border-emerald-200 text-emerald-600 rounded-lg text-xs font-semibold hover:border-emerald-400 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1">
                                        <Plus size={14} /> Add Step
                                    </button>
                                </div>
                            )}

                            {activeTab === 'delivery' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                                        <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Service Process Video URL (Optional)</label>
                                        <input type="text" value={activeItem.extended?.videoUrl || ""} onChange={(e) => updateItemProp(activeIdx, "extended.videoUrl", e.target.value)} placeholder="https://www.youtube.com/embed/..." className="w-full text-xs border border-gray-200 p-2 rounded-lg focus:border-emerald-500 outline-none" />
                                        <p className="text-[10px] text-gray-400 mt-1">Shown on the left side of the delivery section. Leave empty to show an image thumbnail instead.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-xs font-semibold text-gray-600 border-b border-gray-100 pb-2">Delivery Points</p>
                                        {(activeItem.extended?.deliveries || []).map((del: any, dIdx: number) => (
                                        <div key={dIdx} className="p-3 border border-gray-200 rounded-lg relative bg-white group flex gap-3">
                                            <div className="flex-1 pr-6 space-y-2">
                                                <input type="text" value={del.en || ""} onChange={(e) => updateItemProp(activeIdx, `extended.deliveries.${dIdx}.en`, e.target.value)} placeholder="Delivery Point EN" className="w-full text-xs font-medium border-b border-gray-100 pb-1 outline-none focus:border-emerald-500 bg-transparent" />
                                                <input type="text" value={del.bn || ""} onChange={(e) => updateItemProp(activeIdx, `extended.deliveries.${dIdx}.bn`, e.target.value)} placeholder="Delivery Point BN" className="w-full text-xs font-medium border-b border-gray-100 pb-1 outline-none focus:border-emerald-500 bg-transparent" />
                                            </div>
                                            <button onClick={() => handleDeleteArrayItem(activeIdx, "deliveries", dIdx)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    <button onClick={() => handleAddArrayItem(activeIdx, "deliveries")} className="w-full py-2 border-2 border-dashed border-emerald-200 text-emerald-600 rounded-lg text-xs font-semibold hover:border-emerald-400 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1">
                                        <Plus size={14} /> Add Delivery Point
                                    </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'stories' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <p className="text-xs text-gray-500 mb-2">Client stories / Testimonials dedicated to this specific service.</p>
                                    {(activeItem.extended?.stories || []).map((story: any, sIdx: number) => (
                                        <div key={sIdx} className="p-4 border border-gray-200 rounded-lg relative bg-white group space-y-3 shadow-sm hover:border-emerald-200 transition-colors">
                                            <button onClick={() => handleDeleteArrayItem(activeIdx, "stories", sIdx)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Delete Story">
                                                <Trash2 size={16} />
                                            </button>
                                            
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-[10px] font-semibold text-gray-500 uppercase">Client Name (EN)</label>
                                                    <input type="text" value={story.name?.en || ""} onChange={(e) => updateItemProp(activeIdx, `extended.stories.${sIdx}.name.en`, e.target.value)} className="w-full text-xs border border-gray-200 p-1.5 rounded focus:border-emerald-500 outline-none" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-semibold text-gray-500 uppercase">Client Name (BN)</label>
                                                    <input type="text" value={story.name?.bn || ""} onChange={(e) => updateItemProp(activeIdx, `extended.stories.${sIdx}.name.bn`, e.target.value)} className="w-full text-xs border border-gray-200 p-1.5 rounded focus:border-emerald-500 outline-none" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-[10px] font-semibold text-gray-500 uppercase">Quote (EN)</label>
                                                    <textarea rows={2} value={story.quote?.en || ""} onChange={(e) => updateItemProp(activeIdx, `extended.stories.${sIdx}.quote.en`, e.target.value)} className="w-full text-xs border border-gray-200 p-1.5 rounded focus:border-emerald-500 outline-none resize-none" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-semibold text-gray-500 uppercase">Quote (BN)</label>
                                                    <textarea rows={2} value={story.quote?.bn || ""} onChange={(e) => updateItemProp(activeIdx, `extended.stories.${sIdx}.quote.bn`, e.target.value)} className="w-full text-xs border border-gray-200 p-1.5 rounded focus:border-emerald-500 outline-none resize-none" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-[10px] font-semibold text-gray-500 uppercase">Image URL</label>
                                                    <input type="text" value={story.image || ""} onChange={(e) => updateItemProp(activeIdx, `extended.stories.${sIdx}.image`, e.target.value)} className="w-full text-xs border border-gray-200 p-1.5 rounded focus:border-emerald-500 outline-none" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-semibold text-gray-500 uppercase">Star Rating (1-5)</label>
                                                    <input type="number" min="1" max="5" value={story.rating || 5} onChange={(e) => updateItemProp(activeIdx, `extended.stories.${sIdx}.rating`, parseInt(e.target.value))} className="w-full text-xs border border-gray-200 p-1.5 rounded focus:border-emerald-500 outline-none" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={() => handleAddArrayItem(activeIdx, "stories")} className="w-full py-2.5 border-2 border-dashed border-emerald-200 text-emerald-600 rounded-lg text-xs font-semibold hover:border-emerald-400 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1 mt-2">
                                        <Plus size={14} /> Add Client Story
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
