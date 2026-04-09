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
    const cmsServicesData = servicesSection?.content_data || servicesData;

    const service = cmsServicesData?.items?.find((s: any) => String(s.id) === String(id));
    
    // In case the DB was saved before we added extended properties, fallback to constants
    const defaultVariant = servicesData.items.find((s: any) => String(s.id) === String(id));
    const extended = service?.extended || defaultVariant?.extended || { steps: [], benefits: [], tagline: { en: '', bn: '' } };

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
                                {lang === "en" ? "Service Overview" : "鄏詮�鄏眇汙鄏� 鄏眇江鄏詮�鄏戈汙鄏啤江鄏�"}
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
                                    {lang === "en" ? "How It Works" : "鄏𨫼�鄏冢汙鄏眇� 鄏𨫼汙鄏� 鄏𨫼旭鄑�"}
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
                                {lang === "en" ? "What You'll Get" : "鄏�扛鄏兒江 鄏芹汙鄏眇�鄏�"}
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
                                        {lang === "en" ? "Need this service?" : "鄏𥐰� 鄏詮�鄏眇汙鄏颴江 鄏芹�鄏啤旬鄏潼�鄏厢成?"}
                                    </h4>
                                    <p className="text-emerald-100 text-sm mb-6 font-medium">
                                        {lang === "en"
                                            ? "Call us now for a free consultation."
                                            : "鄏眇江鄏兒汙鄏桌�鄏耜�鄏能� 鄏芹旭鄏擒旨鄏啤�鄏嗣�鄏� 鄏厢成鄑温旬 鄏𥐰�鄏兒� 鄏𨫼曳 鄏𨫼旭鄑�成鄍�"}
                                    </p>
                                    <div className="flex flex-col gap-3">
                                        <a
                                            href="tel:+8801700000000"
                                            className="w-full flex items-center justify-center gap-2 bg-white text-emerald-700 font-bold py-3.5 px-6 rounded-xl hover:bg-emerald-50 transition-all shadow-md"
                                        >
                                            <PhoneCall size={18} />
                                            {lang === "en" ? "Call Now" : "鄏𨫼曳 鄏𨫼旭鄑�成"}
                                        </a>
                                        <button
                                            onClick={handleBookClick}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-3 rounded-xl transition shadow-lg shadow-emerald-500/20"
                                        >
                                            <MessageCircle size={18} />
                                            {lang === "en" ? "Book Service" : "鄏眇�鄏𨫼江鄏� 鄏舟江鄏�"}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

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
                            {lang === "en" ? "See It In Action" : "鄏詮�鄏眇汙鄏颴江 鄏舟�鄏遤�鄏�"}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white">
                            {lang === "en" ? "How We Deliver This Service" : "鄏�旨鄏啤汙 鄏𨫼�鄏冢汙鄏眇� 鄏𥐰� 鄏詮�鄏眇汙 鄏舟江鄏�"}
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
                                {lang === "en" ? "Start Today" : "鄏��鄏� 鄏嗣�鄏啤� 鄏𨫼旭鄑�成"}
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
                            {lang === "en" ? "Client Stories" : "鄏芹旭鄏賴收鄏擒旭鄑�旭 鄏�早鄏賴�鄑温�鄏戈汙"}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            {lang === "en" ? "What Families Say" : "鄏芹旭鄏賴收鄏擒旭鄏鉮�鄏耜� 鄏𨫼� 鄏眇曳鄑�"}
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
                                : "鄏嗣�鄏啤� 鄏𨫼旭鄏戈� 鄏芹�鄏啤次鄑温忖鄑�忖?"}
                        </h2>
                        <p className="text-lg text-white/60 mb-10 font-medium">
                            {lang === "en"
                                ? "Our team is available 24/7. Reach out and we'll take care of the rest."
                                : "鄏�旨鄏擒戌鄑�旭 鄏颴江鄏� 鄑兒妒/鄑� 鄏芹�鄏啤次鄑温忖鄑�忖鄍� 鄏𥐰�鄏颴汙 鄏𨫼曳 鄏𨫼旭鄑�成, 鄏眇汙鄏𨫼江鄏颴汙 鄏�旨鄏擒戌鄑�旭 鄏舟汙鄏能汝鄏賴忖鄑温收鄍�"}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:+8801700000000"
                                className="inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-10 py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 text-lg"
                            >
                                <PhoneCall size={22} />
                                {lang === "en" ? "Call Now: +880 1700-000000" : "鄏𨫼曳 鄏𨫼旭鄑�成: +鄑桌妙鄑� 鄑抉妣鄑舟圻-鄑舟圻鄑舟圻鄑舟圻"}
                            </a>
                            <Link
                                href="/#contact"
                                className="inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-10 py-4 rounded-xl border border-white/20 transition-all hover:-translate-y-0.5 text-lg"
                            >
                                <MessageCircle size={22} />
                                {lang === "en" ? "Send a Message" : "鄏桌�鄏詮�鄏� 鄏芹汙鄏恷汙鄏�"}
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
                            {lang === "en" ? "24/7 Support Available" : "鄑兒妒/鄑� 鄏詮此鄏擒旬鄏潼忖鄏� 鄏芹汙鄏𠼭�鄏𥔿�鄏�"}
                        </p>
                    </div>
                    <a
                        href="tel:+8801700000000"
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shrink-0 shadow-lg"
                    >
                        <PhoneCall size={16} />
                        {lang === "en" ? "Call" : "鄏𨫼曳 鄏𨫼旭鄑�成"}
                    </a>
                </div>
            </div>

            {/* ���� Video Lightbox Modal ������������������������������������������������������������������������������ */}
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
                                    {lang === "en" ? "Close" : "鄏眇成鄑温戍 鄏𨫼旭鄑�成"}
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
                                            {lang === "en" ? "Video Coming Soon" : "鄏冢江鄏﹤江鄏栞�鄏嗣�鄏熈�鄏啤� 鄏�次鄏𥔿�"}
                                        </p>
                                        <p className="text-sm">
                                            {lang === "en"
                                                ? "In the meantime, call us to learn more."
                                                : "鄏𥐰� 鄏桌�鄏嫩�鄏啤�鄏戈� 鄏�旨鄏擒戌鄑�旭 鄏𨫼曳 鄏𨫼旭鄑�成 鄏�旭鄏� 鄏厢汙鄏兒忖鄑�奶"}
                                        </p>
                                        <a
                                            href="tel:+8801700000000"
                                            className="inline-flex items-center gap-2 mt-6 bg-emerald-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-emerald-400 transition-all"
                                        >
                                            <PhoneCall size={18} />
                                            {lang === "en" ? "Call Us" : "鄏𨫼曳 鄏𨫼旭鄑�成"}
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
