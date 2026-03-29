"use client";

import { useState, useRef } from "react";
import { Reorder } from "framer-motion";
import { Plus, Trash2, Image as ImageIcon, Loader2, GripHorizontal } from "lucide-react";
import { uploadImage } from "@/lib/supabase";

export default function HeroSliderEditor({ 
    localData, 
    setLocalData,
    activeSlideIdx,
    setActiveSlideIdx
}: { 
    localData: any, 
    setLocalData: (data: any) => void,
    activeSlideIdx: number,
    setActiveSlideIdx: (idx: number) => void
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState<number | null>(null);

    const updateSlideProp = (idx: number, propPath: string, value: string) => {
        const newData = { ...localData };
        const slides = [...newData.slides];
        const slide = { ...slides[idx] };
        
        const keys = propPath.split('.');
        if (keys.length === 2) {
            slide[keys[0]] = { ...slide[keys[0]], [keys[1]]: value };
        } else if (keys.length === 3) {
            slide[keys[0]] = { ...slide[keys[0]], [keys[1]]: { ...slide[keys[0]][keys[1]], [keys[2]]: value } };
        } else {
            slide[keys[0]] = value;
        }

        slides[idx] = slide;
        newData.slides = slides;
        setLocalData(newData);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, slideIndex: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(slideIndex);
        const url = await uploadImage(file, "images");
        setIsUploading(null);

        if (url) {
            updateSlideProp(slideIndex, "imageBg", url);
        } else {
            alert("Image upload failed. Ensure 'images' bucket exists and is public.");
        }
    };

    const addNewSlide = () => {
        const newData = { ...localData };
        const slides = [...newData.slides];
        const template = slides[0] ? { ...slides[0] } : {
            id: Date.now(),
            imageBg: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289",
            gradient: "from-emerald-950/90 via-emerald-900/60 to-transparent",
            badge: { en: "New Slide", bn: "নতুন স্লাইড" },
            trust: { en: "Trusted Service", bn: "বিশ্বস্ত সেবা" },
            headline: { en: "Your Headline Here", bn: "আপনার শিরোনাম" },
            sub: { en: "Subtext here", bn: "সাবটেক্সট" },
            primaryCTA: { en: "Click Here", bn: "ক্লিক করুন", href: "#" },
            secondaryCTA: { en: "Learn More", bn: "আরও জানুন", href: "#" }
        };
        template.id = Date.now();
        template.secondaryCTA = template.secondaryCTA || { en: "", bn: "", href: "#" };
        template.trust = template.trust || { en: "", bn: "" };
        slides.push(JSON.parse(JSON.stringify(template)));
        newData.slides = slides;
        setLocalData(newData);
        setActiveSlideIdx(slides.length - 1);
    };

    const deleteSlide = (idx: number) => {
        const newData = { ...localData };
        newData.slides = newData.slides.filter((_: any, i: number) => i !== idx);
        setLocalData(newData);
        setActiveSlideIdx(Math.max(0, idx - 1));
    };

    if (!localData || !localData.slides) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-700 text-sm tracking-wide uppercase">Slides ({localData.slides.length})</h3>
                <button onClick={addNewSlide} className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-1">
                    <Plus size={14} /> Add Slide
                </button>
            </div>

            <Reorder.Group 
                axis="x" 
                values={localData.slides} 
                onReorder={(newOrder) => {
                    const activeSlideId = localData.slides[activeSlideIdx]?.id;
                    const newData = { ...localData, slides: newOrder };
                    setLocalData(newData);
                    if (activeSlideId) {
                        const newIdx = newOrder.findIndex((s: any) => s.id === activeSlideId);
                        if (newIdx !== -1) setActiveSlideIdx(newIdx);
                    }
                }} 
                className="flex gap-2 overflow-x-auto pb-4 pt-1 scrollbar-none items-center"
            >
                {localData.slides.map((slide: any, idx: number) => (
                    <Reorder.Item 
                        key={slide.id || idx} 
                        value={slide}
                        className="shrink-0 relative"
                    >
                        <div 
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border ${
                                activeSlideIdx === idx 
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm" 
                                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <div className="cursor-grab active:cursor-grabbing p-1 -ml-2 rounded hover:bg-black/5 transition-colors">
                                <GripHorizontal size={14} className="opacity-40" />
                            </div>
                            <button 
                                onClick={() => setActiveSlideIdx(idx)}
                                className="outline-none"
                            >
                                Slide {idx + 1}
                            </button>
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            {localData.slides[activeSlideIdx] && (
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-5 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-800">Editing Slide {activeSlideIdx + 1}</h4>
                        <button 
                            onClick={() => deleteSlide(activeSlideIdx)}
                            className="text-red-500 hover:text-red-600 p-1.5 hover:bg-red-50 rounded"
                            title="Delete Slide"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase">Background Image</label>
                        <div className="relative h-32 w-full rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden group">
                            {localData.slides[activeSlideIdx].imageBg ? (
                                <img 
                                    src={localData.slides[activeSlideIdx].imageBg} 
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
                                    {isUploading === activeSlideIdx ? <Loader2 size={14} className="animate-spin" /> : "Upload Image"}
                                </button>
                                <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={(e) => handleImageUpload(e, activeSlideIdx)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Badge (EN)</label>
                            <input type="text" value={localData.slides[activeSlideIdx].badge.en} onChange={(e) => updateSlideProp(activeSlideIdx, "badge.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Badge (BN)</label>
                            <input type="text" value={localData.slides[activeSlideIdx].badge.bn} onChange={(e) => updateSlideProp(activeSlideIdx, "badge.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Headline (EN) - Use \n for breaks</label>
                            <textarea rows={3} value={localData.slides[activeSlideIdx].headline.en} onChange={(e) => updateSlideProp(activeSlideIdx, "headline.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500 resize-y" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Headline (BN)</label>
                            <textarea rows={3} value={localData.slides[activeSlideIdx].headline.bn} onChange={(e) => updateSlideProp(activeSlideIdx, "headline.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500 resize-y" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Subtext (EN)</label>
                            <textarea rows={3} value={localData.slides[activeSlideIdx].sub?.en || ""} onChange={(e) => updateSlideProp(activeSlideIdx, "sub.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500 resize-y" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Subtext (BN)</label>
                            <textarea rows={3} value={localData.slides[activeSlideIdx].sub?.bn || ""} onChange={(e) => updateSlideProp(activeSlideIdx, "sub.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 outline-none focus:border-emerald-500 resize-y" />
                        </div>
                    </div>

                    <div className="space-y-3 p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                        <label className="block text-xs font-semibold text-amber-700 mb-1">Trust Badge / Small Text</label>
                        <input type="text" placeholder="EN (e.g. 100% Transparency)" value={localData.slides[activeSlideIdx].trust?.en || ""} onChange={(e) => updateSlideProp(activeSlideIdx, "trust.en", e.target.value)} className="w-full text-sm border border-amber-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none" />
                        <input type="text" placeholder="BN" value={localData.slides[activeSlideIdx].trust?.bn || ""} onChange={(e) => updateSlideProp(activeSlideIdx, "trust.bn", e.target.value)} className="w-full text-sm border border-amber-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none" />
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Primary Button (Clear text to hide)</label>
                        <div className="space-y-2">
                            <input type="text" placeholder="Title EN" value={localData.slides[activeSlideIdx].primaryCTA?.en || ""} onChange={(e) => updateSlideProp(activeSlideIdx, "primaryCTA.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none" />
                            <input type="text" placeholder="Title BN" value={localData.slides[activeSlideIdx].primaryCTA?.bn || ""} onChange={(e) => updateSlideProp(activeSlideIdx, "primaryCTA.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none" />
                            <input type="text" placeholder="Href (e.g. #services)" value={localData.slides[activeSlideIdx].primaryCTA?.href || ""} onChange={(e) => updateSlideProp(activeSlideIdx, "primaryCTA.href", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none" />
                        </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <label className="block text-xs font-semibold text-gray-700 mb-2">Secondary Button (Clear text to hide)</label>
                        <div className="space-y-2">
                            <input type="text" placeholder="Title EN" value={localData.slides[activeSlideIdx].secondaryCTA?.en || ""} onChange={(e) => updateSlideProp(activeSlideIdx, "secondaryCTA.en", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none" />
                            <input type="text" placeholder="Title BN" value={localData.slides[activeSlideIdx].secondaryCTA?.bn || ""} onChange={(e) => updateSlideProp(activeSlideIdx, "secondaryCTA.bn", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none" />
                            <input type="text" placeholder="Href urls" value={localData.slides[activeSlideIdx].secondaryCTA?.href || ""} onChange={(e) => updateSlideProp(activeSlideIdx, "secondaryCTA.href", e.target.value)} className="w-full text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:border-emerald-500 outline-none" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
