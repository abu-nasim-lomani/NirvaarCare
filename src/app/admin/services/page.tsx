"use client";

import { useEffect, useState } from "react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { servicesData } from "@/constants";
import { Save, Loader2, LayoutTemplate } from "lucide-react";
import ServicesGridEditor from "@/components/admin/editors/ServicesGridEditor";
import ServiceDetailsPreview from "@/components/admin/editors/ServiceDetailsPreview";

export default function ServicesCmsPage() {
    const { sections, updateSectionData } = useSiteConfig();
    const [isSaving, setIsSaving] = useState(false);
    const [localData, setLocalData] = useState<any>(null);
    const [activeSection, setActiveSection] = useState<any>(null);
    const [previewIdx, setPreviewIdx] = useState(0);

    useEffect(() => {
        if (sections.length > 0) {
            const section = sections.find(s => s.component_id === "ServicesGrid");
            if (section) {
                setActiveSection(section);
                if (localData === null) {
                    if (section.content_data && (Array.isArray(section.content_data) ? section.content_data.length > 0 : Object.keys(section.content_data).length > 0)) {
                        const parsedData = JSON.parse(JSON.stringify(section.content_data));
                        
                        // Auto-merge missing fields from constants if the database is older
                        if (parsedData.items) {
                            parsedData.items.forEach((item: any) => {
                                if (!item.extended) item.extended = {};
                                const defaultExtended = servicesData.items.find(s => s.id === item.id)?.extended;
                                if (defaultExtended) {
                                    if (!item.extended.deliveries) item.extended.deliveries = (defaultExtended as any).deliveries || [];
                                    if (!item.extended.stories) item.extended.stories = (defaultExtended as any).stories || [];
                                }
                            });
                        }
                        setLocalData(parsedData);
                    } else {
                        setLocalData(JSON.parse(JSON.stringify(servicesData)));
                    }
                }
            }
        }
    }, [sections]);

    const handleSave = async () => {
        if (!activeSection) return;
        setIsSaving(true);
        await updateSectionData(activeSection.id, localData);
        setIsSaving(false);
    };

    if (!localData || !activeSection) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <Loader2 className="animate-spin text-emerald-500 w-8 h-8" />
        </div>
    );

    return (
        <div className="flex h-full flex-grow bg-white dark:bg-gray-950 overflow-hidden font-sans w-full flex-col md:flex-row">
            {/* ── Left Sidebar (Editor Form) ─────────────────────────────────── */}
            <div className="w-full md:w-1/3 min-w-[350px] md:max-w-[450px] flex flex-col border-r border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 shadow-xl z-10 shrink-0 h-full">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col items-start gap-4 sticky top-0 z-20">
                    <div className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <LayoutTemplate className="text-emerald-500" size={20} />
                        Service Details CMS
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Manage all your services and their internal pages from here.</p>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
                
                <div className="p-4 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                    <ServicesGridEditor 
                        localData={localData} 
                        setLocalData={setLocalData} 
                        onActiveIdxChange={setPreviewIdx}
                        hideGlobalHeader={true}
                    />
                </div>
            </div>

            {/* ── Right Side (Live Preview) ────────────────────────────────────── */}
            <div className="hidden md:flex flex-1 bg-gray-100 dark:bg-gray-900 flex-col relative h-full">
                <div className="absolute top-4 right-4 z-20 bg-gray-900/80 backdrop-blur text-white px-4 py-1.5 rounded-full text-xs font-medium shadow-xl flex items-center gap-2 border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Preview (Service Details Page)
                </div>
                <div className="flex-1 overflow-y-auto w-full relative">
                    <div className="transform origin-top w-full h-full scale-[0.65] lg:scale-[0.8] xl:scale-95 origin-top mt-10">
                        {localData?.items?.[previewIdx] ? (
                            <ServiceDetailsPreview service={localData.items[previewIdx]} />
                        ) : (
                            <div className="p-10 text-gray-500">No service selected...</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
