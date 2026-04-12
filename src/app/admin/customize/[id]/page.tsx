"use client";

import { use, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSiteConfig } from "@/context/SiteConfigContext";

import { heroSlides, trustBannerData, aboutData, servicesData, processData, whyChooseData, testimonialData, emergencyCtaData, footerData } from "@/constants";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import HeroSlider from "@/components/sections/HeroSlider";
import TrustBanner from "@/components/sections/TrustBanner";
import AboutUs from "@/components/sections/AboutUs";
import ServicesGrid from "@/components/sections/ServicesGrid";
import HowItWorks from "@/components/sections/HowItWorks";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Testimonials from "@/components/sections/Testimonials";
import EmergencyCTA from "@/components/sections/EmergencyCTA";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

import HeroSliderEditor from "@/components/admin/editors/HeroSliderEditor";
import TrustBannerEditor from "@/components/admin/editors/TrustBannerEditor";
import AboutUsEditor from "@/components/admin/editors/AboutUsEditor";
import ServicesGridEditor from "@/components/admin/editors/ServicesGridEditor";
import HowItWorksEditor from "@/components/admin/editors/HowItWorksEditor";
import WhyChooseUsEditor from "@/components/admin/editors/WhyChooseUsEditor";
import TestimonialEditor from "@/components/admin/editors/TestimonialEditor";
import EmergencyCTAEditor from "@/components/admin/editors/EmergencyCTAEditor";
import FooterEditor from "@/components/admin/editors/FooterEditor";
import NavbarEditor from "@/components/admin/editors/NavbarEditor";
import WhatWeDoEditor from "@/components/admin/editors/WhatWeDoEditor";

export default function VisualEditor({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { sections, updateSectionData } = useSiteConfig();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [localData, setLocalData] = useState<any>(null);
    const [activeSection, setActiveSection] = useState<any>(null);
    const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);

    // Initialize the editor data
    useEffect(() => {
        if (sections.length > 0) {
            const section = sections.find(s => s.id === id);
            if (section) {
                setActiveSection(section);
                if (localData === null) {
                    if (section.content_data && (Array.isArray(section.content_data) ? section.content_data.length > 0 : Object.keys(section.content_data).length > 0)) {
                        setLocalData(JSON.parse(JSON.stringify(section.content_data)));
                    } else if (section.component_id === "HeroSlider") {
                        setLocalData({ slides: JSON.parse(JSON.stringify(heroSlides)) });
                    } else if (section.component_id === "TrustBanner") {
                        setLocalData(JSON.parse(JSON.stringify(trustBannerData)));
                    } else if (section.component_id === "AboutUs") {
                        setLocalData(JSON.parse(JSON.stringify(aboutData)));
                    } else if (section.component_id === "ServicesGrid") {
                        setLocalData(JSON.parse(JSON.stringify(servicesData)));
                    } else if (section.component_id === "HowItWorks") {
                        setLocalData(JSON.parse(JSON.stringify(processData)));
                    } else if (section.component_id === "WhyChooseUs") {
                        setLocalData(JSON.parse(JSON.stringify(whyChooseData)));
                    } else if (section.component_id === "Testimonials") {
                        setLocalData(JSON.parse(JSON.stringify(testimonialData)));
                    } else if (section.component_id === "EmergencyCTA") {
                        setLocalData(JSON.parse(JSON.stringify(emergencyCtaData)));
                    } else if (section.component_id === "WhatWeDo") {
                        setLocalData({
                            badge: { bn: "আমরা যা করি", en: "What We Do" },
                            title: { bn: "আপনার প্রিয়জনের যত্নে আমাদের প্রতিশ্রুতি", en: "Our Commitment to Caring for Your Loved Ones" },
                            paragraphs: [
                                { bn: "প্রিয় মানুষদের থেকে দূরে থাকা সহজ নয়। জীবনের প্রয়োজনে অনেকেই দেশের বাইরে বা ব্যস্ত শহরে থাকেন, কিন্তু মন সবসময় পড়ে থাকে বাবা-মা ও আপনজনদের কাছে। তারা কেমন আছেন, সময়মতো খাচ্ছেন কিনা, অসুস্থ হলে পাশে কেউ আছে কিনা - এই দুশ্চিন্তা যেন আপনাকে একা বহন করতে না হয়, সেই দায়িত্বই নেয় নির্ভার কেয়ার।", en: "Being away from your loved ones is never easy. Many people live abroad or in busy cities due to work or life commitments, yet their hearts remain close to their parents and family members. Concerns about whether they are eating on time, staying well, or receiving proper care during illness can often become a constant worry. Nirvaar Care is here to share that responsibility with you." },
                                { bn: "আমরা শুধু একটি সেবা প্রদান করি না - আমরা চেষ্টা করি আপনার পরিবারের একজন হয়ে উঠতে। যত্ন, সম্মান ও আন্তরিকতার সাথে আমরা নিশ্চিত করি, আপনার প্রিয়জনরা সবসময় নিরাপদ, স্বস্তিতে এবং ভালো আছেন।", en: "We are not just a service provider — we strive to become a trusted extension of your family. With compassion, respect, and sincere care, we ensure that your loved ones remain safe, comfortable, and well cared for at all times." }
                            ]
                        });
                    } else if (section.component_id === "Footer") {
                        setLocalData(JSON.parse(JSON.stringify(footerData)));
                    } else if (section.component_id === "Navbar") {
                        setLocalData({});
                    } else {
                        setLocalData({});
                    }
                }
            } else {
                router.push("/admin/customize");
            }
        }
    }, [id, sections]);

    const handleSave = async () => {
        if (!activeSection) return;
        setIsSaving(true);
        await updateSectionData(id, localData);
        setIsSaving(false);
    };

    if (!localData || !activeSection) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-emerald-500 w-8 h-8" />
        </div>
    );

    return (
        <div className="flex h-full flex-grow bg-white overflow-hidden font-sans w-full">
            {/* ── Left Sidebar (Editor Form) ─────────────────────────────────── */}
            <div className="w-1/3 min-w-[350px] flex flex-col border-r border-gray-200 bg-gray-50/50 shadow-xl z-10 shrink-0">
                <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
                    <button onClick={() => router.push("/admin/customize")} className="text-gray-500 hover:text-gray-800 transition-colors p-2 rounded-lg hover:bg-gray-100">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="font-semibold text-gray-800 flex items-center gap-2">
                        <span>{activeSection.component_id}</span>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Editor</span>
                    </div>
                    <button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Render Specific Editors based on Component ID */}
                    {activeSection.component_id === "HeroSlider" ? (
                        <HeroSliderEditor 
                            localData={localData} 
                            setLocalData={setLocalData} 
                            activeSlideIdx={activeSlideIdx} 
                            setActiveSlideIdx={setActiveSlideIdx} 
                        />
                    ) : activeSection.component_id === "TrustBanner" ? (
                        <TrustBannerEditor 
                            localData={localData} 
                            setLocalData={setLocalData} 
                        />
                    ) : activeSection.component_id === "AboutUs" ? (
                        <AboutUsEditor 
                            localData={localData} 
                            setLocalData={setLocalData} 
                        />
                    ) : activeSection.component_id === "ServicesGrid" ? (
                        <ServicesGridEditor 
                            localData={localData} 
                            setLocalData={setLocalData} 
                        />
                    ) : activeSection.component_id === "HowItWorks" ? (
                        <HowItWorksEditor 
                            localData={localData} 
                            setLocalData={setLocalData} 
                        />
                    ) : activeSection.component_id === "WhatWeDo" ? (
                        <WhatWeDoEditor 
                            localData={localData} 
                            setLocalData={setLocalData} 
                        />
                    ) : activeSection.component_id === "WhyChooseUs" ? (
                        <WhyChooseUsEditor 
                            localData={localData} 
                            setLocalData={setLocalData} 
                        />
                    ) : activeSection.component_id === "Testimonials" ? (
                        <TestimonialEditor 
                            localData={localData} 
                            setLocalData={setLocalData} 
                        />
                    ) : activeSection.component_id === "EmergencyCTA" ? (
                        <EmergencyCTAEditor 
                            localData={localData} 
                            setLocalData={setLocalData} 
                        />
                    ) : activeSection.component_id === "Footer" ? (
                        <FooterEditor 
                            localData={localData} 
                            setLocalData={setLocalData} 
                        />
                    ) : activeSection.component_id === "Navbar" ? (
                        <NavbarEditor 
                            localData={localData} 
                            setLocalData={setLocalData} 
                        />
                    ) : (
                        <div className="p-4 bg-amber-50 rounded-xl text-amber-800 text-sm border border-amber-200 shadow-sm flex flex-col gap-2">
                            <span className="font-semibold text-base">We're almost there! 🚧</span>
                            <span>Visual editor for <b>"{activeSection.component_id}"</b> is not yet implemented. Try editing HeroSlider, TrustBanner, or AboutUs.</span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Right Pane (Live Preview) ─────────────────────────────────── */}
            <div className="w-2/3 flex-1 relative bg-gray-950 overflow-y-auto">
                <div className="sticky top-0 bg-gray-900/80 backdrop-blur border-b border-gray-800 text-gray-400 text-xs py-2 px-4 shadow z-50 flex justify-between items-center">
                    <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Live Preview</span>
                    <span>100% Scale</span>
                </div>
                
                {/* The Live Component */}
                <div className="w-full h-auto min-h-[100dvh]">
                    {activeSection.component_id === "HeroSlider" && (
                        <HeroSlider data={localData} isEditorMode={true} forceSlideIdx={activeSlideIdx} />
                    )}
                    {activeSection.component_id === "TrustBanner" && (
                        <TrustBanner data={localData} />
                    )}
                    {activeSection.component_id === "AboutUs" && (
                        <AboutUs data={localData} />
                    )}
                    {activeSection.component_id === "ServicesGrid" && (
                        <ServicesGrid data={localData} />
                    )}
                    {activeSection.component_id === "HowItWorks" && (
                        <HowItWorks data={localData} />
                    )}
                    {activeSection.component_id === "WhyChooseUs" && (
                        <WhyChooseUs data={localData} />
                    )}
                    {activeSection.component_id === "Testimonials" && (
                        <Testimonials data={localData} />
                    )}
                    {activeSection.component_id === "EmergencyCTA" && (
                        <EmergencyCTA data={localData} />
                    )}
                    {activeSection.component_id === "Footer" && (
                        <Footer data={localData} />
                    )}
                    {activeSection.component_id === "Navbar" && (
                        <Navbar data={localData} isPreview={true} />
                    )}
                </div>
            </div>
        </div>
    );
}
