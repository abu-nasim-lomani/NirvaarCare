"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PhoneCall, ShieldAlert, Mail, User, MessageSquare, Send, CheckCircle, Phone } from "lucide-react";
import { emergencyCtaData } from "@/constants";
import { useLang } from "@/context/LanguageContext";

export default function EmergencyCTA({ data }: { data?: any }) {
    const { lang } = useLang();
    const content = data && Object.keys(data).length > 0 ? data : emergencyCtaData;

    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
    const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        // Simulate send — replace with real API call later
        await new Promise(r => setTimeout(r, 1200));
        setStatus("sent");
        setForm({ name: "", email: "", phone: "", message: "" });
        setTimeout(() => setStatus("idle"), 4000);
    };

    return (
        <section id="emergency" className="relative py-20 md:py-28 overflow-hidden bg-slate-50 dark:bg-gray-950">
            {/* Background subtle grid */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMEgwdjYwaDYwVjB6TTEgMWg1OHY1OEgxVjF6IiBmaWxsPSJyZ2JhKDAsMCwwLDAuMDIpIi8+PC9nPjwvc3ZnPg==')] dark:opacity-20 opacity-30 pointer-events-none" />

            {/* Glowing Orbs — light/dark adaptive */}
            <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-emerald-100/60 dark:bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-teal-100/50 dark:bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm font-semibold mb-5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        {lang === "en" ? "24/7 Support Available" : "২৪/৭ সহায়তা পাওয়া যায়"}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                        {lang === "en" ? content.title?.en : content.title?.bn}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-base leading-relaxed">
                        {lang === "en" ? content.description?.en : content.description?.bn}
                    </p>
                </motion.div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* LEFT: Email Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                        <div className="flex items-center gap-3 mb-7">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <Mail size={20} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="text-gray-900 dark:text-white font-bold text-lg leading-none">
                                    {lang === "en" ? (content.formTitle?.en || "Send Us a Message") : (content.formTitle?.bn || "আমাদের বার্তা পাঠান")}
                                </h3>
                                <p className="text-gray-400 dark:text-emerald-300/60 text-xs mt-1">
                                    {lang === "en" ? (content.formSubtitle?.en || "We'll get back to you shortly") : (content.formSubtitle?.bn || "আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব")}
                                </p>
                            </div>
                        </div>

                        {status === "sent" ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-16 text-center gap-4"
                            >
                                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                                    <CheckCircle size={32} className="text-emerald-400" />
                                </div>
                                <p className="text-gray-900 dark:text-white font-bold text-lg">
                                    {lang === "en" ? (content.successText?.en || "Message Sent!") : (content.successText?.bn || "বার্তা পাঠানো হয়েছে!")}
                                </p>
                                <p className="text-gray-500 dark:text-emerald-300/70 text-sm">
                                    {lang === "en" ? (content.successSubtext?.en || "Our team will contact you shortly.") : (content.successSubtext?.bn || "আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।")}
                                </p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Name + Phone Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/60 pointer-events-none" />
                                        <input
                                            type="text"
                                            required
                                            value={form.name}
                                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                            placeholder={lang === "en" ? "Your Name" : "আপনার নাম"}
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-emerald-400 dark:hover:border-emerald-500/40 focus:border-emerald-500 dark:focus:border-emerald-500/70 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 rounded-xl pl-9 pr-4 py-3 text-sm outline-none transition-all duration-200"
                                        />
                                    </div>
                                    <div className="relative">
                                        <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/60 pointer-events-none" />
                                        <input
                                            type="tel"
                                            value={form.phone}
                                            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                            placeholder={lang === "en" ? "Phone Number" : "ফোন নম্বর"}
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-emerald-400 dark:hover:border-emerald-500/40 focus:border-emerald-500 dark:focus:border-emerald-500/70 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 rounded-xl pl-9 pr-4 py-3 text-sm outline-none transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="relative">
                                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/60 pointer-events-none" />
                                    <input
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                        placeholder={lang === "en" ? "Email Address" : "ইমেইল ঠিকানা"}
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-emerald-400 dark:hover:border-emerald-500/40 focus:border-emerald-500 dark:focus:border-emerald-500/70 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 rounded-xl pl-9 pr-4 py-3 text-sm outline-none transition-all duration-200"
                                    />
                                </div>

                                {/* Message */}
                                <div className="relative">
                                    <MessageSquare size={15} className="absolute left-3.5 top-3.5 text-emerald-400/60 pointer-events-none" />
                                    <textarea
                                        required
                                        rows={4}
                                        value={form.message}
                                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                        placeholder={lang === "en" ? "How can we help you?" : "আমরা কীভাবে আপনাকে সাহায্য করতে পারি?"}
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-emerald-400 dark:hover:border-emerald-500/40 focus:border-emerald-500 dark:focus:border-emerald-500/70 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 rounded-xl pl-9 pr-4 pt-3 pb-3 text-sm outline-none transition-all duration-200 resize-none"
                                    />
                                </div>

                                {/* Submit */}
                                <motion.button
                                    type="submit"
                                    disabled={status === "sending"}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {status === "sending" ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Send size={17} />
                                    )}
                                    {status === "sending"
                                        ? (lang === "en" ? "Sending..." : "পাঠানো হচ্ছে...")
                                        : (lang === "en" ? (content.submitText?.en || "Send Message") : (content.submitText?.bn || "বার্তা পাঠান"))}
                                </motion.button>
                            </form>
                        )}
                    </motion.div>

                    {/* RIGHT: Emergency Call Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="flex flex-col gap-6"
                    >
                        {/* Main Emergency Card */}
                        <div className="flex-1 bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-600/20 dark:to-rose-900/20 border border-red-200 dark:border-red-500/20 rounded-3xl p-8 shadow-lg relative overflow-hidden">
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

                            <div className="relative inline-flex items-center justify-center mb-6">
                                <div className="absolute inset-0 bg-red-500/30 rounded-full blur-xl animate-pulse" />
                                <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 relative z-10 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                                    <ShieldAlert size={30} strokeWidth={1.5} />
                                </div>
                            </div>

                            <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-2">
                                {lang === "en" ? (content.emergencyTitle?.en || "Emergency Hotline") : (content.emergencyTitle?.bn || "জরুরি হটলাইন")}
                            </h3>
                            <p className="text-gray-600 dark:text-white/50 text-sm mb-6 leading-relaxed">
                                {lang === "en"
                                    ? (content.emergencyDesc?.en || "For urgent care needs, call us directly. Our team is available around the clock.")
                                    : (content.emergencyDesc?.bn || "জরুরি সেবার জন্য সরাসরি কল করুন। আমাদের টিম সবসময় প্রস্তুত।")}
                            </p>

                            <p className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
                                {content.phone || emergencyCtaData.phone}
                            </p>

                            <a
                                href={`tel:${content.phone || emergencyCtaData.phone}`}
                                className="group w-full flex items-center justify-center gap-3 bg-red-500 hover:bg-red-400 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:-translate-y-0.5"
                            >
                                <PhoneCall size={20} className="animate-pulse" />
                                {lang === "en" ? content.buttonText?.en : content.buttonText?.bn}
                            </a>
                        </div>

                        {/* 24/7 + Info Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-3 shadow-sm">
                                <span className="relative flex h-3 w-3 shrink-0">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                                </span>
                                <div>
                                    <p className="text-gray-900 dark:text-white font-bold text-sm">24/7</p>
                                    <p className="text-gray-400 dark:text-gray-500 text-xs">
                                        {lang === "en" ? (content.badge1?.en || "Always Available") : (content.badge1?.bn || "সর্বদা উপলব্ধ")}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-3 shadow-sm">
                                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                                    <Mail size={16} />
                                </div>
                                <div>
                                    <p className="text-gray-800 dark:text-white font-bold text-xs truncate">
                                        {content.supportEmail || "support@nirvaarcare.com"}
                                    </p>
                                    <p className="text-gray-400 dark:text-gray-500 text-xs">
                                        {lang === "en" ? (content.badge2?.en || "Email Support") : (content.badge2?.bn || "ইমেইল সাপোর্ট")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
