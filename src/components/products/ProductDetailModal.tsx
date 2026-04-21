"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Heart, Star, Check, Shield, Truck, Package, ChevronRight } from "lucide-react";
import type { Product } from "@/constants/products";

interface Props {
    product: Product | null;
    lang: string;
    inCart: boolean;
    inWishlist: boolean;
    onClose: () => void;
    onAddToCart: (p: Product) => void;
    onWishlist: (id: string) => void;
}

export default function ProductDetailModal({ product, lang, inCart, inWishlist, onClose, onAddToCart, onWishlist }: Props) {
    if (!product) return null;

    const discountedPrice = product.discount
        ? Math.round(product.price * (1 - product.discount / 100))
        : product.price;

    const savings = product.discount
        ? product.price - discountedPrice
        : 0;

    return (
        <AnimatePresence>
            {product && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-x-4 inset-y-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-3xl sm:max-h-[90vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <span>{lang === "en" ? "Health Store" : "হেলথ স্টোর"}</span>
                                <ChevronRight size={14} />
                                <span>{product.categoryName[lang === "en" ? "en" : "bn"]}</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Scrollable body */}
                        <div className="overflow-y-auto flex-1">
                            <div className="grid md:grid-cols-2 gap-0">
                                {/* Left: Image */}
                                <div className="bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-8 min-h-64 relative">
                                    <img
                                        src={product.image}
                                        alt={product.name.en}
                                        className="max-h-64 object-contain drop-shadow-2xl"
                                    />
                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        {product.isNew && (
                                            <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold">
                                                {lang === "en" ? "NEW" : "নতুন"}
                                            </span>
                                        )}
                                        {product.discount && (
                                            <span className="px-2.5 py-1 rounded-full bg-red-500 text-white text-xs font-bold">
                                                -{product.discount}% {lang === "en" ? "OFF" : "ছাড়"}
                                            </span>
                                        )}
                                    </div>
                                    {/* Wishlist */}
                                    <button
                                        onClick={() => onWishlist(product.id)}
                                        className={`absolute top-4 right-4 w-10 h-10 rounded-full shadow-md flex items-center justify-center transition-all ${inWishlist ? "bg-red-500 text-white" : "bg-white dark:bg-gray-800 text-gray-400 hover:text-red-500"}`}
                                    >
                                        <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
                                    </button>
                                </div>

                                {/* Right: Details */}
                                <div className="p-6 space-y-5">
                                    <div>
                                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">
                                            {product.categoryName[lang === "en" ? "en" : "bn"]}
                                        </p>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-snug mb-3">
                                            {product.name[lang === "en" ? "en" : "bn"]}
                                        </h2>

                                        {/* Rating */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="flex">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} size={14}
                                                        className={i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-300 dark:text-gray-600"}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{product.rating}</span>
                                            <span className="text-sm text-gray-400">({product.reviewCount} {lang === "en" ? "reviews" : "রিভিউ"})</span>
                                        </div>

                                        {/* Price */}
                                        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 mb-4">
                                            <div className="flex items-baseline gap-3">
                                                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                                    ৳{discountedPrice.toLocaleString()}
                                                </span>
                                                {product.discount && (
                                                    <span className="text-lg text-gray-400 line-through">৳{product.price.toLocaleString()}</span>
                                                )}
                                            </div>
                                            {savings > 0 && (
                                                <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium mt-1">
                                                    {lang === "en" ? `You save ৳${savings.toLocaleString()}` : `৳${savings.toLocaleString()} সাশ্রয় হচ্ছে`}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Short Description */}
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                        {product.shortDesc[lang === "en" ? "en" : "bn"]}
                                    </p>

                                    {/* Key Features */}
                                    <div>
                                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-3">
                                            {lang === "en" ? "Key Features" : "মূল বৈশিষ্ট্য"}
                                        </h4>
                                        <ul className="space-y-2">
                                            {product.features.map((f, i) => (
                                                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400">
                                                    <div className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                                                        <Check size={11} className="text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                    {f[lang === "en" ? "en" : "bn"]}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Specs */}
                                    {product.specs && product.specs.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-3">
                                                {lang === "en" ? "Specifications" : "স্পেসিফিকেশন"}
                                            </h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {product.specs.map((spec, i) => (
                                                    <div key={i} className="bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                                                        <p className="text-[11px] text-gray-400 font-medium mb-0.5">
                                                            {spec.label[lang === "en" ? "en" : "bn"]}
                                                        </p>
                                                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{spec.value}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Trust indicators */}
                                    <div className="flex gap-3 flex-wrap">
                                        {[
                                            { icon: Shield, en: "Quality Assured", bn: "মান নিশ্চিত" },
                                            { icon: Truck, en: "Fast Delivery", bn: "দ্রুত ডেলিভারি" },
                                            { icon: Package, en: "Easy Returns", bn: "সহজ রিটার্ন" },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                                <item.icon size={13} className="text-emerald-500" />
                                                {lang === "en" ? item.en : item.bn}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Bottom: Full Description */}
                            <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-800 pt-5">
                                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                                    {lang === "en" ? "About this product" : "পণ্য সম্পর্কে"}
                                </h4>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                    {product.description[lang === "en" ? "en" : "bn"]}
                                </p>
                            </div>
                        </div>

                        {/* Sticky Footer CTA */}
                        <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                            <button
                                onClick={() => onWishlist(product.id)}
                                className={`px-4 py-3 rounded-xl border font-medium text-sm flex items-center gap-2 transition-all ${inWishlist
                                    ? "border-red-300 bg-red-50 dark:bg-red-900/20 text-red-500"
                                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-red-300 hover:text-red-500"}`}
                            >
                                <Heart size={16} fill={inWishlist ? "currentColor" : "none"} />
                                {lang === "en" ? "Wishlist" : "উইশলিস্ট"}
                            </button>
                            <button
                                onClick={() => { onAddToCart(product); onClose(); }}
                                disabled={!product.inStock}
                                className={`flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${!product.inStock
                                    ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                                    : inCart
                                        ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-400 text-emerald-700 dark:text-emerald-400"
                                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25"}`}
                            >
                                <ShoppingCart size={18} />
                                {!product.inStock
                                    ? (lang === "en" ? "Out of Stock" : "স্টক নেই")
                                    : inCart
                                        ? (lang === "en" ? "Added to Cart ✓" : "কার্টে যোগ হয়েছে ✓")
                                        : (lang === "en" ? "Add to Cart" : "কার্টে যোগ করুন")}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
