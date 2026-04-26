"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    Search, SlidersHorizontal, X, ShoppingCart, Heart,
    Star, ChevronDown, Check, Zap, Shield,
    Package, Truck, AlertCircle, Grid3X3, List,
    Tag, BadgePercent
} from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/constants/products";
import CartDrawer from "@/components/products/CartDrawer";

export default function ProductsPage() {
    const { lang } = useLang();
    const { addToCart, cartCount, cart } = useCart();

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("featured");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [wishlist, setWishlist] = useState<Set<string>>(new Set());
    const [cartOpen, setCartOpen] = useState(false);
    const [addedToCart, setAddedToCart] = useState<string | null>(null);

    const [dbProducts, setDbProducts] = useState<Product[]>([]);
    const [dbCategories, setDbCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            const { data: catData } = await supabase.from("product_categories").select("*");
            const { data: prodData } = await supabase.from("products").select(`*, product_categories(slug, name_en, name_bn)`);
            
            if (catData) {
                setDbCategories(catData.map(c => ({ id: c.slug, name: { en: c.name_en, bn: c.name_bn }, icon: "Activity" })));
            }
            if (prodData) {
                setDbProducts(prodData.map(p => ({
                    id: p.slug,
                    name: { en: p.name_en, bn: p.name_bn },
                    category: p.product_categories?.slug || p.category_id,
                    categoryName: { en: p.product_categories?.name_en || '', bn: p.product_categories?.name_bn || '' },
                    image: p.image,
                    images: p.images || [],
                    videoUrl: p.video_url || undefined,
                    price: p.price,
                    discount: p.discount || undefined,
                    rating: p.rating || 5,
                    reviewCount: p.review_count || 0,
                    inStock: p.in_stock,
                    isNew: p.is_new,
                    isFeatured: p.is_featured,
                    shortDesc: { en: p.short_desc_en, bn: p.short_desc_bn },
                    description: { en: p.desc_en, bn: p.desc_bn },
                    features: p.features_en?.map((fen: string, i: number) => ({ en: fen, bn: p.features_bn?.[i] || fen })) || [],
                    specs: p.specs || [],
                    tags: []
                })));
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const maxPrice = 50000;

    const filteredProducts = useMemo(() => {
        let result = dbProducts.filter(p => {
            const matchSearch = search === "" ||
                p.name.en.toLowerCase().includes(search.toLowerCase()) ||
                p.name.bn.includes(search) ||
                p.category.toLowerCase().includes(search.toLowerCase());
            const matchCat = selectedCategory === "all" || p.category === selectedCategory;
            const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
            return matchSearch && matchCat && matchPrice;
        });

        switch (sortBy) {
            case "price-asc": result = [...result].sort((a, b) => a.price - b.price); break;
            case "price-desc": result = [...result].sort((a, b) => b.price - a.price); break;
            case "rating": result = [...result].sort((a, b) => b.rating - a.rating); break;
            case "newest": result = [...result].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
            default: result = [...result].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        }
        return result;
    }, [dbProducts, search, selectedCategory, sortBy, priceRange]);

    const handleAddToCart = (product: Product, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
        setAddedToCart(product.id);
        setTimeout(() => setAddedToCart(null), 1500);
    };

    const toggleWishlist = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setWishlist(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const sortOptions = [
        { value: "featured", label: { en: "Featured", bn: "ফিচার্ড" } },
        { value: "newest", label: { en: "Newest", bn: "নতুন" } },
        { value: "price-asc", label: { en: "Price: Low to High", bn: "দাম: কম থেকে বেশি" } },
        { value: "price-desc", label: { en: "Price: High to Low", bn: "দাম: বেশি থেকে কম" } },
        { value: "rating", label: { en: "Top Rated", bn: "সর্বোচ্চ রেটিং" } },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pt-20">

            {/* ── Hero Banner ──────────────────────────────────────── */}
            <div className="relative bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-800 overflow-hidden">
                <div className="absolute top-0 left-[-5%] w-96 h-96 bg-emerald-400/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-[-5%] w-80 h-80 bg-teal-300/20 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-400/20 border border-emerald-400/30 text-emerald-200 text-sm font-semibold mb-5">
                            <Package size={15} />
                            {lang === "en" ? "Health Store" : "হেলথ স্টোর"}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-5 leading-tight">
                            {lang === "en" ? (<>Smart <span className="text-emerald-300">Health</span> Products</>) : (<>স্মার্ট <span className="text-emerald-300">স্বাস্থ্য</span> পণ্যসমূহ</>)}
                        </h1>
                        <p className="text-emerald-100/80 text-lg max-w-2xl mx-auto mb-10">
                            {lang === "en" ? "Clinically trusted health tech devices for home monitoring, therapy & elder care." : "হোম মনিটরিং, থেরাপি ও বয়স্ক সেবার জন্য বিশ্বাসযোগ্য স্বাস্থ্য প্রযুক্তি পণ্য।"}
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {[
                                { icon: Shield, en: "Quality Guaranteed", bn: "মান নিশ্চিত" },
                                { icon: Truck, en: "Fast Delivery", bn: "দ্রুত ডেলিভারি" },
                                { icon: Zap, en: "Easy Returns", bn: "সহজ রিটার্ন" },
                            ].map((item, i) => (
                                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.1 }}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm">
                                    <item.icon size={14} className="text-emerald-300" />
                                    {lang === "en" ? item.en : item.bn}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── Main Content ─────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Top Bar */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-8">
                    <div className="relative flex-1">
                        <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder={lang === "en" ? "Search products…" : "পণ্য খুঁজুন…"}
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400 transition-all shadow-sm text-sm"
                        />
                        {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={16} /></button>}
                    </div>
                    <div className="relative">
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                            className="appearance-none pl-4 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400/50 shadow-sm cursor-pointer">
                            {sortOptions.map(o => <option key={o.value} value={o.value}>{lang === "en" ? o.label.en : o.label.bn}</option>)}
                        </select>
                        <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all shadow-sm ${showFilters ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"}`}>
                        <SlidersHorizontal size={16} />
                        {lang === "en" ? "Filters" : "ফিল্টার"}
                    </button>
                    <div className="flex border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                        {(["grid", "list"] as const).map(mode => (
                            <button key={mode} onClick={() => setViewMode(mode)}
                                className={`px-3 py-3 transition-colors ${viewMode === mode ? "bg-emerald-600 text-white" : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
                                {mode === "grid" ? <Grid3X3 size={16} /> : <List size={16} />}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setCartOpen(true)}
                        className="relative flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-lg shadow-emerald-600/25 transition-all">
                        <ShoppingCart size={18} />
                        {lang === "en" ? "Cart" : "কার্ট"}
                        {cartCount > 0 && (
                            <motion.span key={cartCount} initial={{ scale: 0 }} animate={{ scale: 1 }}
                                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center">
                                {cartCount}
                            </motion.span>
                        )}
                    </button>
                </div>

                {/* Filter Panel */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
                            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                                <div className="flex flex-col lg:flex-row gap-8">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-3 flex items-center gap-2">
                                            <Tag size={15} className="text-emerald-600" />
                                            {lang === "en" ? "Category" : "বিভাগ"}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {[{ id: "all", name: { en: "All Products", bn: "সব পণ্য" } }, ...dbCategories].map(cat => (
                                                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${selectedCategory === cat.id ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-emerald-300"}`}>
                                                    {lang === "en" ? cat.name.en : cat.name.bn}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="lg:w-72">
                                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-3 flex items-center gap-2">
                                            <BadgePercent size={15} className="text-emerald-600" />
                                            {lang === "en" ? "Price Range" : "মূল্য সীমা"}
                                        </h3>
                                        <input type="range" min={0} max={maxPrice} value={priceRange[1]}
                                            onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                                            className="w-full accent-emerald-600 cursor-pointer" />
                                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                                            <span>৳{priceRange[0].toLocaleString()}</span>
                                            <span className="font-semibold text-emerald-600">৳{priceRange[1].toLocaleString()}{priceRange[1] === maxPrice ? "+" : ""}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Category pill tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-8" style={{ scrollbarWidth: "none" }}>
                    {[{ id: "all", name: { en: "All", bn: "সব" } }, ...dbCategories].map(cat => (
                        <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border ${selectedCategory === cat.id ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20" : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-emerald-300"}`}>
                            {lang === "en" ? cat.name.en : cat.name.bn}
                        </button>
                    ))}
                </div>

                <div className="flex items-center justify-between mb-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {lang === "en" ? `Showing ${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""}` : `${filteredProducts.length}টি পণ্য দেখাচ্ছে`}
                    </p>
                </div>

                {/* Products Grid/List */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-24">
                        <AlertCircle size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                            {lang === "en" ? "No products found" : "কোনো পণ্য পাওয়া যায়নি"}
                        </p>
                        <button onClick={() => { setSearch(""); setSelectedCategory("all"); setPriceRange([0, maxPrice]); }}
                            className="mt-4 text-emerald-600 hover:underline text-sm">
                            {lang === "en" ? "Clear filters" : "ফিল্টার মুছুন"}
                        </button>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredProducts.map((product, idx) => (
                            <ProductCard key={product.id} product={product} lang={lang} idx={idx}
                                inCart={cart.some(i => i.id === product.id)}
                                inWishlist={wishlist.has(product.id)}
                                justAdded={addedToCart === product.id}
                                onWishlist={(e) => toggleWishlist(product.id, e)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {filteredProducts.map((product, idx) => (
                            <ProductListItem key={product.id} product={product} lang={lang} idx={idx}
                                inCart={cart.some(i => i.id === product.id)}
                                inWishlist={wishlist.has(product.id)}
                                justAdded={addedToCart === product.id}
                                onWishlist={(e) => toggleWishlist(product.id, e)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Cart Drawer */}
            <CartDrawer isOpen={cartOpen} lang={lang} onClose={() => setCartOpen(false)} />
        </div>
    );
}

// ── Product Card (Grid) ──────────────────────────────────────────────
function ProductCard({ product, lang, idx, inCart, inWishlist, justAdded, onWishlist }: {
    product: Product; lang: string; idx: number;
    inCart: boolean; inWishlist: boolean; justAdded: boolean;
    onWishlist: (e: React.MouseEvent) => void;
}) {
    const discountedPrice = product.discount ? Math.round(product.price * (1 - product.discount / 100)) : product.price;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}>
            <Link href={`/products/${product.id}`}
                className="group block bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                {/* Image */}
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-gray-800 dark:to-gray-900 h-52">
                    <img src={product.image} alt={product.name.en}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        {product.isNew && <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[11px] font-bold">{lang === "en" ? "NEW" : "নতুন"}</span>}
                        {product.discount && <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[11px] font-bold">-{product.discount}%</span>}
                        {product.isFeatured && !product.isNew && <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-900 text-[11px] font-bold">⭐ Top</span>}
                    </div>
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button onClick={onWishlist}
                            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${inWishlist ? "bg-red-500 text-white" : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-red-500"}`}>
                            <Heart size={15} fill={inWishlist ? "currentColor" : "none"} />
                        </button>
                    </div>
                    {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                                {lang === "en" ? "Out of Stock" : "স্টক নেই"}
                            </span>
                        </div>
                    )}
                </div>
                {/* Info */}
                <div className="p-4">
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wide mb-1.5">
                        {product.categoryName[lang === "en" ? "en" : "bn"]}
                    </p>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {product.name[lang === "en" ? "en" : "bn"]}
                    </h3>
                    <div className="flex items-center gap-1.5 mb-3">
                        <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={12} className={i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-300 dark:text-gray-600"} />
                            ))}
                        </div>
                        <span className="text-[11px] text-gray-400">({product.reviewCount})</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">৳{discountedPrice.toLocaleString()}</span>
                        {product.discount && <span className="text-sm text-gray-400 line-through">৳{product.price.toLocaleString()}</span>}
                    </div>
                    <div
                        className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20">
                        {lang === "en" ? "View Details" : "বিস্তারিত দেখুন"}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// ── Product List Item ────────────────────────────────────────────────
function ProductListItem({ product, lang, idx, inCart, inWishlist, justAdded, onWishlist }: {
    product: Product; lang: string; idx: number;
    inCart: boolean; inWishlist: boolean; justAdded: boolean;
    onWishlist: (e: React.MouseEvent) => void;
}) {
    const discountedPrice = product.discount ? Math.round(product.price * (1 - product.discount / 100)) : product.price;

    return (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}>
            <Link href={`/products/${product.id}`}
                className="group flex bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300">
                <div className="w-36 sm:w-48 flex-shrink-0 bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-gray-800 dark:to-gray-900 relative">
                    <img src={product.image} alt={product.name.en}
                        className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.isNew && <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-bold">NEW</span>}
                        {product.discount && <span className="px-1.5 py-0.5 rounded bg-red-500 text-white text-[10px] font-bold">-{product.discount}%</span>}
                    </div>
                </div>
                <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wide mb-1">
                                    {product.categoryName[lang === "en" ? "en" : "bn"]}
                                </p>
                                <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                    {product.name[lang === "en" ? "en" : "bn"]}
                                </h3>
                            </div>
                            <button onClick={onWishlist}
                                className={`flex-shrink-0 w-9 h-9 rounded-full border flex items-center justify-center transition-all ${inWishlist ? "bg-red-50 border-red-300 text-red-500" : "border-gray-200 dark:border-gray-700 text-gray-400 hover:text-red-500"}`}>
                                <Heart size={16} fill={inWishlist ? "currentColor" : "none"} />
                            </button>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                            {product.shortDesc[lang === "en" ? "en" : "bn"]}
                        </p>
                        <div className="flex items-center gap-1.5">
                            <div className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={12} className={i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-300 dark:text-gray-600"} />
                                ))}
                            </div>
                            <span className="text-[11px] text-gray-400">({product.reviewCount})</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">৳{discountedPrice.toLocaleString()}</span>
                            {product.discount && <span className="text-sm text-gray-400 line-through">৳{product.price.toLocaleString()}</span>}
                        </div>
                            <div className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20">
                                {lang === "en" ? "View Details" : "বিস্তারিত দেখুন"}
                            </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
