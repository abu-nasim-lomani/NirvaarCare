"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface Props {
    isOpen: boolean;
    lang: string;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, lang, onClose }: Props) {
    const { cart, cartTotal, cartCount, updateQty } = useCart();
    const router = useRouter();



    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                    <ShoppingBag size={18} />
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-900 dark:text-white text-sm">
                                        {lang === "en" ? "Your Cart" : "আপনার কার্ট"}
                                    </h2>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {cartCount} {lang === "en" ? `item${cartCount !== 1 ? "s" : ""}` : "টি পণ্য"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-9 h-9 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-5">
                                        <Package size={36} className="text-gray-300 dark:text-gray-600" />
                                    </div>
                                    <p className="font-semibold text-gray-700 dark:text-gray-300 text-lg mb-2">
                                        {lang === "en" ? "Your cart is empty" : "কার্ট খালি আছে"}
                                    </p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
                                        {lang === "en" ? "Add health products to get started" : "শুরু করতে স্বাস্থ্য পণ্য যোগ করুন"}
                                    </p>
                                    <button
                                        onClick={onClose}
                                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
                                    >
                                        {lang === "en" ? "Browse Products" : "পণ্য দেখুন"}
                                    </button>
                                </div>
                            ) : (
                                <AnimatePresence initial={false}>
                                    {cart.map((item) => {
                                        const discountedPrice = item.discount
                                            ? Math.round(item.price * (1 - item.discount / 100))
                                            : item.price;

                                        return (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20, height: 0 }}
                                                className="flex gap-3 bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-3"
                                            >
                                                {/* Image */}
                                                <div className="w-20 h-20 flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-700">
                                                    <img src={item.image} alt={item.name.en} className="w-full h-full object-contain p-2" />
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mb-0.5">
                                                        {item.categoryName[lang === "en" ? "en" : "bn"]}
                                                    </p>
                                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-xs leading-snug line-clamp-2 mb-2">
                                                        {item.name[lang === "en" ? "en" : "bn"]}
                                                    </h4>
                                                    <div className="flex items-center justify-between">
                                                        {/* Qty controls */}
                                                        <div className="flex items-center gap-1 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                                            <button
                                                                onClick={() => updateQty(item.id, -1)}
                                                                className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
                                                            >
                                                                {item.quantity === 1 ? <Trash2 size={13} /> : <Minus size={13} />}
                                                            </button>
                                                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200 min-w-[20px] text-center">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQty(item.id, 1)}
                                                                className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-emerald-600 transition-colors"
                                                            >
                                                                <Plus size={13} />
                                                            </button>
                                                        </div>
                                                        {/* Price */}
                                                        <div className="text-right">
                                                            <p className="font-bold text-gray-900 dark:text-white text-sm">
                                                                ৳{(discountedPrice * item.quantity).toLocaleString()}
                                                            </p>
                                                            {item.quantity > 1 && (
                                                                <p className="text-[11px] text-gray-400">
                                                                    ৳{discountedPrice.toLocaleString()} {lang === "en" ? "each" : "প্রতিটি"}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Footer / Checkout */}
                        {cart.length > 0 && (
                            <div className="flex-shrink-0 px-5 pb-6 pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                                {/* Order Summary */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                        <span>{lang === "en" ? "Subtotal" : "সাবটোটাল"}</span>
                                        <span>৳{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                        <span>{lang === "en" ? "Delivery" : "ডেলিভারি"}</span>
                                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                            {lang === "en" ? "Free" : "বিনামূল্যে"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base pt-2 border-t border-gray-100 dark:border-gray-800">
                                        <span>{lang === "en" ? "Total" : "মোট"}</span>
                                        <span>৳{cartTotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* WhatsApp order option - Now Primary Checkout */}
                                <button
                                    onClick={() => {
                                        const itemList = cart.map(i => `• ${i.name.en} (x${i.quantity})`).join("\n");
                                        const msg = encodeURIComponent(
                                            `Hello NirvaarCare! I'd like to order:\n\n${itemList}\n\nTotal: ৳${cartTotal.toLocaleString()}\n\nPlease confirm my order.`
                                        );
                                        window.open(`https://wa.me/8801715599599?text=${msg}`, "_blank");
                                    }}
                                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    {lang === "en" ? "Order via WhatsApp" : "WhatsApp এ অর্ডার করুন"}
                                </button>

                                <p className="text-center text-xs text-gray-400 dark:text-gray-500">
                                    {lang === "en" ? "📞 Or call: 01715-599599" : "📞 অথবা কল করুন: ০১৭১৫-৫৯৯৫৯৯"}
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
