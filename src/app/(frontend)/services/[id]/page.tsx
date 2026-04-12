"use client";

import { use, useState, useRef, useEffect } from "react";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
    Activity, Stethoscope, Pill, Ambulance,
    ShoppingBag, HeartHandshake,
    CheckCircle2, PhoneCall, MessageCircle,
    Play, X, ChevronDown, Star, Shield,
    Clock, Users, Heart, ArrowRight,
    Home, Building2, Microscope, FlaskConical,
    FileText, Truck, Baby, Accessibility,
    BrainCircuit, HelpCircle,
    Zap, BadgeCheck, ThumbsUp,
} from "lucide-react";
import { servicesData, testimonialData } from "@/constants";
import { useLang } from "@/context/LanguageContext";
import { useSiteConfig } from "@/context/SiteConfigContext";
import BookingModal from "@/components/services/BookingModal";
import AuthModal from "@/components/auth/AuthModal";
import { createClient } from "@/lib/supabase/client";

// ── Icon map ────────────────────────────────────────────────────────────────
const iconMap: Record<string, React.FC<any>> = {
    Activity, Stethoscope, Pill, Ambulance, ShoppingBag, HeartHandshake,
};

// ── Trust stats ──────────────────────────────────────────────────────────────
const trustStats = [
    { icon: Users, bn: "৫০০+ পরিবার", en: "500+ Families" },
    { icon: Shield, bn: "১০০% ভেরিফাইড", en: "100% Verified" },
    { icon: Clock, bn: "২৪/৭ সহায়তা", en: "24/7 Support" },
    { icon: Heart, bn: "৫+ বছর", en: "5+ Years of Care" },
];

type ServiceItem = {
    id: number;
    icon: string;
    title: { bn: string; en: string };
    image: string;
    description: { bn: string; en: string };
    extended?: {
        videoUrl: string;
        tagline: { bn: string; en: string };
        benefits: { icon: string; bn: string; en: string }[];
        steps: { bn: string; en: string }[];
    };
};

// ── Accordion FAQ component ──────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden"
        >
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
            >
                <span className="font-semibold text-gray-900 dark:text-white text-sm leading-relaxed">{question}</span>
                <ChevronDown size={18} className={`text-emerald-500 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="answer"
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-5 pt-1 bg-gray-50 dark:bg-gray-900/60 border-t border-gray-100 dark:border-gray-800">
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{answer}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { lang } = useLang();
    const [videoOpen, setVideoOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const handleBookClick = async () => {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (data.user) {
            setIsBookingModalOpen(true);
        } else {
            setIsAuthModalOpen(true);
        }
    };

    // Auto-open BookingModal after Google OAuth redirect
    useEffect(() => {
        const supabase = createClient();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN" && session) {
                const intentUrl = localStorage.getItem("booking_intent_url");
                if (intentUrl && window.location.pathname === intentUrl) {
                    localStorage.removeItem("booking_intent_url");
                    setIsAuthModalOpen(false);
                    setIsBookingModalOpen(true);
                }
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    const { sections, isLoading } = useSiteConfig();
    const servicesSection = sections.find(s => s.component_id === "ServicesGrid");
    // Fall back to local constants if the DB section is missing OR if content_data has no valid items
    const cmsItems = servicesSection?.content_data?.items;
    const cmsServicesData = (cmsItems && cmsItems.length > 0)
        ? servicesSection!.content_data
        : servicesData;

    const service = cmsServicesData?.items?.find((s: any) => String(s.id) === String(id));

    // In case the DB was saved before we added extended properties, fallback to constants
    const defaultVariant = servicesData.items.find((s: any) => String(s.id) === String(id));
    const extended = service?.extended || defaultVariant?.extended || { steps: [], benefits: [], tagline: { en: '', bn: '' } };

    // ── CMS data for Service 1 deep-dive sections ─────────────────────────────
    const diagnosticSection = sections.find(s => s.component_id === "DiagnosticServicePage");
    const d1 = diagnosticSection?.content_data || null; // null = use hardcoded fallbacks

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!service) return notFound();

    const IconComponent = iconMap[service.icon] || Activity;
    const hasVideo = !!extended.videoUrl;

    const getEmbedUrl = (url: string) => {
        if (!url) return "";
        let videoId = "";
        try {
            if (url.includes("youtube.com/watch?v=")) {
                videoId = url.split("v=")[1]?.split("&")[0];
            } else if (url.includes("youtu.be/")) {
                videoId = url.split("youtu.be/")[1]?.split("?")[0];
            } else if (url.includes("youtube.com/embed/")) {
                return url; // Already configured
            }
            return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
        } catch (e) {
            return url;
        }
    };

    const safeVideoUrl = getEmbedUrl(extended.videoUrl);

    return (
        <div className="flex-1 flex flex-col w-full bg-white dark:bg-gray-950 min-h-screen">

            {/* ���� Section 1: Cinematic Hero �������������������������������������������������������������� */}
            <section className="relative w-full min-h-screen flex flex-col justify-end pb-20 pt-32 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={service.image}
                        alt={service.title.en}
                        fill
                        className="object-cover scale-105"
                        priority
                        unoptimized
                    />
                    {/* Multi-layer overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-gray-900/30" />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-950/60 via-transparent to-transparent" />
                </div>

                {/* Animated floating orbs */}
                <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl animate-pulse pointer-events-none z-0" />
                <div className="absolute bottom-1/3 left-1/3 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl animate-pulse pointer-events-none z-0" style={{ animationDelay: "1.5s" }} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
                    <div className={`grid grid-cols-1 ${hasVideo ? 'lg:grid-cols-2' : ''} gap-12 lg:gap-16 items-center`}>
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="max-w-2xl"
                        >
                            {/* Service name */}
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-5 drop-shadow-xl">
                                {lang === "en" ? service.title.en : service.title.bn}
                            </h1>

                            {/* Tagline */}
                            <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 font-medium drop-shadow-md">
                                {lang === "en" ? extended.tagline.en : extended.tagline.bn}
                            </p>

                            {/* Hero CTAs */}
                            <div className="flex flex-wrap gap-3 mt-8">
                                <a
                                    href="tel:+8801700000000"
                                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:-translate-y-1 hover:shadow-emerald-500/40 text-base border border-transparent"
                                >
                                    <PhoneCall size={18} />
                                    {lang === "en" ? "Call Now" : "কল করুন"}
                                </a>
                                <button
                                    onClick={handleBookClick}
                                    className="inline-flex items-center gap-2 bg-white text-emerald-700 hover:bg-gray-50 border border-transparent font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-black/10 hover:-translate-y-1 text-base"
                                >
                                    <MessageCircle size={18} />
                                    {lang === "en" ? "Book Service" : "বুক সার্ভিস"}
                                </button>
                                {!hasVideo && (
                                    <button
                                        onClick={() => setVideoOpen(true)}
                                        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold px-6 py-3.5 rounded-xl border border-white/20 shadow-lg hover:-translate-y-1 transition-all text-base"
                                    >
                                        <Play size={18} className="fill-white" />
                                        {lang === "en" ? "Watch Video" : "ভিডিও দেখুন"}
                                    </button>
                                )}
                            </div>
                        </motion.div>

                        {/* Right Side Video Player embedded implicitly into Hero */}
                        {hasVideo && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                                className="w-full relative mt-10 lg:mt-0"
                            >
                                <div className="absolute -inset-4 bg-emerald-500/20 rounded-[2rem] blur-2xl pointer-events-none -z-10" />
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/10 aspect-video border border-white/20 bg-gray-900 ring-4 ring-white/10 group">
                                    <iframe
                                        src={`${safeVideoUrl}?autoplay=0&rel=0&modestbranding=1`}
                                        title={service.title.en}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full relative z-10"
                                        loading="lazy"
                                    />
                                    {/* Subtitle / Overlay string */}
                                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 z-20 pointer-events-none">
                                        <div className="bg-black/40 backdrop-blur-md rounded-full px-4 py-2 text-white text-xs font-semibold shadow-lg">
                                            {lang === "en" ? "Service Walkthrough" : "সার্ভিসটি সম্পর্কে জানুন"}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2 z-10"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                >
                    <span className="text-xs uppercase tracking-widest font-medium">
                        {lang === "en" ? "Scroll" : "鄏詮�鄏𨫼�鄏啤曳 鄏𨫼旭鄑�成"}
                    </span>
                    <ChevronDown size={20} />
                </motion.div>
            </section>



            {/* ���� Section 3: Service Overview + Unique Benefits ���������������������������� */}
            <section className="py-20 md:py-28 bg-white dark:bg-gray-950 relative overflow-hidden">
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-emerald-50 dark:bg-emerald-900/5 blur-3xl pointer-events-none" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                        {/* Left: Overview */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-8 lg:pr-6"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold text-sm mb-6 border border-emerald-200 dark:border-emerald-800">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                {lang === "en" ? "Service Overview" : "Service Overview"}
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                                {lang === "en" ? service.title.en : service.title.bn}
                            </h2>
                            <div className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/10 dark:to-gray-900 rounded-2xl p-7 border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
                                <p className="text-base text-gray-700 dark:text-gray-300 leading-[1.9] font-medium">
                                    {lang === "en" ? (extended.fullDescription?.en || service.description.en) : (extended.fullDescription?.bn || service.description.bn)}
                                </p>
                            </div>

                            {/* How It Delivers steps */}
                            <div className="mt-10 space-y-4">
                                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                                    {lang === "en" ? "How It Works" : "কিভাবে কাজ করে"}
                                </h3>
                                {extended.steps.map((step: { bn: string; en: string }, idx: number) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -15 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
                                            {idx + 1}
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 pt-1 font-medium leading-relaxed">
                                            {lang === "en" ? step.en : step.bn}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right: Unique Benefits */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:col-span-4 lg:sticky lg:top-32"
                        >
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                                {lang === "en" ? "What You'll Get" : "আপনি যা পাবেন"}
                            </h3>
                            <div className="space-y-4">
                                {extended.benefits.map((benefit: { icon: string; bn: string; en: string }, idx: number) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 15 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 transition-colors">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed pt-1">
                                            {lang === "en" ? benefit.en : benefit.bn}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Action Card */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 }}
                                className="mt-8 rounded-2xl overflow-hidden border border-emerald-200 dark:border-emerald-900/50 shadow-xl"
                            >
                                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-7 text-white text-center">
                                    <h4 className="text-xl font-bold mb-2">
                                        {lang === "en" ? "Need this service?" : "Need this service?"}
                                    </h4>
                                    <p className="text-emerald-100 text-sm mb-6 font-medium">
                                        {lang === "en"
                                            ? "Call us now for a free consultation."
                                            : "Call us now for a free consultation."}
                                    </p>
                                    <div className="flex flex-col gap-3">
                                        <a
                                            href="tel:+8801700000000"
                                            className="w-full flex items-center justify-center gap-2 bg-white text-emerald-700 font-bold py-3.5 px-6 rounded-xl hover:bg-emerald-50 transition-all shadow-md"
                                        >
                                            <PhoneCall size={18} />
                                            {lang === "en" ? "Call Now" : "Call Now"}
                                        </a>
                                        <button
                                            onClick={handleBookClick}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-3 rounded-xl transition shadow-lg shadow-emerald-500/20"
                                        >
                                            <MessageCircle size={18} />
                                            {lang === "en" ? "Book Service" : "Book Service"}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ════ DIAGNOSTIC SERVICE DEEP-DIVE ════ */}
            {/* Only renders for Diagnostic & Medical Tests (id=1) */}
            {String(id) === "1" && (
                <>
                    {/* ── Section: What Is This Service ── */}
                    <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-400" />
                        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-100/60 dark:bg-emerald-900/10 blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-teal-100/60 dark:bg-teal-900/10 blur-3xl pointer-events-none" />

                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold text-sm border border-emerald-200 dark:border-emerald-800 mb-5">
                                    <Microscope size={14} />
                                    {lang === "en" ? "Understand This Service" : "এই সেবাটি সম্পর্কে বিস্তারিত জানুন"}
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-5 leading-tight">
                                    {lang === "en" ? (d1?.whatIs?.title?.en || "What Is Diagnostic & Medical Testing Service?") : (d1?.whatIs?.title?.bn || "ডায়াগনস্টিক ও মেডিকেল টেস্ট সেবা কী?")}
                                </h2>
                                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                                    {lang === "en" ? (d1?.whatIs?.subtitle?.en || "A professional, end-to-end medical testing coordination service.") : (d1?.whatIs?.subtitle?.bn || "একটি পেশাদার সমন্বয় সেবা।")}
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {(d1?.whatIs?.cards || [
                                    { color: "emerald", en: "Home Sample Collection", bn: "বাড়িতে স্যাম্পল সংগ্রহ", descEn: "Our trained phlebotomist comes directly to your home, collects blood, urine, or stool samples, and delivers them safely to the partner lab.", descBn: "আমাদের প্রশিক্ষিত ফ্লেবোটোমিস্ট সরাসরি আপনার বাড়িতে আসেন, রক্ত/প্রস্রাব/মল স্যাম্পল সংগ্রহ করে পার্টনার ল্যাবে নিরাপদে পৌঁছে দেন।" },
                                    { color: "blue", en: "Escort to Diagnostic Center", bn: "ডায়াগনস্টিক সেন্টারে সঙ্গে যাওয়া", descEn: "A dedicated caregiver accompanies your loved one from home to the diagnostic center and brings them safely back.", descBn: "একজন নিবেদিত কেয়ারগিভার আপনার প্রিয়জনকে বাড়ি থেকে ডায়াগনস্টিক সেন্টারে নিয়ে যান এবং নিরাপদে ফিরিয়ে আনেন।" },
                                    { color: "indigo", en: "Report Delivery & Interpretation", bn: "রিপোর্ট ডেলিভারি ও ব্যাখ্যা", descEn: "Test reports are shared digitally with the family immediately. A doctor consultation is arranged if needed.", descBn: "পরীক্ষার রিপোর্ট সঙ্গে সঙ্গে পরিবারকে ডিজিটালি পাঠানো হয়। প্রয়োজনে ডাক্তারের পরামর্শের ব্যবস্থা করা হয়।" },
                                ]).map((item: any, i: number) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                                        className="bg-white dark:bg-gray-900 rounded-3xl p-7 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300 group">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${item.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                                            item.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                                                'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                            } group-hover:scale-110 transition-transform`}>
                                            {i === 0 ? <Home size={26} strokeWidth={1.5} /> : i === 1 ? <Building2 size={26} strokeWidth={1.5} /> : <FileText size={26} strokeWidth={1.5} />}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{lang === "en" ? item.en : item.bn}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{lang === "en" ? item.descEn : item.descBn}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── Section: Who Is This For ── */}
                    <section className="py-20 md:py-24 bg-white dark:bg-gray-950">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold text-sm border border-blue-200 dark:border-blue-800 mb-5">
                                    <Users size={14} />
                                    {lang === "en" ? "Who Is This Service For?" : "এই সেবাটি কাদের জন্য?"}
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                    {lang === "en" ? (d1?.whoIsItFor?.title?.en || "Designed For Those Who Need It Most") : (d1?.whoIsItFor?.title?.bn || "যারা সবচেয়ে বেশি প্রয়োজন তাদের জন্যই তৈরি")}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                                    {lang === "en" ? (d1?.whoIsItFor?.subtitle?.en || "Whether your loved one lives alone, has mobility challenges, or you simply cannot be present — this service fills the gap.") : (d1?.whoIsItFor?.subtitle?.bn || "আপনার প্রিয়জন একা থাকুন, চলাফেরায় সমস্যা থাকুক বা আপনি পাশে থাকতে না পারুন — এই সেবাটি সেই শূন্যস্থান পূরণ করে।")}
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                {(d1?.whoIsItFor?.cards || [
                                    { color: "rose", en: "Elderly Parents", bn: "বৃদ্ধ বাবা–মা", descEn: "Parents who struggle with travelling alone to diagnostic centers.", descBn: "যে বাবা–মা একা ডায়াগনস্টিক সেন্টারে যেতে কষ্ট হয়।" },
                                    { color: "amber", en: "Mobility-Challenged", bn: "চলাচলে অক্ষম", descEn: "People with limited mobility who need physical assistance throughout.", descBn: "যাদের স্বাধীনভাবে চলাফেরা করতে সমস্যা হয়।" },
                                    { color: "teal", en: "Post-Surgery Patients", bn: "অপারেশন পরবর্তী রোগী", descEn: "Recovering patients who need follow-up tests without the stress of travel.", descBn: "অপারেশনের পর ফলো-আপ পরীক্ষার জন্য যারা বাইরে যাওয়ার ঝামেলা এড়াতে চান।" },
                                    { color: "purple", en: "Chronically Ill", bn: "দীর্ঘমেয়াদী রোগী", descEn: "Diabetics, hypertension and heart patients who need regular monitoring tests.", descBn: "ডায়াবেটিস, উচ্চরক্তচাপ ও হৃদরোগীরা যাদের নিয়মিত মনিটরিং টেস্ট দরকার।" },
                                ]).map((item: any, i: number) => {
                                    const icons = [Heart, Accessibility, Baby, BrainCircuit];
                                    const IconComp = icons[i] || Heart;
                                    return (
                                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                            className="rounded-3xl p-6 border bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color === 'rose' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' :
                                                item.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                                                    item.color === 'teal' ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' :
                                                        'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                                }`}>
                                                <IconComp size={22} strokeWidth={1.7} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white mb-1.5">{lang === "en" ? item.en : item.bn}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{lang === "en" ? item.descEn : item.descBn}</p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* NB: Expats callout */}
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                                className="mt-10 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                                    <Truck size={30} className="text-white" strokeWidth={1.5} />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        {lang === "en" ? (d1?.whoIsItFor?.expatsCallout?.titleEn || "Living abroad? Working in another city?") : (d1?.whoIsItFor?.expatsCallout?.titleBn || "বিদেশে বাস করছেন? অন্য শহরে কর্মরত?")}
                                    </h3>
                                    <p className="text-emerald-100 leading-relaxed">
                                        {lang === "en" ? (d1?.whoIsItFor?.expatsCallout?.descEn || "You don't need to book a flight just to take your parents for a blood test. Our team handles everything.") : (d1?.whoIsItFor?.expatsCallout?.descBn || "বাবা–মার রক্ত পরীক্ষার জন্য দেশে ছুটে আসতে হবে না। আমাদের টিম সবকিছু সামলায়।")}
                                    </p>
                                </div>
                                <a href="tel:+8801700000000" className="shrink-0 flex items-center gap-2 bg-white text-emerald-700 font-bold px-6 py-3 rounded-2xl hover:bg-emerald-50 transition-all shadow-lg">
                                    <PhoneCall size={18} />
                                    {lang === "en" ? "Call Now" : "কল করুন"}
                                </a>
                            </motion.div>
                        </div>
                    </section>

                    {/* ── Section: Two Workflows Side By Side ── */}
                    <section className="py-20 md:py-28 bg-slate-50 dark:bg-gray-900 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(16,185,129,0.06)_0%,_transparent_60%)] pointer-events-none" />
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-semibold text-sm border border-indigo-200 dark:border-indigo-800 mb-5">
                                    <Zap size={14} />
                                    {lang === "en" ? "Choose Your Service Type" : "আপনার পছন্দের সেবা বেছে নিন"}
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                    {lang === "en" ? (d1?.workflows?.title?.en || "Two Ways We Can Help You") : (d1?.workflows?.title?.bn || "দুটি উপায়ে আমরা সেবা দিই")}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                                    {lang === "en" ? (d1?.workflows?.subtitle?.en || "Select the option that best suits your loved one's condition and your preference.") : (d1?.workflows?.subtitle?.bn || "আপনার প্রিয়জনের অবস্থা ও সুবিধা অনুযায়ী যেকোনো একটি বেছে নিন।")}
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                                {/* Without Transport */}
                                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                                    className="bg-white dark:bg-gray-950 rounded-3xl border-2 border-emerald-200 dark:border-emerald-900 shadow-xl overflow-hidden">
                                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-6">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                                <Home size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <span className="text-emerald-100 text-xs font-semibold uppercase tracking-wider">Option A</span>
                                                <h3 className="text-xl font-bold text-white">
                                                    {lang === "en" ? "Home Sample Collection" : "বাড়িতে স্যাম্পল সংগ্রহ"}
                                                </h3>
                                            </div>
                                        </div>
                                        <p className="text-emerald-100 text-sm">
                                            {lang === "en" ? "Best for: routine tests, follow-ups, bedridden patients" : "উপযুক্ত: নিয়মিত পরীক্ষা, ফলো-আপ, শয্যাশায়ী রোগী"}
                                        </p>
                                    </div>
                                    <div className="p-8 space-y-4">
                                        {(d1?.workflows?.optionA?.steps || [
                                            { en: "You book the service online or via phone", bn: "আপনি অনলাইনে বা ফোনে সেবা বুক করেন" },
                                            { en: "Manager reviews and confirms a convenient time slot", bn: "ম্যানেজার রিভিউ করে সুবিধাজনক সময় নিশ্চিত করেন" },
                                            { en: "Our certified phlebotomist arrives at your door", bn: "আমাদের সার্টিফাইড ফ্লেবোটোমিস্ট আপনার দরজায় আসেন" },
                                            { en: "Samples are collected professionally and hygienically", bn: "পেশাদারভাবে ও স্বাস্থ্যসম্মতভাবে স্যাম্পল সংগ্রহ করা হয়" },
                                            { en: "Samples are delivered to the lab securely", bn: "স্যাম্পল নিরাপদে ল্যাবে পৌঁছে দেওয়া হয়" },
                                            { en: "Digital report is sent to your family WhatsApp/Email", bn: "ডিজিটাল রিপোর্ট পরিবারের হোয়াটসঅ্যাপ/ইমেইলে পাঠানো হয়" },
                                        ]).map((step: any, i: number) => (
                                            <div key={i} className="flex items-start gap-4">
                                                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-emerald-500/30">{i + 1}</div>
                                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{lang === "en" ? step.en : step.bn}</p>
                                            </div>
                                        ))}
                                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                                                <BadgeCheck size={16} />
                                                {lang === "en" ? (d1?.workflows?.optionA?.footerEn || "No travel required. Comfortable & Stress-free.") : (d1?.workflows?.optionA?.footerBn || "কোনো ভ্রমণ নেই। সম্পূর্ণ আরামদায়ক ও ঝামেলামুক্ত।")}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* With Transport */}
                                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
                                    className="bg-white dark:bg-gray-950 rounded-3xl border-2 border-blue-200 dark:border-blue-900 shadow-xl overflow-hidden">
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                                <Building2 size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <span className="text-blue-100 text-xs font-semibold uppercase tracking-wider">Option B</span>
                                                <h3 className="text-xl font-bold text-white">
                                                    {lang === "en" ? "With Transport (Escort to Center)" : "পরিবহনসহ (সেন্টারে সঙ্গে যাওয়া)"}
                                                </h3>
                                            </div>
                                        </div>
                                        <p className="text-blue-100 text-sm">
                                            {lang === "en" ? "Best for: complex tests, first-time visits, anxious patients" : "উপযুক্ত: জটিল পরীক্ষা, প্রথমবার ভিজিট, উদ্বিগ্ন রোগী"}
                                        </p>
                                    </div>
                                    <div className="p-8 space-y-4">
                                        {(d1?.workflows?.optionB?.steps || [
                                            { en: "You book online and select 'With Transport' option", bn: "আপনি অনলাইনে বুক করুন এবং 'পরিবহনসহ' অপশন বেছে নিন" },
                                            { en: "Manager assigns a trained caregiver & confirms time", bn: "ম্যানেজার একজন প্রশিক্ষিত কেয়ারগিভার নির্ধারণ করেন ও সময় নিশ্চিত করেন" },
                                            { en: "Caregiver arrives at home and assists with preparation", bn: "কেয়ারগিভার বাড়িতে আসেন এবং প্রস্তুতিতে সহায়তা করেন" },
                                            { en: "Caregiver escorts patient safely to the diagnostic center", bn: "কেয়ারগিভার রোগীকে নিরাপদে ডায়াগনস্টিক সেন্টারে নিয়ে যান" },
                                            { en: "Stays throughout — manages paperwork, queues & tests", bn: "পুরো সময় সঙ্গে থাকেন — কাগজপত্র, লাইন ও পরীক্ষা সামলান" },
                                            { en: "Safely returns patient home. Report shared with family.", bn: "রোগীকে নিরাপদে বাড়ি ফেরান। রিপোর্ট পরিবারকে পাঠানো হয়।" },
                                        ]).map((step: any, i: number) => (
                                            <div key={i} className="flex items-start gap-4">
                                                <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-blue-600/30">{i + 1}</div>
                                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{lang === "en" ? step.en : step.bn}</p>
                                            </div>
                                        ))}
                                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-semibold">
                                                <BadgeCheck size={16} />
                                                {lang === "en" ? (d1?.workflows?.optionB?.footerEn || "Full accompaniment. Your loved one is never alone.") : (d1?.workflows?.optionB?.footerBn || "সম্পূর্ণ সঙ্গ। আপনার প্রিয়জন কখনো একা নন।")}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* CTA after comparison */}
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
                                className="text-center mt-12">
                                <p className="text-gray-500 dark:text-gray-400 mb-6">{lang === "en" ? "Not sure which to choose? Our team will guide you." : "কোনটি বেছে নেবেন বুঝতে পারছেন না? আমাদের টিম আপনাকে গাইড করবে।"}</p>
                                <button onClick={handleBookClick}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-xl shadow-emerald-600/20 hover:-translate-y-0.5 text-base">
                                    <MessageCircle size={18} />
                                    {lang === "en" ? "Book Now — It's Simple" : "এখনই বুক করুন — খুবই সহজ"}
                                    <ArrowRight size={16} className="group-hover:translate-x-1" />
                                </button>
                            </motion.div>
                        </div>
                    </section>

                    {/* ── Section: Common Tests ── */}
                    <section className="py-20 bg-white dark:bg-gray-950">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-semibold text-sm border border-teal-200 dark:border-teal-800 mb-5">
                                    <FlaskConical size={14} />
                                    {lang === "en" ? "Commonly Requested Tests" : "সাধারণত যে পরীক্ষাগুলো করা হয়"}
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                    {lang === "en" ? (d1?.tests?.title?.en || "Tests We Coordinate") : (d1?.tests?.title?.bn || "আমরা যে পরীক্ষাগুলো পরিচালনা করি")}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                                    {lang === "en" ? (d1?.tests?.subtitle?.en || "From routine blood work to specialized panels — we handle it all.") : (d1?.tests?.subtitle?.bn || "সাধারণ রক্ত পরীক্ষা থেকে বিশেষজ্ঞ প্যানেল পর্যন্ত — সব কিছু আমরা সামলাই।")}
                                </p>
                            </motion.div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {[
                                    { en: "CBC (Complete Blood Count)", bn: "সিবিসি (রক্তের সম্পূর্ণ পরীক্ষা)", tag: "Routine" },
                                    { en: "Blood Sugar (Fasting/PP)", bn: "ব্লাড সুগার (ফাস্টিং/পিপি)", tag: "Diabetes" },
                                    { en: "HbA1c (Glycated Haemoglobin)", bn: "HbA1c (গ্লাইকেটেড হিমোগ্লোবিন)", tag: "Diabetes" },
                                    { en: "Lipid Profile", bn: "লিপিড প্রোফাইল", tag: "Heart" },
                                    { en: "Urine R/E & C/S", bn: "প্রস্রাব পরীক্ষা (R/E ও C/S)", tag: "Kidney" },
                                    { en: "Thyroid Function (T3/T4/TSH)", bn: "থাইরয়েড ফাংশন টেস্ট", tag: "Thyroid" },
                                    { en: "Creatinine & Urea", bn: "ক্রিয়েটিনিন ও ইউরিয়া", tag: "Kidney" },
                                    { en: "Liver Function Test (LFT)", bn: "লিভার ফাংশন টেস্ট (LFT)", tag: "Liver" },
                                    { en: "Vitamin D & B12", bn: "ভিটামিন ডি ও বি-১২", tag: "Nutrition" },
                                    { en: "ECG / Echo", bn: "ইসিজি / ইকো", tag: "Heart" },
                                    { en: "X-Ray & Ultrasound", bn: "এক্স-রে ও আলট্রাসাউন্ড", tag: "Imaging" },
                                    { en: "COVID / Dengue Tests", bn: "কোভিড / ডেঙ্গু পরীক্ষা", tag: "Infection" },
                                ].map((test, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                                        className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 hover:border-teal-300 dark:hover:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/10 transition-all duration-200 group">
                                        <div className="flex items-start gap-3">
                                            <CheckCircle2 size={16} className="text-teal-500 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">{lang === "en" ? test.en : test.bn}</p>
                                                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-500 uppercase tracking-wide mt-1 inline-block">{test.tag}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <p className="text-center text-sm text-gray-400 mt-8">
                                {lang === "en" ? "Don't see your test? Call us — we can arrange almost any diagnostic test in Dhaka." : "আপনার পরীক্ষাটি তালিকায় নেই? কল করুন — ঢাকায় যেকোনো ডায়াগনস্টিক পরীক্ষার ব্যবস্থা করতে পারি।"}
                            </p>
                        </div>
                    </section>

                    {/* ── Section: Why Nirvaar Care ── */}
                    <section className="py-20 md:py-28 bg-gradient-to-br from-emerald-950 via-gray-950 to-teal-950 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.15)_0%,_transparent_60%)] pointer-events-none" />
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/50 text-emerald-400 font-semibold text-sm border border-emerald-700/50 mb-5">
                                    <ThumbsUp size={14} />
                                    {lang === "en" ? "Why Nirvaar Care?" : "কেন নির্ভার কেয়ার বেছে নেবেন?"}
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                    {lang === "en" ? (d1?.whyUs?.title?.en || "What Makes Us Different") : (d1?.whyUs?.title?.bn || "আমরা কোথায় আলাদা")}
                                </h2>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {(d1?.whyUs?.features || [
                                    { en: "100% Verified Caregivers", descEn: "All our field staff are police-verified, professionally trained, and regularly supervised.", bn: "১০০% ভেরিফাইড কেয়ারগিভার", descBn: "আমাদের সকল মাঠকর্মী পুলিশ ভেরিফাইড, পেশাদারভাবে প্রশিক্ষিত এবং নিয়মিত তত্ত্বাবধায়িত।" },
                                    { en: "Real-Time Family Updates", descEn: "You receive live status updates at every step — from caregiver dispatch to report delivery.", bn: "রিয়েল-টাইম পারিবারিক আপডেট", descBn: "প্রতিটি ধাপে আপনি লাইভ আপডেট পান — কেয়ারগিভার পাঠানো থেকে রিপোর্ট ডেলিভারি পর্যন্ত।" },
                                    { en: "Trusted Partner Labs Only", descEn: "We work exclusively with accredited, government-approved diagnostic centers in your city.", bn: "শুধুমাত্র বিশ্বস্ত পার্টনার ল্যাব", descBn: "আমরা শুধুমাত্র শহরের সরকার-অনুমোদিত ডায়াগনস্টিক সেন্টারগুলোর সাথে কাজ করি।" },
                                    { en: "Compassionate Human Touch", descEn: "Beyond logistics, our caregivers provide emotional comfort and dignity to every patient.", bn: "মানবিক সহানুভূতির স্পর্শ", descBn: "লজিস্টিকের বাইরেও, আমাদের কেয়ারগিভাররা প্রতিটি রোগীকে মানসিক সান্ত্বনা ও মর্যাদা দিয়ে থাকেন।" },
                                ]).map((item: any, i: number) => {
                                    const icons = [Shield, Clock, FlaskConical, Heart];
                                    const FeatureIcon = icons[i] || Shield;
                                    return (
                                        <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                            className="flex items-start gap-5 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                                                <FeatureIcon size={22} strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white mb-2">{lang === "en" ? item.en : item.bn}</h4>
                                                <p className="text-gray-400 text-sm leading-relaxed">{lang === "en" ? item.descEn : item.descBn}</p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* ── Section: FAQ ── */}
                    <section className="py-20 md:py-28 bg-white dark:bg-gray-950">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold text-sm border border-gray-200 dark:border-gray-700 mb-5">
                                    <HelpCircle size={14} />
                                    FAQ
                                </span>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {lang === "en" ? "Common Questions" : "সাধারণ প্রশ্নসমূহ"}
                                </h2>
                            </motion.div>

                            <div className="space-y-4">
                                {(d1?.faq?.items || [
                                    { q: { en: "How quickly can you arrange a home sample collection?", bn: "বাড়িতে স্যাম্পল সংগ্রহ কত দ্রুত ব্যবস্থা করা যায়?" }, a: { en: "In most cases, we can arrange a same-day or next-morning visit depending on your location and time of booking.", bn: "বেশিরভাগ ক্ষেত্রে, আপনার অবস্থান এবং বুকিংয়ের সময়ের উপর নির্ভর করে আমরা সেদিনই বা পরদিন সকালে ব্যবস্থা করতে পারি।" } },
                                    { q: { en: "Can the caregiver stay with the patient at the diagnostic center?", bn: "কেয়ারগিভার কি রোগীর সাথে ডায়াগনস্টিক সেন্টারে থাকতে পারবেন?" }, a: { en: "Yes. With the 'With Transport' option, the caregiver stays with your loved one for the entire duration.", bn: "হ্যাঁ। 'পরিবহনসহ' অপশনে কেয়ারগিভার পুরো সময় আপনার প্রিয়জনের সাথে থাকেন।" } },
                                    { q: { en: "How will I receive the test reports?", bn: "পরীক্ষার রিপোর্ট কীভাবে পাব?" }, a: { en: "Reports are delivered digitally via WhatsApp and Email to the family contact provided during booking.", bn: "রিপোর্ট বুকিংয়ের সময় দেওয়া পারিবারিক যোগাযোগ নম্বরে হোয়াটসঅ্যাপ এবং ইমেইলে ডিজিটালি পাঠানো হয়।" } },
                                    { q: { en: "Is this service available outside Dhaka?", bn: "এই সেবা কি ঢাকার বাইরেও পাওয়া যায়?" }, a: { en: "Currently, our service is primarily available in Dhaka. We are actively expanding to other major cities.", bn: "বর্তমানে আমাদের সেবা মূলত ঢাকায় পাওয়া যায়। আমরা সক্রিয়ভাবে অন্যান্য প্রধান শহরে সম্প্রসারিত হচ্ছি।" } },
                                    { q: { en: "What if my parent refuses to go or is anxious?", bn: "যদি আমার বাবা-মা যেতে না চান বা ভয় পান?" }, a: { en: "Our caregivers are trained in patient communication and empathy. The Home Sample Collection option is also ideal for anxious individuals.", bn: "আমাদের কেয়ারগিভাররা রোগীর সাথে যোগাযোগ এবং সহানুভূতিতে প্রশিক্ষিত। উদ্বিগ্ন ব্যক্তিদের জন্য হোম স্যাম্পল কালেকশন অপশনটিও আদর্শ।" } },
                                ]).map((faq: any, i: number) => (
                                    <FAQItem key={i} question={lang === "en" ? faq.q.en : faq.q.bn} answer={lang === "en" ? faq.a.en : faq.a.bn} />
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            )}
            {/* ════ END DIAGNOSTIC SERVICE DEEP-DIVE ════ */}

            {/* ���� Section 4: Video / How We Deliver �������������������������������������������������� */}
            <section className="py-20 md:py-28 bg-gray-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(16,185,129,0.08)_0%,_transparent_60%)] pointer-events-none" />
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-14"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/40 text-emerald-400 font-semibold text-sm mb-4 border border-emerald-800/50">
                            <Play size={13} className="fill-emerald-400" />
                            {lang === "en" ? "See It In Action" : "See It In Action"}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white">
                            {lang === "en" ? "How We Deliver This Service" : "How We Deliver This Service"}
                        </h2>
                    </motion.div>

                    <div className="max-w-4xl mx-auto">

                        {/* Deliveries */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-6"
                        >
                            {(extended.deliveries || []).map((delivery: { bn: string; en: string }, idx: number) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.12 }}
                                    className="flex gap-5 group"
                                >
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500 text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        {idx < (extended.deliveries?.length || 0) - 1 && (
                                            <div className="w-0.5 h-8 bg-emerald-900/60 mt-2" />
                                        )}
                                    </div>
                                    <div className="pb-4">
                                        <p className="text-white/80 font-medium leading-relaxed group-hover:text-white transition-colors">
                                            {lang === "en" ? delivery.en : delivery.bn}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}

                            <a
                                href="tel:+8801700000000"
                                className="inline-flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-xl transition-all mt-4 shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 group"
                            >
                                <PhoneCall size={18} />
                                {lang === "en" ? "Start Today" : "Start Today"}
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Section 5: Testimonial Spotlight ─────────────────────────────────── */}
            <section className="py-20 md:py-24 bg-gradient-to-b from-white to-emerald-50/50 dark:from-gray-950 dark:to-emerald-950/10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold text-sm mb-4 border border-emerald-200 dark:border-emerald-800">
                            <Star size={13} className="fill-emerald-500 text-emerald-500" />
                            {lang === "en" ? "Client Stories" : "Client Stories"}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            {lang === "en" ? "What Families Say" : "What Families Say"}
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {((extended.stories && extended.stories.length > 0) ? extended.stories : testimonialData.items).map((t: any, idx: number) => (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-xl hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300 flex flex-col"
                            >
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: t.rating }).map((_, i) => (
                                        <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed italic flex-grow mb-6">
                                    "{lang === "en" ? t.quote.en : t.quote.bn}"
                                </p>

                                {/* Person */}
                                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-emerald-200 dark:border-emerald-800 shrink-0">
                                        <Image
                                            src={t.image}
                                            alt={t.name.en}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm">
                                            {lang === "en" ? t.name.en : t.name.bn}
                                        </p>
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                            {lang === "en" ? t.role.en : t.role.bn}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ���� Section 6: Final CTA Banner ���������������������������������������������������������������� */}
            <section className="py-20 bg-gray-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.12)_0%,_transparent_70%)] pointer-events-none" />
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-8">
                            <IconComponent size={40} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                            {lang === "en"
                                ? "Ready to get started?"
                                : "Ready to get started?"}
                        </h2>
                        <p className="text-lg text-white/60 mb-10 font-medium">
                            {lang === "en"
                                ? "Our team is available 24/7. Reach out and we'll take care of the rest."
                                : "Our team is available 24/7. Reach out and we'll take care of the rest."}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:+8801700000000"
                                className="inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-10 py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 text-lg"
                            >
                                <PhoneCall size={22} />
                                {lang === "en" ? "Call Now: +880 1700-000000" : "Call Now: +880 1700-000000"}
                            </a>
                            <Link
                                href="/#contact"
                                className="inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-10 py-4 rounded-xl border border-white/20 transition-all hover:-translate-y-0.5 text-lg"
                            >
                                <MessageCircle size={22} />
                                {lang === "en" ? "Send a Message" : "Send a Message"}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ���� Sticky Mobile CTA Bar ���������������������������������������������������������������������������� */}
            <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
                <div className="bg-gray-900/95 backdrop-blur-md border-t border-emerald-900/40 px-4 py-3 flex items-center gap-3 shadow-2xl">
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm truncate">
                            {lang === "en" ? service.title.en : service.title.bn}
                        </p>
                        <p className="text-emerald-400 text-xs font-medium">
                            {lang === "en" ? "24/7 Support Available" : "24/7 Support Available"}
                        </p>
                    </div>
                    <a
                        href="tel:+8801700000000"
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shrink-0 shadow-lg"
                    >
                        <PhoneCall size={16} />
                        {lang === "en" ? "Call" : "Call"}
                    </a>
                </div>
            </div>

            {/*  Video Lightbox Modal  */}
            <AnimatePresence>
                {videoOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                        onClick={() => setVideoOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="w-full max-w-4xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setVideoOpen(false)}
                                className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <X size={20} />
                                <span className="text-sm font-medium">
                                    {lang === "en" ? "Close" : "Close"}
                                </span>
                            </button>

                            <div className="rounded-2xl overflow-hidden shadow-2xl aspect-video border border-white/10 bg-gray-900 flex items-center justify-center">
                                {hasVideo ? (
                                    <iframe
                                        src={`${safeVideoUrl}?autoplay=1&rel=0`}
                                        title={service.title.en}
                                        allow="autoplay; encrypted-media; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    />
                                ) : (
                                    <div className="text-center text-white/60 p-12">
                                        <Play size={48} className="mx-auto mb-4 text-emerald-400" />
                                        <p className="text-lg font-medium mb-2">
                                            {lang === "en" ? "Video Coming Soon" : "Video Coming Soon"}
                                        </p>
                                        <p className="text-sm">
                                            {lang === "en"
                                                ? "In the meantime, call us to learn more."
                                                : "In the meantime, call us to learn more."}
                                        </p>
                                        <a
                                            href="tel:+8801700000000"
                                            className="inline-flex items-center gap-2 mt-6 bg-emerald-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-emerald-400 transition-all"
                                        >
                                            <PhoneCall size={18} />
                                            {lang === "en" ? "Call Us" : "Call Us"}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                serviceId={parseInt(id as string, 10) || service.id}
                serviceName={service.title}
            />

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={() => {
                    setIsAuthModalOpen(false);
                    setIsBookingModalOpen(true);
                }}
            />
        </div>
    );
}
