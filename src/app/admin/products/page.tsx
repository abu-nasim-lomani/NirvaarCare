"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Image as ImageIcon, Video, CheckCircle2, XCircle, Loader2, Save, X, Tag, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ManageProducts() {
    const supabase = createClient();
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [catFilter, setCatFilter] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name_en: "", name_bn: "", slug: "", category_id: "",
        price: "", discount: "", in_stock: true, is_new: false, is_featured: false,
        short_desc_en: "", short_desc_bn: "", desc_en: "", desc_bn: "",
        image: "", images: "", video_url: "",
        features_en: "", features_bn: "", specs: "",
        how_to_use_en: "", how_to_use_bn: "",
        storage_instructions_en: "", storage_instructions_bn: ""
    });

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    const fetchCategories = async () => {
        const { data } = await supabase.from("product_categories").select("*");
        if (data) setCategories(data);
    };

    const fetchProducts = async () => {
        setLoading(true);
        // Using left join to get category name
        const { data, error } = await supabase
            .from("products")
            .select(`
                *,
                product_categories ( name_en, name_bn )
            `)
            .order("created_at", { ascending: false });

        if (!error && data) {
            setProducts(data);
        }
        setLoading(false);
    };

    const openAddModal = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({
            name_en: "", name_bn: "", slug: "", category_id: "",
            price: "", discount: "", in_stock: true, is_new: false, is_featured: false,
            short_desc_en: "", short_desc_bn: "", desc_en: "", desc_bn: "",
            image: "", images: "", video_url: "",
            features_en: "", features_bn: "", specs: "",
            how_to_use_en: "", how_to_use_bn: "",
            storage_instructions_en: "", storage_instructions_bn: ""
        });
        setError(null);
        setIsModalOpen(true);
    };

    const openEditModal = (p: any) => {
        setIsEditing(true);
        setCurrentId(p.id);
        setFormData({
            name_en: p.name_en || "", name_bn: p.name_bn || "", slug: p.slug || "", category_id: p.category_id || "",
            price: p.price?.toString() || "", discount: p.discount?.toString() || "", 
            in_stock: p.in_stock, is_new: p.is_new, is_featured: p.is_featured,
            short_desc_en: p.short_desc_en || "", short_desc_bn: p.short_desc_bn || "", 
            desc_en: p.desc_en || "", desc_bn: p.desc_bn || "",
            image: p.image || "", images: (p.images || []).join('\n'), video_url: p.video_url || "",
            features_en: (p.features_en || []).join('\n'), features_bn: (p.features_bn || []).join('\n'),
            specs: (p.specs || []).map((s: any) => `${s.label?.en || ''} | ${s.label?.bn || ''} | ${s.value || ''}`).join('\n'),
            how_to_use_en: p.how_to_use_en || "", how_to_use_bn: p.how_to_use_bn || "",
            storage_instructions_en: p.storage_instructions_en || "", storage_instructions_bn: p.storage_instructions_bn || ""
        });
        setError(null);
        setIsModalOpen(true);
    };

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'image' | 'images') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingImage(true);
        setError(null);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage.from('products').upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(filePath);

            if (fieldName === 'image') {
                setFormData(prev => ({ ...prev, image: publicUrl }));
            } else {
                setFormData(prev => ({ 
                    ...prev, 
                    images: prev.images ? `${prev.images}\n${publicUrl}` : publicUrl 
                }));
            }
        } catch (err: any) {
            console.error(err);
            setError("Failed to upload image: " + (err.message || "Unknown error"));
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            // Parse array fields
            const features_en = formData.features_en.split('\n').map(s => s.trim()).filter(Boolean);
            const features_bn = formData.features_bn.split('\n').map(s => s.trim()).filter(Boolean);
            const images = formData.images.split('\n').map(s => s.trim()).filter(Boolean);
            const specs = formData.specs.split('\n').map(s => s.trim()).filter(Boolean).map(line => {
                const parts = line.split('|').map(x => x.trim());
                return { label: { en: parts[0] || '', bn: parts[1] || '' }, value: parts[2] || '' };
            });

            const payload = {
                name_en: formData.name_en, name_bn: formData.name_bn, slug: formData.slug, 
                category_id: formData.category_id || null,
                price: Number(formData.price) || 0, discount: formData.discount ? Number(formData.discount) : null,
                in_stock: formData.in_stock, is_new: formData.is_new, is_featured: formData.is_featured,
                short_desc_en: formData.short_desc_en, short_desc_bn: formData.short_desc_bn,
                desc_en: formData.desc_en, desc_bn: formData.desc_bn,
                how_to_use_en: formData.how_to_use_en, how_to_use_bn: formData.how_to_use_bn,
                storage_instructions_en: formData.storage_instructions_en, storage_instructions_bn: formData.storage_instructions_bn,
                image: formData.image, video_url: formData.video_url || null,
                images, features_en, features_bn, specs
            };

            if (isEditing && currentId) {
                const { error } = await supabase.from("products").update(payload).eq("id", currentId);
                if (error) throw error;
            } else {
                const { error } = await supabase.from("products").insert([payload]);
                if (error) throw error;
            }

            setIsModalOpen(false);
            fetchProducts();
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to save product.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            const { error } = await supabase.from("products").delete().eq("id", id);
            if (error) throw error;
            fetchProducts();
        } catch (err: any) {
            alert(err.message || "Failed to delete.");
        }
    };

    const filteredProducts = products.filter(p => {
        if (catFilter && p.category_id !== catFilter) return false;
        if (search) {
            const query = search.toLowerCase();
            return p.name_en.toLowerCase().includes(query) || p.name_bn.toLowerCase().includes(query) || p.slug.toLowerCase().includes(query);
        }
        return true;
    });

    return (
        <div className="space-y-6 p-6 md:p-10 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Manage Products</h1>
                    <p className="text-gray-500 dark:text-gray-400">Add, update, or remove products from the store.</p>
                </div>
                <button onClick={openAddModal} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors">
                    <Plus size={18} /> Add New Product
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-950 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" placeholder="Search products..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
                        value={search} onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="flex-1 md:w-56 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name_en}</option>)}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="animate-spin w-8 h-8 text-emerald-500" /></div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center p-12 text-gray-500">
                        <Package className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                        <p>No products found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Product</th>
                                    <th className="px-6 py-4 font-semibold">Category</th>
                                    <th className="px-6 py-4 font-semibold">Price & Discount</th>
                                    <th className="px-6 py-4 font-semibold">Media</th>
                                    <th className="px-6 py-4 font-semibold">Stock Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    {product.image ? <img src={product.image} alt="" className="w-10 h-10 object-contain" /> : <ImageIcon size={20} className="text-gray-300"/>}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white max-w-[200px] truncate">{product.name_en}</p>
                                                    <p className="text-xs text-gray-500">{product.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-semibold">
                                                {product.product_categories?.name_en || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 dark:text-white">৳{product.price.toLocaleString()}</span>
                                                {product.discount > 0 && (
                                                    <span className="text-xs text-red-500 font-semibold">-{product.discount}% OFF</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <div className="w-7 h-7 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center" title="Images">
                                                    <ImageIcon size={14} />
                                                    <span className="ml-1 text-[10px] font-bold">{(product.images?.length || 0) + 1}</span>
                                                </div>
                                                {product.video_url && (
                                                    <div className="w-7 h-7 rounded bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center" title="Video Included">
                                                        <Video size={14} />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.in_stock ? (
                                                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium text-xs">
                                                    <CheckCircle2 size={14} /> In Stock
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 text-red-500 font-medium text-xs">
                                                    <XCircle size={14} /> Out of Stock
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEditModal(product)} className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
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

            {/* FULL SCREEN MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-50 dark:bg-gray-950 z-50 overflow-y-auto">
                    <div className="max-w-4xl mx-auto p-4 md:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <Package className="text-emerald-500" />
                                {isEditing ? "Edit Product" : "Add New Product"}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            {error && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900">
                                    {error}
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Basic Info */}
                                <div className="space-y-4 md:col-span-2">
                                    <h3 className="font-bold text-lg border-b border-gray-100 dark:border-gray-800 pb-2">Basic Information</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name (English)</label>
                                            <input type="text" name="name_en" required value={formData.name_en} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name (Bengali)</label>
                                            <input type="text" name="name_bn" required value={formData.name_bn} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug (URL Key)</label>
                                            <input type="text" name="slug" required value={formData.slug} onChange={(e) => setFormData(p=>({...p, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')}))} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                            <select name="category_id" required value={formData.category_id} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                                                <option value="">Select Category...</option>
                                                {categories.map(c => <option key={c.id} value={c.id}>{c.name_en}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing & Status */}
                                <div className="space-y-4 md:col-span-2">
                                    <h3 className="font-bold text-lg border-b border-gray-100 dark:border-gray-800 pb-2">Pricing & Status</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (৳)</label>
                                            <input type="number" name="price" required min="0" value={formData.price} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discount (%) (Optional)</label>
                                            <input type="number" name="discount" min="0" max="100" value={formData.discount} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
                                        </div>
                                    </div>
                                    <div className="flex gap-6 mt-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" name="in_stock" checked={formData.in_stock} onChange={handleChange} className="w-5 h-5 accent-emerald-600 rounded" />
                                            <span className="text-sm font-medium">In Stock</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" name="is_new" checked={formData.is_new} onChange={handleChange} className="w-5 h-5 accent-emerald-600 rounded" />
                                            <span className="text-sm font-medium">Mark as New</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="w-5 h-5 accent-emerald-600 rounded" />
                                            <span className="text-sm font-medium">Top Pick / Featured</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Media */}
                                <div className="space-y-4 md:col-span-2">
                                    <h3 className="font-bold text-lg border-b border-gray-100 dark:border-gray-800 pb-2">Media URLs</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Main Image URL</label>
                                                <label className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 cursor-pointer hover:underline flex items-center gap-1">
                                                    {uploadingImage ? <Loader2 size={12} className="animate-spin" /> : <ImageIcon size={12} />}
                                                    {uploadingImage ? "Uploading..." : "Upload File"}
                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'image')} disabled={uploadingImage} />
                                                </label>
                                            </div>
                                            <input type="url" name="image" required value={formData.image} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
                                            {formData.image && <img src={formData.image} alt="Preview" className="mt-2 h-20 rounded-lg border border-gray-200 dark:border-gray-800" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Additional Gallery Images (One URL per line)</label>
                                                <label className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 cursor-pointer hover:underline flex items-center gap-1">
                                                    {uploadingImage ? <Loader2 size={12} className="animate-spin" /> : <ImageIcon size={12} />}
                                                    {uploadingImage ? "Uploading..." : "Upload File"}
                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'images')} disabled={uploadingImage} />
                                                </label>
                                            </div>
                                            <textarea name="images" rows={3} value={formData.images} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">YouTube Embed URL (Optional)</label>
                                            <input type="url" name="video_url" value={formData.video_url} onChange={handleChange} placeholder="e.g. https://www.youtube.com/embed/..." className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
                                        </div>
                                    </div>
                                </div>

                                {/* Descriptions */}
                                <div className="space-y-4 md:col-span-2">
                                    <h3 className="font-bold text-lg border-b border-gray-100 dark:border-gray-800 pb-2">Descriptions</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Desc (English)</label>
                                            <textarea name="short_desc_en" required rows={3} value={formData.short_desc_en} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Desc (Bengali)</label>
                                            <textarea name="short_desc_bn" required rows={3} value={formData.short_desc_bn} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full About (English)</label>
                                            <textarea name="desc_en" required rows={5} value={formData.desc_en} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full About (Bengali)</label>
                                            <textarea name="desc_bn" required rows={5} value={formData.desc_bn} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">How to Use (English)</label>
                                            <textarea name="how_to_use_en" rows={4} value={formData.how_to_use_en} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">How to Use (Bengali)</label>
                                            <textarea name="how_to_use_bn" rows={4} value={formData.how_to_use_bn} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Storage Instructions (English)</label>
                                            <textarea name="storage_instructions_en" rows={3} value={formData.storage_instructions_en} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Storage Instructions (Bengali)</label>
                                            <textarea name="storage_instructions_bn" rows={3} value={formData.storage_instructions_bn} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"></textarea>
                                        </div>
                                    </div>
                                </div>

                                {/* Features & Specs */}
                                <div className="space-y-4 md:col-span-2">
                                    <h3 className="font-bold text-lg border-b border-gray-100 dark:border-gray-800 pb-2">Features & Specifications</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Key Features (English) - One per line</label>
                                            <textarea name="features_en" rows={4} value={formData.features_en} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="Comfortable material&#10;Long battery life"></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Key Features (Bengali) - One per line</label>
                                            <textarea name="features_bn" rows={4} value={formData.features_bn} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="আরামদায়ক উপাদান&#10;দীর্ঘ ব্যাটারি লাইফ"></textarea>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Technical Specifications (Format: Label EN | Label BN | Value) - One per line</label>
                                            <textarea name="specs" rows={4} value={formData.specs} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-mono" placeholder="Weight | ওজন | 250g&#10;Color | রঙ | White"></textarea>
                                            <p className="text-xs text-gray-500 mt-1">Use the pipe character (|) to separate the English label, Bengali label, and the value.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving} className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors disabled:opacity-70 shadow-lg shadow-emerald-600/30">
                                    {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                    {isEditing ? "Update Product" : "Save Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
