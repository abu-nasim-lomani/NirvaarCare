"use client";

import { use } from "react";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ChevronRight, Star, ShoppingCart, Zap, Heart,
    Share2, Shield, Truck, RotateCcw, Phone,
    Check, Minus, Plus, Package, ArrowLeft,
    CheckCircle2, Info, MessageCircle, Tag, Play
} from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { productsData } from "@/constants/products";
import type { Product } from "@/constants/products";
import { createClient } from "@/lib/supabase/client";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { lang } = useLang();
    const { addToCart, cart } = useCart();
    const router = useRouter();

    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<"overview" | "specs" | "reviews">("overview");
    const [inWishlist, setInWishlist] = useState(false);
    const [addedFeedback, setAddedFeedback] = useState(false);
    const [showStickyBar, setShowStickyBar] = useState(false);
    const [activeMediaIndex, setActiveMediaIndex] = useState(0);
    const ctaRef = useRef<HTMLDivElement>(null);

    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchProduct = async () => {
            const { data } = await supabase
                .from("products")
                .select(`*, product_categories(slug, name_en, name_bn)`)
                .eq("slug", id)
                .single();

            if (data) {
                const mappedProduct: Product = {
                    id: data.slug,
                    name: { en: data.name_en, bn: data.name_bn },
                    category: data.product_categories?.slug || data.category_id,
                    categoryName: { en: data.product_categories?.name_en || '', bn: data.product_categories?.name_bn || '' },
                    image: data.image,
                    images: data.images || [],
                    videoUrl: data.video_url || undefined,
                    price: data.price,
                    discount: data.discount || undefined,
                    rating: data.rating || 5,
                    reviewCount: data.review_count || 0,
                    inStock: data.in_stock,
                    isNew: data.is_new,
                    isFeatured: data.is_featured,
                    shortDesc: { en: data.short_desc_en, bn: data.short_desc_bn },
                    description: { en: data.desc_en, bn: data.desc_bn },
                    features: data.features_en?.map((fen: string, i: number) => ({ en: fen, bn: data.features_bn?.[i] || fen })) || [],
                    specs: data.specs || [],
                    tags: []
                };
                setProduct(mappedProduct);

                // Fetch related products
                const { data: relatedData } = await supabase
                    .from("products")
                    .select(`*, product_categories(slug, name_en, name_bn)`)
                    .eq("category_id", data.category_id)
                    .neq("id", data.id)
                    .limit(4);

                if (relatedData) {
                    setRelatedProducts(relatedData.map(p => ({
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
            }
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    const inCart = product ? cart.some(i => i.id === product.id) : false;

    useEffect(() => {
        if (!ctaRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => setShowStickyBar(!entry.isIntersecting),
            { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
        );
        observer.observe(ctaRef.current);
        return () => observer.disconnect();
    }, [product]);

    // Scroll to top on load
    useEffect(() => { window.scrollTo(0, 0); }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20 bg-white dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20 bg-white dark:bg-gray-950">
                <div className="text-center p-8">
                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-5">
                        <Package size={36} className="text-gray-300 dark:text-gray-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">
                        {lang === "en" ? "Product not found" : "পণ্য পাওয়া যায়নি"}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        {lang === "en" ? "This product may have been removed or doesn't exist." : "এই পণ্যটি সরানো হয়েছে বা বিদ্যমান নেই।"}
                    </p>
                    <Link href="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors">
                        <ArrowLeft size={18} />
                        {lang === "en" ? "Back to Products" : "পণ্য তালিকায় ফিরুন"}
                    </Link>
                </div>
            </div>
        );
    }

    const discountedPrice = product.discount
        ? Math.round(product.price * (1 - product.discount / 100))
        : product.price;
    const savings = product.price - discountedPrice;



    const mediaItems = product ? [
        { type: "image", url: product.image },
        ...(product.images ? product.images.map(url => ({ type: "image", url })) : []),
        ...(product.videoUrl ? [{ type: "video", url: product.videoUrl }] : [])
    ] : [];
    const activeMedia = mediaItems[activeMediaIndex] || { type: "image", url: "" };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAddedFeedback(true);
        setTimeout(() => setAddedFeedback(false), 2000);
    };



    const handleWhatsAppOrder = () => {
        const msg = encodeURIComponent(
            `Hello NirvaarCare!\n\nI want to buy:\n• ${product.name.en} (Qty: ${quantity})\n  Price: ৳${(discountedPrice * quantity).toLocaleString()}\n\nPlease confirm my order. Thank you!`
        );
        window.open(`https://wa.me/8801715599599?text=${msg}`, "_blank");
    };



    const tabs: { id: "overview" | "specs"; label: string }[] = [
        { id: "overview", label: lang === "en" ? "Overview" : "বিবরণ" },
        { id: "specs", label: lang === "en" ? "Specifications" : "স্পেসিফিকেশন" },
    ];

    const WhatsappIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-20 pb-24 lg:pb-0">

            {/* ── Breadcrumb ─────────────────────────────────────────── */}
            <div className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 flex-wrap">
                        <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                            {lang === "en" ? "Home" : "হোম"}
                        </Link>
                        <ChevronRight size={13} className="text-gray-300" />
                        <Link href="/products" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                            {lang === "en" ? "Health Store" : "হেলথ স্টোর"}
                        </Link>
                        <ChevronRight size={13} className="text-gray-300" />
                        <span className="text-gray-400">{product.categoryName[lang === "en" ? "en" : "bn"]}</span>
                        <ChevronRight size={13} className="text-gray-300" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium line-clamp-1 max-w-[200px]">
                            {product.name[lang === "en" ? "en" : "bn"]}
                        </span>
                    </nav>
                </div>
            </div>

            {/* ── Main Product Hero ──────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

                    {/* LEFT: Image ── */}
                    <div>
                        <div className="sticky top-28 flex flex-col md:flex-row gap-4 items-start">
                            {/* Thumbnails (Left side on desktop, bottom on mobile) */}
                            {mediaItems.length > 1 && (
                                <div className="flex md:flex-col gap-3 overflow-auto md:max-h-[500px] w-full md:w-20 flex-shrink-0 order-2 md:order-1" style={{ scrollbarWidth: "none" }}>
                                    {mediaItems.map((item, idx) => (
                                        <button key={idx} onClick={() => setActiveMediaIndex(idx)}
                                            className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all ${activeMediaIndex === idx ? "border-emerald-500 shadow-md shadow-emerald-500/20" : "border-transparent opacity-70 hover:opacity-100"}`}>
                                            {item.type === "image" ? (
                                                <img src={item.url} alt="thumbnail" className="w-full h-full object-cover bg-gray-50 dark:bg-gray-800" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative">
                                                    <Play size={24} className="text-emerald-600" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="flex-1 w-full min-w-0 order-1 md:order-2">
                                {/* Main Image Box */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="relative bg-gradient-to-br from-slate-50 via-emerald-50/40 to-teal-50/20 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-3xl overflow-hidden aspect-square shadow-xl shadow-gray-200/50 dark:shadow-none"
                                >
                                {/* Decorative orbs */}
                                <div className="absolute top-6 right-6 w-40 h-40 bg-emerald-300/25 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
                                <div className="absolute bottom-6 left-6 w-32 h-32 bg-teal-300/20 dark:bg-teal-600/10 rounded-full blur-2xl pointer-events-none" />

                                {/* Badges */}
                                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                    {product.isNew && (
                                        <motion.span initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                                            className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/30">
                                            {lang === "en" ? "✨ NEW ARRIVAL" : "✨ নতুন পণ্য"}
                                        </motion.span>
                                    )}

                                </div>

                                {/* Top-right action buttons */}
                                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-center">
                                    {/* Professional Circle Discount Badge */}
                                    {product.discount && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.3 }}
                                            className="w-12 h-12 rounded-full bg-red-500 text-white flex flex-col items-center justify-center shadow-lg shadow-red-500/40 mb-1 z-20">
                                            <span className="text-[13px] font-black leading-none">-{product.discount}%</span>
                                            <span className="text-[9px] font-bold uppercase tracking-wider">{lang === "en" ? "OFF" : "ছাড়"}</span>
                                        </motion.div>
                                    )}
                                    <motion.button whileTap={{ scale: 0.9 }}
                                        onClick={() => setInWishlist(!inWishlist)}
                                        className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${inWishlist ? "bg-red-500 text-white shadow-red-400/40" : "bg-white dark:bg-gray-800 text-gray-400 hover:text-red-500 hover:shadow-red-200/40 dark:hover:shadow-none"}`}>
                                        <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
                                    </motion.button>
                                    <motion.button whileTap={{ scale: 0.9 }}
                                        onClick={() => { if (navigator.share) navigator.share({ title: product.name.en, url: window.location.href }); else navigator.clipboard.writeText(window.location.href); }}
                                        className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 text-gray-400 hover:text-emerald-600 shadow-lg flex items-center justify-center transition-all">
                                        <Share2 size={18} />
                                    </motion.button>
                                </div>

                                {/* Product Image/Video */}
                                {activeMedia.type === "image" ? (
                                    <motion.img
                                        key={activeMedia.url}
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                        src={activeMedia.url}
                                        alt={product.name.en}
                                        className="w-full h-full object-contain p-10 hover:scale-105 transition-transform duration-700 relative z-0"
                                    />
                                ) : (
                                    <div className="w-full h-full relative z-0 flex items-center justify-center p-4">
                                        <iframe
                                            src={activeMedia.url}
                                            title="Product Video"
                                            className="w-full h-full rounded-xl"
                                            allowFullScreen
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        ></iframe>
                                    </div>
                                )}

                                {/* Out of stock overlay */}
                                {!product.inStock && (
                                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
                                        <div className="bg-white dark:bg-gray-900 rounded-2xl px-6 py-4 text-center">
                                            <Package size={32} className="mx-auto text-gray-400 mb-2" />
                                            <p className="font-bold text-gray-700 dark:text-gray-300">
                                                {lang === "en" ? "Out of Stock" : "স্টক নেই"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>




                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Product Info ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col gap-6"
                    >
                        {/* Category + Stock status */}
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest">
                                {product.categoryName[lang === "en" ? "en" : "bn"]}
                            </span>
                            {product.inStock ? (
                                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                    </span>
                                    {lang === "en" ? "In Stock" : "স্টকে আছে"}
                                </div>
                            ) : (
                                <div className="text-red-500 text-sm font-semibold flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                                    {lang === "en" ? "Out of Stock" : "স্টক নেই"}
                                </div>
                            )}
                        </div>

                        {/* Product Name */}
                        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
                            {product.name[lang === "en" ? "en" : "bn"]}
                        </h1>



                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-emerald-100 via-teal-100 to-transparent dark:from-emerald-900/40 dark:via-teal-900/40" />

                        {/* Price Section */}
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-900/40">
                            <div className="flex items-baseline gap-3 mb-2">
                                <span className="text-4xl font-black text-gray-900 dark:text-white">
                                    ৳{discountedPrice.toLocaleString()}
                                </span>
                                {product.discount && (
                                    <>
                                        <span className="text-xl text-gray-400 dark:text-gray-500 line-through">
                                            ৳{product.price.toLocaleString()}
                                        </span>
                                        <span className="px-2.5 py-0.5 bg-red-500 text-white text-sm font-bold rounded-full">
                                            -{product.discount}%
                                        </span>
                                    </>
                                )}
                            </div>
                            {savings > 0 && (
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 fill-emerald-600" />
                                    <p className="text-emerald-700 dark:text-emerald-400 font-semibold text-sm">
                                        {lang === "en" ? `You save ৳${savings.toLocaleString()} on this item!` : `এই পণ্যে ৳${savings.toLocaleString()} সাশ্রয় হচ্ছে!`}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Short Description */}
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[15px]">
                            {product.shortDesc[lang === "en" ? "en" : "bn"]}
                        </p>

                        {/* Key Highlights — top 3 features */}
                        <div className="grid grid-cols-1 gap-2.5">
                            {product.features.slice(0, 3).map((f, i) => (
                                <div key={i} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl px-4 py-3">
                                    <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-200 dark:bg-emerald-900/60 flex items-center justify-center flex-shrink-0">
                                        <Check size={11} className="text-emerald-700 dark:text-emerald-400" />
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                                        {f[lang === "en" ? "en" : "bn"]}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gradient-to-r from-emerald-100 via-teal-100 to-transparent dark:from-emerald-900/40 dark:via-teal-900/40" />

                        {/* CTA ── ref for sticky bar */}
                        <div ref={ctaRef} className="space-y-4">

                            {/* WhatsApp Primary CTA */}
                            <motion.button
                                onClick={handleWhatsAppOrder}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                className="w-full py-5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-2xl shadow-green-400/40 transition-all duration-300"
                            >
                                <WhatsappIcon />
                                {lang === "en" ? "Order via WhatsApp" : "WhatsApp এ অর্ডার করুন"}
                            </motion.button>

                            {/* Phone number subtle hint */}
                            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                                📞 {lang === "en" ? "Call or message us:" : "কল বা মেসেজ করুন:"}
                                <span className="ml-1 font-semibold text-gray-700 dark:text-gray-300">+880 1715-599599</span>
                            </p>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                            {[
                                { icon: Shield, en: "Quality Assured", bn: "মান নিশ্চিত", sub_en: "100% Genuine", sub_bn: "১০০% আসল" },
                                { icon: Truck, en: "Free Delivery", bn: "বিনামূল্যে ডেলিভারি", sub_en: "2-5 business days", sub_bn: "২-৫ কার্যদিবস" },
                                { icon: RotateCcw, en: "Easy Returns", bn: "সহজ রিটার্ন", sub_en: "7-day return policy", sub_bn: "৭ দিনের নীতি" },
                                { icon: Phone, en: "24/7 Support", bn: "২৪/৭ সাপোর্ট", sub_en: "Always here for you", sub_bn: "সর্বদা পাশে আছি" },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 bg-gray-50 dark:bg-gray-800/60 rounded-2xl px-3 py-4 text-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                        <item.icon size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{lang === "en" ? item.en : item.bn}</p>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{lang === "en" ? item.sub_en : item.sub_bn}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* ── Tab Section ─────────────────────────────────────── */}
                <div className="mt-20">
                    <div className="border-b-2 border-gray-100 dark:border-gray-800 mb-8">
                        <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                            {tabs.map(tab => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`relative flex-shrink-0 px-6 py-4 text-sm font-bold transition-colors whitespace-nowrap ${activeTab === tab.id ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}>
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div layoutId="tab-underline"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {/* OVERVIEW TAB */}
                        {activeTab === "overview" && (
                            <motion.div key="overview"
                                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                                className="grid md:grid-cols-2 gap-10">
                                <div>
                                    {/* Story Card */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="relative bg-gradient-to-br from-emerald-50 via-white to-teal-50/60 dark:from-gray-800 dark:via-gray-900 dark:to-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 p-6 shadow-sm overflow-hidden"
                                    >
                                        {/* Decorative background circle */}
                                        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-emerald-100/60 dark:bg-emerald-900/20 blur-2xl pointer-events-none" />

                                        {/* Card Header */}
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                                                    {lang === "en" ? "About This Product" : "এই পণ্য সম্পর্কে"}
                                                </h3>
                                                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                                                    {lang === "en" ? "Read before you decide" : "কেনার আগে একবার পড়ুন"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="h-px bg-gradient-to-r from-emerald-200 to-transparent dark:from-emerald-800/50 mb-5" />

                                        {/* Description text with styled first letter */}
                                        <div className="relative">
                                            <p className="text-gray-700 dark:text-gray-300 leading-[1.9] text-[15px] first-letter:text-3xl first-letter:font-black first-letter:text-emerald-600 dark:first-letter:text-emerald-400 first-letter:float-left first-letter:mr-2 first-letter:leading-none first-letter:mt-1">
                                                {product.description[lang === "en" ? "en" : "bn"]}
                                            </p>
                                        </div>

                                        {/* Bottom tags */}
                                        {product.tags && product.tags.length > 0 && (
                                            <div className="mt-5 pt-4 border-t border-emerald-100 dark:border-emerald-900/30 flex flex-wrap gap-2">
                                                {product.tags.map((tag, i) => (
                                                    <span key={i} className="flex items-center gap-1 px-3 py-1 rounded-full bg-white dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 text-xs font-medium border border-emerald-200 dark:border-emerald-800 shadow-sm">
                                                        <Tag size={10} />{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                        {lang === "en" ? "Key Features" : "মূল বৈশিষ্ট্যসমূহ"}
                                    </h3>
                                    <div className="space-y-3">
                                        {product.features.map((f, i) => (
                                            <motion.div key={i}
                                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                                                className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors">
                                                <div className="mt-0.5 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                                                    <Check size={13} className="text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                                    {f[lang === "en" ? "en" : "bn"]}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* SPECS TAB */}
                        {activeTab === "specs" && (
                            <motion.div key="specs"
                                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                                className="max-w-2xl">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <Info size={20} className="text-emerald-600" />
                                    {lang === "en" ? "Technical Specifications" : "প্রযুক্তিগত স্পেসিফিকেশন"}
                                </h3>
                                {product.specs && product.specs.length > 0 ? (
                                    <div className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                                        {product.specs.map((spec, i) => (
                                            <div key={i} className={`flex group transition-colors ${i % 2 === 0 ? "bg-gray-50 dark:bg-gray-900/50" : "bg-white dark:bg-gray-900"} hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10`}>
                                                <div className="w-2/5 px-6 py-4 font-semibold text-sm text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-800">
                                                    {spec.label[lang === "en" ? "en" : "bn"]}
                                                </div>
                                                <div className="w-3/5 px-6 py-4 font-bold text-sm text-gray-800 dark:text-gray-200">
                                                    {spec.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 dark:text-gray-400 py-4">
                                        {lang === "en" ? "Specifications not available for this product." : "এই পণ্যের স্পেসিফিকেশন পাওয়া যায়নি।"}
                                    </p>
                                )}
                            </motion.div>
                        )}


                    </AnimatePresence>
                </div>

                {/* ── Related Products ─────────────────────────────────── */}
                {relatedProducts.length > 0 && (
                    <div className="mt-24 pt-10 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {lang === "en" ? "You May Also Like" : "আপনার পছন্দ হতে পারে"}
                            </h2>
                            <Link href="/products" className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1">
                                {lang === "en" ? "View All" : "সব দেখুন"} <ChevronRight size={15} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {relatedProducts.map((p, i) => <RelatedCard key={p.id} product={p} lang={lang} idx={i} />)}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Mobile Sticky Bottom Bar ─────────────────────────────── */}
            <AnimatePresence>
                {showStickyBar && (
                    <motion.div
                        initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
                        transition={{ type: "spring", damping: 28 }}
                        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 px-4 py-3 shadow-2xl lg:hidden"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{product.name[lang === "en" ? "en" : "bn"]}</p>
                                <p className="font-black text-gray-900 dark:text-white text-base">৳{discountedPrice.toLocaleString()}</p>
                            </div>
                            <button onClick={handleWhatsAppOrder}
                                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-sm shadow-lg shadow-green-400/30 hover:from-green-600 hover:to-emerald-600 transition-all">
                                <WhatsappIcon />
                                {lang === "en" ? "Order Now" : "অর্ডার করুন"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── Related Product Card ──────────────────────────────────────────────
function RelatedCard({ product, lang, idx }: { product: Product; lang: string; idx: number }) {
    const discountedPrice = product.discount ? Math.round(product.price * (1 - product.discount / 100)) : product.price;
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
            <Link href={`/products/${product.id}`}
                className="group block bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1.5 transition-all duration-300">
                <div className="bg-gradient-to-br from-slate-50 to-emerald-50/20 dark:from-gray-800 dark:to-gray-900 h-40 flex items-center justify-center p-4 relative overflow-hidden">
                    {product.discount && (
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-red-500 text-white text-[10px] font-bold">-{product.discount}%</span>
                    )}
                    <img src={product.image} alt={product.name.en} className="h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-3">
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                        {product.categoryName[lang === "en" ? "en" : "bn"]}
                    </p>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-xs leading-snug line-clamp-2 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {product.name[lang === "en" ? "en" : "bn"]}
                    </h4>
                    <div className="flex items-center gap-1 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={11} className={i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                        ))}
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-black text-gray-900 dark:text-white text-sm">৳{discountedPrice.toLocaleString()}</span>
                        {product.discount && <span className="text-[10px] text-red-500 font-bold">৳{product.price.toLocaleString()}</span>}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
