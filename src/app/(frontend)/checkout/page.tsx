"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ShoppingBag, ChevronRight, Truck, Shield,
    CheckCircle2, Phone, MapPin, User, Mail,
    CreditCard, Banknote, Smartphone, ArrowLeft,
    Package, Minus, Plus, Trash2, Tag, ChevronDown, ChevronUp
} from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";

type PaymentMethod = "cod" | "bkash" | "nagad";

const districtOptions = [
    "Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna",
    "Barisal", "Rangpur", "Mymensingh", "Comilla", "Gazipur",
    "Narayanganj", "Narsingdi", "Cumilla", "Feni", "Noakhali"
];

export default function CheckoutPage() {
    const { lang } = useLang();
    const { cart, cartTotal, cartCount, updateQty, clearCart } = useCart();
    const router = useRouter();

    // Form state
    const [form, setForm] = useState({
        name: "", phone: "", email: "",
        address: "", district: "", note: ""
    });
    const [errors, setErrors] = useState<Partial<typeof form>>({});
    const [payment, setPayment] = useState<PaymentMethod>("cod");
    const [agreed, setAgreed] = useState(false);
    const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);
    const [placing, setPlacing] = useState(false);
    const [ordered, setOrdered] = useState<string | null>(null);

    const deliveryCharge = 0;
    const finalTotal = cartTotal + deliveryCharge;

    const updateField = (key: keyof typeof form, val: string) => {
        setForm(prev => ({ ...prev, [key]: val }));
        if (errors[key]) setErrors(prev => ({ ...prev, [key]: "" }));
    };

    const validate = () => {
        const e: Partial<typeof form> = {};
        if (!form.name.trim()) e.name = lang === "en" ? "Name is required" : "নাম প্রয়োজন";
        if (!form.phone.trim() || !/^(\+88)?01[3-9]\d{8}$/.test(form.phone.replace(/\s/g, "")))
            e.phone = lang === "en" ? "Enter a valid BD phone number" : "সঠিক ফোন নম্বর দিন";
        if (!form.address.trim()) e.address = lang === "en" ? "Address is required" : "ঠিকানা প্রয়োজন";
        if (!form.district) e.district = lang === "en" ? "Select your district" : "জেলা নির্বাচন করুন";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return;
        if (!validate() || !agreed) return;
        setPlacing(true);
        // Simulate processing
        await new Promise(r => setTimeout(r, 1800));
        const orderId = "NC" + Date.now().toString().slice(-7);
        clearCart();
        setOrdered(orderId);
        setPlacing(false);
    };

    const WhatsappIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    );

    // ── Order Success ─────────────────────────────────────────────
    if (ordered) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center px-4 pt-20">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="max-w-md w-full text-center"
                >
                    {/* Success animation */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", damping: 15 }}
                        className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-400/40"
                    >
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}>
                            <CheckCircle2 size={56} className="text-white" strokeWidth={2.5} />
                        </motion.div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-sm font-semibold mb-4">
                            🎉 {lang === "en" ? "Order Confirmed!" : "অর্ডার নিশ্চিত হয়েছে!"}
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
                            {lang === "en" ? "Thank You!" : "ধন্যবাদ!"}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-2">
                            {lang === "en" ? "Your order has been placed successfully." : "আপনার অর্ডার সফলভাবে দেওয়া হয়েছে।"}
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl px-6 py-4 mb-8">
                            <p className="text-xs text-gray-400 mb-1">{lang === "en" ? "Order ID" : "অর্ডার আইডি"}</p>
                            <p className="text-2xl font-black tracking-wider text-emerald-600 dark:text-emerald-400">#{ordered}</p>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-5 mb-8 text-left space-y-3 border border-emerald-100 dark:border-emerald-900/40">
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <Phone size={16} className="text-emerald-600 flex-shrink-0" />
                                <span>{lang === "en" ? "Our team will call you shortly to confirm delivery." : "আমাদের টিম শীঘ্রই ডেলিভারি নিশ্চিত করতে কল করবে।"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <Truck size={16} className="text-emerald-600 flex-shrink-0" />
                                <span>{lang === "en" ? "Expected delivery: 2-5 business days" : "প্রত্যাশিত ডেলিভারি: ২-৫ কার্যদিবস"}</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => {
                                    const msg = encodeURIComponent(`Hello NirvaarCare! My Order ID is #${ordered} (${form.name}, ${form.phone}). Please confirm delivery. Thank you!`);
                                    window.open(`https://wa.me/8801715599599?text=${msg}`, "_blank");
                                }}
                                className="flex-1 py-3.5 rounded-2xl border border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-green-100 transition-colors"
                            >
                                <WhatsappIcon />
                                {lang === "en" ? "Confirm on WhatsApp" : "WhatsApp এ নিশ্চিত করুন"}
                            </button>
                            <Link href="/products"
                                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
                                <ShoppingBag size={16} />
                                {lang === "en" ? "Continue Shopping" : "আরও কেনাকাটা করুন"}
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    // ── Empty Cart ────────────────────────────────────────────────
    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center px-4 pt-20">
                <div className="max-w-sm w-full text-center">
                    <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-6">
                        <Package size={40} className="text-gray-300 dark:text-gray-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                        {lang === "en" ? "Your cart is empty" : "কার্ট খালি আছে"}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        {lang === "en" ? "Add products before checking out." : "চেকআউটের আগে পণ্য যোগ করুন।"}
                    </p>
                    <Link href="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors">
                        <ArrowLeft size={18} />
                        {lang === "en" ? "Browse Products" : "পণ্য দেখুন"}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pt-20 pb-12">
            {/* Breadcrumb */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <nav className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <Link href="/" className="hover:text-emerald-600 transition-colors">{lang === "en" ? "Home" : "হোম"}</Link>
                        <ChevronRight size={13} className="text-gray-300" />
                        <Link href="/products" className="hover:text-emerald-600 transition-colors">{lang === "en" ? "Health Store" : "হেলথ স্টোর"}</Link>
                        <ChevronRight size={13} className="text-gray-300" />
                        <span className="text-gray-700 dark:text-gray-300 font-semibold">{lang === "en" ? "Checkout" : "চেকআউট"}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600">
                        <ShoppingBag size={22} />
                    </div>
                    {lang === "en" ? "Checkout" : "চেকআউট"}
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                    {/* ── LEFT: Form ──────────────────────────────────── */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* Mobile: Collapsible order summary */}
                        <div className="lg:hidden bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                            <button onClick={() => setOrderSummaryOpen(!orderSummaryOpen)}
                                className="w-full flex items-center justify-between px-5 py-4">
                                <div className="flex items-center gap-2">
                                    <ShoppingBag size={18} className="text-emerald-600" />
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                                        {lang === "en" ? `Order summary (${cartCount} items)` : `অর্ডার সারসংক্ষেপ (${cartCount}টি পণ্য)`}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-emerald-600">৳{finalTotal.toLocaleString()}</span>
                                    {orderSummaryOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                                </div>
                            </button>
                            <AnimatePresence>
                                {orderSummaryOpen && (
                                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t border-gray-100 dark:border-gray-800">
                                        <MiniOrderItems cart={cart} lang={lang} updateQty={updateQty} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Section 1: Contact Info */}
                        <FormSection title={lang === "en" ? "Contact Information" : "যোগাযোগের তথ্য"} icon={User}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField label={lang === "en" ? "Full Name *" : "পুরো নাম *"} error={errors.name}>
                                    <input type="text" value={form.name} onChange={e => updateField("name", e.target.value)}
                                        placeholder={lang === "en" ? "e.g. Karim Uddin" : "যেমন: করিম উদ্দিন"}
                                        className={fieldClass(!!errors.name)} />
                                </FormField>
                                <FormField label={lang === "en" ? "Phone Number *" : "ফোন নম্বর *"} error={errors.phone}>
                                    <input type="tel" value={form.phone} onChange={e => updateField("phone", e.target.value)}
                                        placeholder="01XXXXXXXXX"
                                        className={fieldClass(!!errors.phone)} />
                                </FormField>
                            </div>
                            <FormField label={lang === "en" ? "Email (Optional)" : "ইমেইল (ঐচ্ছিক)"}>
                                <input type="email" value={form.email} onChange={e => updateField("email", e.target.value)}
                                    placeholder={lang === "en" ? "you@example.com" : "আপনার@ইমেইল.com"}
                                    className={fieldClass(false)} />
                            </FormField>
                        </FormSection>

                        {/* Section 2: Delivery Address */}
                        <FormSection title={lang === "en" ? "Delivery Address" : "ডেলিভারি ঠিকানা"} icon={MapPin}>
                            <FormField label={lang === "en" ? "Full Address *" : "পুরো ঠিকানা *"} error={errors.address}>
                                <textarea rows={2} value={form.address} onChange={e => updateField("address", e.target.value)}
                                    placeholder={lang === "en" ? "House no, Road, Area, City…" : "বাড়ি নং, রোড, এলাকা, শহর…"}
                                    className={`${fieldClass(!!errors.address)} resize-none`} />
                            </FormField>
                            <FormField label={lang === "en" ? "District *" : "জেলা *"} error={errors.district}>
                                <select value={form.district} onChange={e => updateField("district", e.target.value)}
                                    className={fieldClass(!!errors.district)}>
                                    <option value="">{lang === "en" ? "Select district…" : "জেলা নির্বাচন করুন…"}</option>
                                    {districtOptions.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </FormField>
                            <FormField label={lang === "en" ? "Special Note (Optional)" : "বিশেষ নোট (ঐচ্ছিক)"}>
                                <textarea rows={2} value={form.note} onChange={e => updateField("note", e.target.value)}
                                    placeholder={lang === "en" ? "Any delivery instructions…" : "ডেলিভারি নির্দেশনা…"}
                                    className={`${fieldClass(false)} resize-none`} />
                            </FormField>
                        </FormSection>

                        {/* Section 3: Payment Method */}
                        <FormSection title={lang === "en" ? "Payment Method" : "পেমেন্ট পদ্ধতি"} icon={CreditCard}>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {([
                                    { id: "cod", Icon: Banknote, label_en: "Cash on Delivery", label_bn: "ক্যাশ অন ডেলিভারি", sub_en: "Pay when delivered", sub_bn: "ডেলিভারিতে পেমেন্ট" },
                                    { id: "bkash", Icon: Smartphone, label_en: "bKash", label_bn: "বিকাশ", sub_en: "Mobile banking", sub_bn: "মোবাইল ব্যাংকিং" },
                                    { id: "nagad", Icon: Smartphone, label_en: "Nagad", label_bn: "নগদ", sub_en: "Mobile banking", sub_bn: "মোবাইল ব্যাংকিং" },
                                ] as const).map(({ id, Icon, label_en, label_bn, sub_en, sub_bn }) => (
                                    <button key={id} onClick={() => setPayment(id)}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${payment === id ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md shadow-emerald-100 dark:shadow-none" : "border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700"}`}>
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${payment === id ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>
                                            <Icon size={20} />
                                        </div>
                                        <div className="text-center">
                                            <p className={`text-sm font-bold ${payment === id ? "text-emerald-700 dark:text-emerald-400" : "text-gray-700 dark:text-gray-300"}`}>
                                                {lang === "en" ? label_en : label_bn}
                                            </p>
                                            <p className="text-[11px] text-gray-400">{lang === "en" ? sub_en : sub_bn}</p>
                                        </div>
                                        {payment === id && (
                                            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                                                <CheckCircle2 size={14} className="text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {payment === "bkash" && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                                    className="mt-3 p-4 bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-xl text-sm text-pink-700 dark:text-pink-400">
                                    📲 {lang === "en" ? "Send payment to bKash number: 01715-599599 (Personal). Then enter the transaction ID below." : "bKash নম্বরে পেমেন্ট পাঠান: ০১৭১৫-৫৯৯৫৯৯ (Personal)। তারপর ট্রানজেকশন আইডি লিখুন।"}
                                </motion.div>
                            )}
                            {payment === "nagad" && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                                    className="mt-3 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl text-sm text-orange-700 dark:text-orange-400">
                                    📲 {lang === "en" ? "Send payment to Nagad number: 01715-599599. Then enter the transaction ID below." : "Nagad নম্বরে পেমেন্ট পাঠান: ০১৭১৫-৫৯৯৫৯৯। তারপর ট্রানজেকশন আইডি লিখুন।"}
                                </motion.div>
                            )}
                        </FormSection>

                        {/* Terms & Place Order */}
                        <div className="space-y-4">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${agreed ? "bg-emerald-600 border-emerald-600" : "border-gray-300 dark:border-gray-600 group-hover:border-emerald-400"}`}
                                    onClick={() => setAgreed(!agreed)}>
                                    {agreed && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 size={13} className="text-white" /></motion.div>}
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {lang === "en"
                                        ? "I agree to the Terms & Conditions and understand that NirvaarCare will contact me to confirm the order."
                                        : "আমি শর্তাবলী মেনে নিচ্ছি এবং বুঝতে পারছি যে নির্ভার কেয়ার অর্ডার নিশ্চিত করতে আমার সাথে যোগাযোগ করবে।"}
                                </span>
                            </label>

                            <motion.button
                                whileHover={{ scale: (!agreed || placing || cart.length === 0) ? 1 : 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handlePlaceOrder}
                                disabled={!agreed || placing || cart.length === 0}
                                className={`w-full py-5 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-xl ${(!agreed || cart.length === 0) ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed shadow-none" : placing ? "bg-emerald-400 text-white cursor-wait" : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/50 hover:-translate-y-0.5"}`}
                            >
                                {placing ? (
                                    <>
                                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                                        {lang === "en" ? "Placing Order…" : "অর্ডার করা হচ্ছে…"}
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={22} />
                                        {lang === "en" ? `Place Order — ৳${finalTotal.toLocaleString()}` : `অর্ডার করুন — ৳${finalTotal.toLocaleString()}`}
                                    </>
                                )}
                            </motion.button>

                            <div className="flex items-center justify-center gap-4 pt-1">
                                {[Shield, Truck, Tag].map((Icon, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-xs text-gray-400">
                                        <Icon size={13} className="text-emerald-500" />
                                        <span>{[
                                            lang === "en" ? "Secure" : "নিরাপদ",
                                            lang === "en" ? "Free Delivery" : "বিনামূল্যে",
                                            lang === "en" ? "Best Price" : "সেরা দাম"
                                        ][i]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: Order Summary (sticky, desktop only) ─── */}
                    <div className="hidden lg:block lg:col-span-2">
                        <div className="sticky top-28 space-y-4">
                            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
                                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                                    <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <ShoppingBag size={18} className="text-emerald-600" />
                                        {lang === "en" ? `Order Summary (${cartCount})` : `অর্ডার (${cartCount}টি)`}
                                    </h2>
                                </div>
                                <MiniOrderItems cart={cart} lang={lang} updateQty={updateQty} />
                                <div className="px-6 py-5 space-y-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900">
                                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                        <span>{lang === "en" ? "Subtotal" : "সাবটোটাল"}</span>
                                        <span>৳{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-400">{lang === "en" ? "Delivery" : "ডেলিভারি"}</span>
                                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{lang === "en" ? "Free" : "বিনামূল্যে"}</span>
                                    </div>
                                    <div className="flex justify-between font-extrabold text-gray-900 dark:text-white text-lg pt-3 border-t border-gray-200 dark:border-gray-800">
                                        <span>{lang === "en" ? "Total" : "মোট"}</span>
                                        <span className="text-emerald-600 dark:text-emerald-400">৳{finalTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Trust block */}
                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl p-5 space-y-3">
                                {[
                                    { icon: Shield, en: "100% Quality Guaranteed", bn: "১০০% মান নিশ্চিত" },
                                    { icon: Truck, en: "Free delivery nationwide", bn: "সারাদেশে বিনামূল্যে ডেলিভারি" },
                                    { icon: Phone, en: "24/7 Customer Support", bn: "২৪/৭ কাস্টমার সাপোর্ট" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm text-emerald-700 dark:text-emerald-400">
                                        <item.icon size={15} className="flex-shrink-0" />
                                        <span className="font-medium">{lang === "en" ? item.en : item.bn}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Need help? */}
                            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 text-center">
                                <p className="text-xs text-gray-400 mb-3">{lang === "en" ? "Need help with your order?" : "অর্ডারে সাহায্য দরকার?"}</p>
                                <a href="https://wa.me/8801715599599" target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-semibold hover:bg-green-100 transition-colors">
                                    <WhatsappIcon />
                                    {lang === "en" ? "Chat with us" : "আমাদের সাথে চ্যাট করুন"}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Shared helpers ─────────────────────────────────────────────────────

function MiniOrderItems({ cart, lang, updateQty }: { cart: ReturnType<typeof useCart>["cart"]; lang: string; updateQty: (id: string, delta: number) => void }) {
    return (
        <div className="px-5 py-4 space-y-3 max-h-80 overflow-y-auto">
            {cart.map(item => {
                const price = item.discount ? Math.round(item.price * (1 - item.discount / 100)) : item.price;
                return (
                    <div key={item.id} className="flex gap-3 items-center">
                        <div className="w-14 h-14 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                            <img src={item.image} alt={item.name.en} className="w-full h-full object-contain p-1.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">
                                {item.name[lang === "en" ? "en" : "bn"]}
                            </p>
                            <p className="text-[11px] text-gray-400">৳{price.toLocaleString()} × {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                            <button onClick={() => updateQty(item.id, -1)}
                                className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                {item.quantity === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                            </button>
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200 w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQty(item.id, 1)}
                                className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                                <Plus size={12} />
                            </button>
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white flex-shrink-0 w-16 text-right">
                            ৳{(price * item.quantity).toLocaleString()}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

function FormSection({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ size?: number; className?: string }>; children: React.ReactNode }) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Icon size={17} />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm">{title}</h3>
            </div>
            <div className="p-6 space-y-4">{children}</div>
        </div>
    );
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
            {children}
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>
    );
}

function fieldClass(hasError: boolean) {
    return `w-full px-4 py-3 rounded-xl border-2 ${hasError ? "border-red-400 focus:border-red-400" : "border-gray-200 dark:border-gray-700 focus:border-emerald-500"} bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 ${hasError ? "focus:ring-red-400/30" : "focus:ring-emerald-400/30"} transition-all text-sm`;
}
