"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Tag, Loader2, Save, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Category {
    id: string;
    slug: string;
    name_en: string;
    name_bn: string;
    created_at: string;
}

export default function ManageCategories() {
    const supabase = createClient();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    
    // Form state
    const [slug, setSlug] = useState("");
    const [nameEn, setNameEn] = useState("");
    const [nameBn, setNameBn] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("product_categories")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching categories:", error);
        } else {
            setCategories(data || []);
        }
        setLoading(false);
    };

    const openAddModal = () => {
        setIsEditing(false);
        setCurrentId(null);
        setSlug("");
        setNameEn("");
        setNameBn("");
        setError(null);
        setIsModalOpen(true);
    };

    const openEditModal = (cat: Category) => {
        setIsEditing(true);
        setCurrentId(cat.id);
        setSlug(cat.slug);
        setNameEn(cat.name_en);
        setNameBn(cat.name_bn);
        setError(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            if (isEditing && currentId) {
                // Update
                const { error } = await supabase
                    .from("product_categories")
                    .update({ slug, name_en: nameEn, name_bn: nameBn })
                    .eq("id", currentId);
                if (error) throw error;
            } else {
                // Insert
                const { error } = await supabase
                    .from("product_categories")
                    .insert([{ slug, name_en: nameEn, name_bn: nameBn }]);
                if (error) throw error;
            }
            
            setIsModalOpen(false);
            fetchCategories();
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to save category.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        
        try {
            const { error } = await supabase
                .from("product_categories")
                .delete()
                .eq("id", id);
            
            if (error) throw error;
            fetchCategories();
        } catch (err: any) {
            alert(err.message || "Failed to delete category.");
        }
    };

    return (
        <div className="space-y-6 p-6 md:p-10 max-w-5xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Product Categories</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage categories for the e-commerce store.</p>
                </div>
                <button onClick={openAddModal} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors">
                    <Plus size={18} /> Add Category
                </button>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center p-12 text-gray-500">
                        <Loader2 className="animate-spin w-8 h-8 text-emerald-500" />
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center p-12 text-gray-500">
                        <Tag className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                        <p>No categories found.</p>
                        <p className="text-sm">Click "Add Category" to create one.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Category Name (EN)</th>
                                    <th className="px-6 py-4 font-semibold">Category Name (BN)</th>
                                    <th className="px-6 py-4 font-semibold">Slug (URL)</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {categories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                            {cat.name_en}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                            {cat.name_bn}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-mono">
                                                {cat.slug}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEditModal(cat)} className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(cat.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {isEditing ? "Edit Category" : "Add Category"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-900">
                                    {error}
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug (URL Key)</label>
                                <input 
                                    type="text" required
                                    value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                    placeholder="e.g. mobility-aids"
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name (English)</label>
                                <input 
                                    type="text" required
                                    value={nameEn} onChange={(e) => setNameEn(e.target.value)}
                                    placeholder="e.g. Mobility Aids"
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name (Bengali)</label>
                                <input 
                                    type="text" required
                                    value={nameBn} onChange={(e) => setNameBn(e.target.value)}
                                    placeholder="e.g. মবিলিটি এইডস"
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                                />
                            </div>
                            
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors disabled:opacity-70">
                                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                    {isEditing ? "Update" : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
