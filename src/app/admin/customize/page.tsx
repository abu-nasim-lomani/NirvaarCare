"use client";

import { useState } from "react";
import { Reorder, motion } from "framer-motion";
import { GripVertical, Eye, EyeOff, Trash2, Plus, Edit2, LayoutList } from "lucide-react";
import Link from "next/link";
import { useSiteConfig, SiteSection } from "@/context/SiteConfigContext";

const availableComponents = [
    { id: "HeroSlider", name: "Hero Slider" },
    { id: "TrustBanner", name: "Trust Banner" },
    { id: "AboutUs", name: "About Us" },
    { id: "ServicesGrid", name: "Services Grid" },
    { id: "HowItWorks", name: "How It Works" },
    { id: "WhyChooseUs", name: "Why Choose Us" },
    { id: "Testimonials", name: "Testimonials" },
    { id: "EmergencyCTA", name: "Emergency CTA" },
    { id: "Footer", name: "Global Footer" },
    { id: "Navbar", name: "Navbar (Header)" },
];

export default function CustomizePage() {
    const { sections, isLoading, reorderSections, toggleVisibility, toggleNavVisibility, addSection, deleteSection, updateSection } = useSiteConfig();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // Inline editing state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editEn, setEditEn] = useState("");
    const [editBn, setEditBn] = useState("");

    if (isLoading) {
        return <div className="min-h-[400px] flex items-center justify-center">Loading configuration...</div>;
    }

    const handleAddSection = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const component_id = formData.get("component_id") as string;
        const nav_label_en = formData.get("nav_label_en") as string;
        const nav_label_bn = formData.get("nav_label_bn") as string;

        await addSection({
            component_id,
            nav_label_en,
            nav_label_bn,
            nav_href: `#${nav_label_en.toLowerCase().replace(/\s+/g, '-')}`,
            is_visible: true,
            show_in_nav: true,
            order_index: sections.length + 1,
        });

        setIsAddModalOpen(false);
    };

    return (
        <div className="space-y-6 p-6 md:p-10 max-w-6xl mx-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-3">
                        <LayoutList className="text-emerald-500" />
                        Customize Homepage
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">Drag to reorder sections. Toggle visibility or add new ones.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="mt-4 md:mt-0 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-emerald-600/20"
                >
                    <Plus size={18} /> Add Section
                </button>
            </div>

            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden p-6 max-w-4xl">
                <div className="flex text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 px-12">
                    <div className="w-1/3">Component</div>
                    <div className="w-1/3">Menu Name (EN / BN)</div>
                    <div className="w-1/3 flex justify-end">Actions</div>
                </div>
                
                <Reorder.Group axis="y" values={sections} onReorder={reorderSections} className="space-y-3">
                    {sections.map((section) => (
                        <Reorder.Item
                            key={section.id}
                            value={section}
                            className={`flex items-center gap-4 p-4 rounded-xl border ${
                                section.is_visible 
                                ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm' 
                                : 'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 opacity-60'
                            }`}
                        >
                            <GripVertical className="text-gray-400 cursor-grab hover:text-emerald-500 flex-shrink-0" />
                            
                            <div className="w-1/3 flex flex-col">
                                <span className="font-semibold text-gray-900 dark:text-gray-100">{section.component_id}</span>
                                <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded w-fit mt-1">Section Component</span>
                            </div>

                            <div 
                                className="w-1/3 flex flex-col cursor-pointer p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                                onDoubleClick={() => {
                                    setEditingId(section.id);
                                    setEditEn(section.nav_label_en);
                                    setEditBn(section.nav_label_bn);
                                }}
                            >
                                {editingId === section.id ? (
                                    <div className="space-y-1.5" onClick={e => e.stopPropagation()}>
                                        <input 
                                            autoFocus 
                                            type="text" 
                                            value={editEn} 
                                            onChange={(e) => setEditEn(e.target.value)} 
                                            className="w-full text-sm font-medium border border-emerald-500 rounded px-2 py-1 bg-white dark:bg-gray-900 outline-none" 
                                            placeholder="EN Name"
                                        />
                                        <input 
                                            type="text" 
                                            value={editBn} 
                                            onChange={(e) => setEditBn(e.target.value)} 
                                            className="w-full text-sm border border-emerald-500 rounded px-2 py-1 bg-white dark:bg-gray-900 outline-none" 
                                            placeholder="BN Name"
                                        />
                                        <div className="flex gap-2 pt-1">
                                            <button 
                                                onClick={() => { 
                                                    updateSection(section.id, { 
                                                        nav_label_en: editEn, 
                                                        nav_label_bn: editBn,
                                                        nav_href: `#${editEn.toLowerCase().replace(/\s+/g, '-')}`
                                                    }); 
                                                    setEditingId(null); 
                                                }} 
                                                className="text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-1 rounded"
                                            >
                                                Save
                                            </button>
                                            <button 
                                                onClick={() => setEditingId(null)} 
                                                className="text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <span className="font-medium text-gray-700 dark:text-gray-300" title="Double-click to edit">{section.nav_label_en}</span>
                                        <span className="text-sm text-gray-500" title="Double-click to edit">{section.nav_label_bn}</span>
                                    </>
                                )}
                            </div>

                            <div className="flex-1 flex justify-end gap-2 text-sm">
                                <Link
                                    href={`/admin/customize/${section.id}`}
                                    title="Edit Section Content"
                                    className="p-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors flex items-center justify-center"
                                >
                                    <Edit2 size={18} />
                                </Link>
                                
                                <button
                                    onClick={() => toggleNavVisibility(section.id, !section.show_in_nav)}
                                    title="Toggle in Navbar"
                                    className={`p-2 rounded-lg transition-colors text-xs font-medium ${
                                        section.show_in_nav 
                                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
                                        : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                                    }`}
                                >
                                    {section.show_in_nav ? "Menu: ON" : "Menu: OFF"}
                                </button>
                                
                                <button
                                    onClick={() => toggleVisibility(section.id, !section.is_visible)}
                                    title="Toggle Section Visibility"
                                    className={`p-2 rounded-lg transition-colors ${
                                        section.is_visible 
                                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 hover:bg-emerald-100" 
                                        : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 hover:bg-gray-200 hover:text-gray-600"
                                    }`}
                                >
                                    {section.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                                
                                <button
                                    onClick={() => deleteSection(section.id)}
                                    title="Delete Section"
                                    className="p-2 bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            </div>

            {/* Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-gray-800"
                    >
                        <h3 className="text-xl font-bold mb-4">Add New Section</h3>
                        <form onSubmit={handleAddSection} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Component</label>
                                <select 
                                    name="component_id" 
                                    required 
                                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    {availableComponents.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Menu Label (English)</label>
                                <input 
                                    type="text" 
                                    name="nav_label_en" 
                                    required 
                                    placeholder="e.g. Services"
                                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Menu Label (Bengali)</label>
                                <input 
                                    type="text" 
                                    name="nav_label_bn" 
                                    required 
                                    placeholder="e.g. সেবাসমূহ"
                                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div className="flex gap-3 justify-end mt-8">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors"
                                >
                                    Add Section
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
