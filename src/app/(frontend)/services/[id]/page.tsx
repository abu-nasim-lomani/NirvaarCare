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
import BookingModal from "@/components/services/BookingModal";
import AuthModal from "@/components/auth/AuthModal";
import { createClient } from "@/lib/supabase/client";

// ── Icon map ────────────────────────────────────────────────────────────────
const iconMap: Record<string, React.FC<any>> = {
    Activity, Stethoscope, Pill, Ambulance, ShoppingBag, HeartHandshake,
};

// ── Per-service extended data (benefits, steps, video, tagline) ─────────────
const serviceExtendedData: Record<number, {
    videoUrl: string;
    tagline: { bn: string; en: string };
    benefits: { icon: string; bn: string; en: string }[];
    steps: { bn: string; en: string }[];
}> = {
    1: {
        videoUrl: "", // add YouTube embed URL here e.g. "https://www.youtube.com/embed/VIDEO_ID"
        tagline: {
            bn: "সঠিক পরীক্ষা, সঠিক সময়ে—আপনার স্বাস্থ্য আমাদের দায়িত্ব।",
            en: "The right test at the right time — your health is our responsibility.",
        },
        benefits: [
            { icon: "home", bn: "বাড়িতে বসেই স্যাম্পল সংগ্রহ", en: "Sample collection at your doorstep" },
            { icon: "report", bn: "ডিজিটাল রিপোর্ট ডেলিভারি", en: "Digital report delivery to family" },
            { icon: "escort", bn: "ডায়াগনস্টিক সেন্টারে কেয়ারগিভার সঙ্গ", en: "Caregiver escort to diagnostic center" },
            { icon: "doctor", bn: "রিপোর্ট ব্যাখ্যায় ডাক্তার সহায়তা", en: "Doctor assistance for report interpretation" },
        ],
        steps: [
            { bn: "হেল্পলাইনে কল করুন এবং পরীক্ষার ধরন জানান", en: "Call our helpline and specify the tests required" },
            { bn: "আমাদের টিম সুবিধাজনক সময় ও কেন্দ্র নির্বাচন করে দেবে", en: "Our team selects a convenient time & center for you" },
            { bn: "কেয়ারগিভার প্রিয়জনকে সঙ্গ নিয়ে পরীক্ষা সম্পন্ন করবে", en: "Caregiver accompanies your loved one for the tests" },
            { bn: "রিপোর্ট ডিজিটালি পাঠানো হবে এবং ডাক্তারের পরামর্শ নেওয়া হবে", en: "Report is shared digitally and doctor consultation is arranged" },
        ],
    },
    2: {
        videoUrl: "",
        tagline: {
            bn: "সেরা চিকিৎসকের পরামর্শ, আপনার দোরগোড়ায়।",
            en: "The best medical advice, brought to your doorstep.",
        },
        benefits: [
            { icon: "calendar", bn: "চিকিৎসকের অ্যাপয়েন্টমেন্ট নির্ধারণ", en: "Doctor appointment scheduling & booking" },
            { icon: "escort", bn: "হাসপাতালে সঙ্গ করে নিয়ে যাওয়া", en: "Physical escort to hospital & clinic" },
            { icon: "video", bn: "অনলাইন ভিডিও কনসালটেশন সহায়তা", en: "Assisted online video consultation" },
            { icon: "follow", bn: "ফলো-আপ অ্যাপয়েন্টমেন্ট ট্র্যাকিং", en: "Follow-up appointment tracking & reminders" },
        ],
        steps: [
            { bn: "ডাক্তারের বিশেষত্ব ও পছন্দ জানান", en: "Tell us the specialty and doctor preference" },
            { bn: "আমরা সেরা ও সুবিধাজনক অ্যাপয়েন্টমেন্ট বুক করব", en: "We book the best available appointment" },
            { bn: "নির্ধারিত দিনে কেয়ারগিভার সঙ্গে থাকবে", en: "Caregiver stays with them on the appointment day" },
            { bn: "ডাক্তারের পরামর্শ এবং প্রেসক্রিপশন পরিবারকে পাঠানো হবে", en: "Doctor's advice & prescription is shared with family" },
        ],
    },
    3: {
        videoUrl: "",
        tagline: {
            bn: "সঠিক ঔষধ, সঠিক সময়ে—মিস হবে না একটি ডোজও।",
            en: "The right medicine, on time — not a single dose missed.",
        },
        benefits: [
            { icon: "delivery", bn: "প্রেসক্রিপশন অনুযায়ী ঔষধ সংগ্রহ ও ডেলিভারি", en: "Medicine collection & home delivery as per prescription" },
            { icon: "monitor", bn: "ঔষধ সেবনের দৈনন্দিন পর্যবেক্ষণ", en: "Daily monitoring of medicine intake" },
            { icon: "reminder", bn: "সময়মতো সেবনের স্মার্ট রিমাইন্ডার", en: "Smart reminders for timely consumption" },
            { icon: "refill", bn: "ঔষধ শেষ হওয়ার আগেই রিফিল ব্যবস্থা", en: "Proactive refill before medicines run out" },
        ],
        steps: [
            { bn: "প্রেসক্রিপশনের ছবি বা তালিকা পাঠান", en: "Send us a photo or list of the prescription" },
            { bn: "আমরা ঔষধ সংগ্রহ করে বাড়িতে পৌঁছে দেব", en: "We procure and deliver medicines to their home" },
            { bn: "কেয়ারগিভার নিশ্চিত করবে সঠিক সময়ে সেবন হচ্ছে", en: "Caregiver ensures medicines are taken at right times" },
            { bn: "পরিবারকে নিয়মিত আপডেট জানানো হবে", en: "Regular updates are shared with the family" },
        ],
    },
    4: {
        videoUrl: "",
        tagline: {
            bn: "সংকটের মুহূর্তে, আমরাই আপনার প্রথম ভরসা।",
            en: "In a crisis, we are your very first call.",
        },
        benefits: [
            { icon: "ambulance", bn: "দ্রুত অ্যাম্বুলেন্স সমন্বয়", en: "Rapid ambulance coordination" },
            { icon: "admit", bn: "হাসপাতালে ভর্তি ও ডকুমেন্টেশন সহায়তা", en: "Hospital admission & documentation support" },
            { icon: "attendant", bn: "অ্যাটেনডেন্ট সহায়তা সেবা", en: "Professional attendant service during emergency" },
            { icon: "update", bn: "পরিবারকে রিয়েল-টাইম আপডেট", en: "Real-time family updates during crisis" },
        ],
        steps: [
            { bn: "আমাদের ইমার্জেন্সি হটলাইনে কল করুন", en: "Call our 24/7 emergency hotline immediately" },
            { bn: "আমাদের টিম দ্রুত পরিস্থিতি মূল্যায়ন করবে", en: "Our team rapidly assesses the situation" },
            { bn: "অ্যাম্বুলেন্স ও মেডিকেল সাপোর্ট পাঠানো হবে", en: "Ambulance & medical support is dispatched" },
            { bn: "হাসপাতালে ভর্তি সম্পন্ন হওয়া পর্যন্ত আমরা সঙ্গে থাকব", en: "We stay until full hospital admission is complete" },
        ],
    },
    5: {
        videoUrl: "",
        tagline: {
            bn: "দৈনন্দিন ছোট প্রয়োজনে, একজন বিশ্বস্ত সঙ্গী।",
            en: "A trusted companion for every daily need.",
        },
        benefits: [
            { icon: "shopping", bn: "বাজার ও প্রয়োজনীয় কেনাকাটায় সহায়তা", en: "Assistance with grocery & essential shopping" },
            { icon: "transport", bn: "ব্যাংক, মার্কেট ও আত্মীয় বাড়িতে নিরাপদ যাতায়াত", en: "Safe transport to bank, market & relatives" },
            { icon: "verified", bn: "ব্যাকগ্রাউন্ড-চেকড সহকারী", en: "Background-checked & verified assistants" },
            { icon: "independence", bn: "স্বাধীনতা ও স্বনির্ভরতা বজায় রাখতে সহায়তা", en: "Helping maintain independence & mobility" },
        ],
        steps: [
            { bn: "প্রয়োজনের তালিকা বা গন্তব্য জানান", en: "Share the list of needs or destination" },
            { bn: "আমরা উপযুক্ত সহকারী নির্ধারণ করব", en: "We assign the right verified assistant" },
            { bn: "নির্ধারিত সময়ে সহকারী প্রিয়জনের কাছে পৌঁছাবে", en: "Assistant arrives at the scheduled time" },
            { bn: "কাজ সম্পন্ন হয়ে প্রিয়জনকে নিরাপদে ঘরে ফিরিয়ে দেওয়া হবে", en: "Task completed & loved one returned home safely" },
        ],
    },
    6: {
        videoUrl: "",
        tagline: {
            bn: "বার্ধক্যের একাকীত্বে, একজন আন্তরিক বন্ধু।",
            en: "In the loneliness of old age, a genuinely caring friend.",
        },
        benefits: [
            { icon: "company", bn: "গল্প করা ও মানসম্পন্ন সময় কাটানো", en: "Meaningful conversation & quality companionship" },
            { icon: "reading", bn: "বই, পত্রিকা পড়ে শোনানো", en: "Reading books, newspapers aloud to them" },
            { icon: "counseling", bn: "পেশাদার কাউন্সেলিং সংযোগ", en: "Connection to professional counseling" },
            { icon: "hobby", bn: "শখ ও আগ্রহভিত্তিক কার্যক্রমে সহায়তা", en: "Support for hobbies & interest-based activities" },
        ],
        steps: [
            { bn: "প্রিয়জনের পছন্দ ও ব্যক্তিত্ব সম্পর্কে আমাদের জানান", en: "Tell us about their personality & preferences" },
            { bn: "আমরা সর্বোচ্চ মানানসই একজন কম্পেনিয়ন নির্বাচন করব", en: "We match them with the most suitable companion" },
            { bn: "নির্ধারিত সময়ে কম্পেনিয়ন তাদের সঙ্গে থাকবে", en: "Companion visits at scheduled times" },
            { bn: "পরিবারকে নিয়মিত মানসিক স্বাস্থ্যের আপডেট দেওয়া হবে", en: "Family receives regular mental wellness updates" },
        ],
    },
};

// ── Trust stats ──────────────────────────────────────────────────────────────
const trustStats = [
    { icon: Users, bn: "৫০০+ পরিবার", en: "500+ Families" },
    { icon: Shield, bn: "১০০% ভেরিফাইড", en: "100% Verified" },
    { icon: Clock, bn: "২৪/৭ সহায়তা", en: "24/7 Support" },
    { icon: Heart, bn: "৫+ বছরের অভিজ্ঞতা", en: "5+ Years of Care" },
];

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

    const serviceId = parseInt(id, 10);
    const service = servicesData.items.find(s => s.id === serviceId);
    const extended = serviceExtendedData[serviceId];

    if (!service || !extended) return notFound();

    const IconComponent = iconMap[service.icon] || Activity;
    const hasVideo = !!extended.videoUrl;

    return (
        <div className="flex-1 flex flex-col w-full bg-white dark:bg-gray-950 min-h-screen">

            {/* ── Section 1: Cinematic Hero ─────────────────────────────── */}
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

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="max-w-4xl"
                    >
                        {/* Service name */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
                            {lang === "en" ? service.title.en : service.title.bn}
                        </h1>

                        {/* Tagline */}
                        <p className="text-xl md:text-2xl text-white/70 leading-relaxed max-w-2xl mb-10 font-medium">
                            {lang === "en" ? extended.tagline.en : extended.tagline.bn}
                        </p>

                        {/* Hero CTAs */}
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="tel:+8801700000000"
                                className="inline-flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 hover:shadow-emerald-500/50"
                            >
                                <PhoneCall size={20} />
                                {lang === "en" ? "Call Now" : "এখনই কল করুন"}
                            </a>
                            <button
                                onClick={handleBookClick}
                                className="inline-flex items-center gap-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold px-8 py-4 rounded-xl transition-all shadow-lg hover:-translate-y-0.5"
                            >
                                <MessageCircle size={20} />
                                {lang === "en" ? "Book Service" : "বুকিং দিন"}
                            </button>
                            {hasVideo && (
                                <button
                                    onClick={() => setVideoOpen(true)}
                                    className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl border border-white/20 transition-all hover:-translate-y-0.5"
                                >
                                    <Play size={20} className="fill-white" />
                                    {lang === "en" ? "Watch Video" : "ভিডিও দেখুন"}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2 z-10"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                >
                    <span className="text-xs uppercase tracking-widest font-medium">
                        {lang === "en" ? "Scroll" : "স্ক্রল করুন"}
                    </span>
                    <ChevronDown size={20} />
                </motion.div>
            </section>



            {/* ── Section 3: Service Overview + Unique Benefits ────────────── */}
            <section className="py-20 md:py-28 bg-white dark:bg-gray-950 relative overflow-hidden">
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-emerald-50 dark:bg-emerald-900/5 blur-3xl pointer-events-none" />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                        {/* Left: Overview */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold text-sm mb-6 border border-emerald-200 dark:border-emerald-800">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                {lang === "en" ? "Service Overview" : "সেবার বিস্তারিত"}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                                {lang === "en" ? service.title.en : service.title.bn}
                            </h2>
                            <div className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/10 dark:to-gray-900 rounded-2xl p-7 border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
                                <p className="text-lg text-gray-700 dark:text-gray-300 leading-[1.9] font-medium">
                                    {lang === "en" ? service.description.en : service.description.bn}
                                </p>
                            </div>

                            {/* How It Delivers steps */}
                            <div className="mt-10 space-y-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                    {lang === "en" ? "How It Works" : "কীভাবে কাজ করে"}
                                </h3>
                                {extended.steps.map((step, idx) => (
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
                            className="lg:sticky lg:top-32"
                        >
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                {lang === "en" ? "What You'll Get" : "আপনি পাবেন"}
                            </h3>
                            <div className="space-y-4">
                                {extended.benefits.map((benefit, idx) => (
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
                                        {lang === "en" ? "Need this service?" : "এই সেবাটি প্রয়োজন?"}
                                    </h4>
                                    <p className="text-emerald-100 text-sm mb-6 font-medium">
                                        {lang === "en"
                                            ? "Call us now for a free consultation."
                                            : "বিনামূল্যে পরামর্শের জন্য এখনই কল করুন।"}
                                    </p>
                                    <div className="flex flex-col gap-3">
                                        <a
                                            href="tel:+8801700000000"
                                            className="w-full flex items-center justify-center gap-2 bg-white text-emerald-700 font-bold py-3.5 px-6 rounded-xl hover:bg-emerald-50 transition-all shadow-md"
                                        >
                                            <PhoneCall size={18} />
                                            {lang === "en" ? "Call Now" : "কল করুন"}
                                        </a>
                                        <button
                                            onClick={handleBookClick}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-3 rounded-xl transition shadow-lg shadow-emerald-500/20"
                                        >
                                            <MessageCircle size={18} />
                                            {lang === "en" ? "Book Service" : "বুকিং দিন"}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Section 4: Video / How We Deliver ───────────────────────── */}
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
                            {lang === "en" ? "See It In Action" : "সেবাটি দেখুন"}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            {lang === "en" ? "How We Deliver This Service" : "আমরা কীভাবে এই সেবা দিই"}
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

                        {/* Video Player */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            {hasVideo ? (
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 aspect-video border border-white/10">
                                    <iframe
                                        src={`${extended.videoUrl}?autoplay=0&rel=0&modestbranding=1`}
                                        title={service.title.en}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                        loading="lazy"
                                    />
                                </div>
                            ) : (
                                /* Video placeholder — thumbnail + play button */
                                <button
                                    onClick={() => setVideoOpen(true)}
                                    className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 group cursor-pointer block"
                                    aria-label="Play service video"
                                >
                                    <Image
                                        src={service.image}
                                        alt={service.title.en}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-gray-950/60 group-hover:bg-gray-950/50 transition-colors" />
                                    {/* Play button */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-20 h-20 rounded-full bg-emerald-500/90 flex items-center justify-center shadow-2xl shadow-emerald-500/40 group-hover:scale-110 transition-all duration-300">
                                            <Play size={34} className="fill-white text-white translate-x-0.5" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                                        <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 text-white text-sm font-medium">
                                            {lang === "en" ? "▶ Watch how we work" : "▶ আমাদের কাজ দেখুন"}
                                        </div>
                                    </div>
                                </button>
                            )}
                            {/* Glow effect */}
                            <div className="absolute -inset-4 bg-emerald-500/10 rounded-3xl blur-2xl -z-10 pointer-events-none" />
                        </motion.div>

                        {/* Steps */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-6"
                        >
                            {extended.steps.map((step, idx) => (
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
                                            {idx + 1}
                                        </div>
                                        {idx < extended.steps.length - 1 && (
                                            <div className="w-0.5 h-8 bg-emerald-900/60 mt-2" />
                                        )}
                                    </div>
                                    <div className="pb-4">
                                        <p className="text-white/80 font-medium leading-relaxed group-hover:text-white transition-colors">
                                            {lang === "en" ? step.en : step.bn}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}

                            <a
                                href="tel:+8801700000000"
                                className="inline-flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-xl transition-all mt-4 shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 group"
                            >
                                <PhoneCall size={18} />
                                {lang === "en" ? "Start Today" : "আজই শুরু করুন"}
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* ── Section 5: Testimonial Spotlight ────────────────────────── */}
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
                            {lang === "en" ? "Client Stories" : "পরিবারের অভিজ্ঞতা"}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                            {lang === "en" ? "What Families Say" : "পরিবারগুলো কী বলে"}
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonialData.items.map((t, idx) => (
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

            {/* ── Section 6: Final CTA Banner ──────────────────────────────── */}
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
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                            {lang === "en"
                                ? "Ready to get started?"
                                : "শুরু করতে প্রস্তুত?"}
                        </h2>
                        <p className="text-lg text-white/60 mb-10 font-medium">
                            {lang === "en"
                                ? "Our team is available 24/7. Reach out and we'll take care of the rest."
                                : "আমাদের টিম ২৪/৭ প্রস্তুত। একটা কল করুন, বাকিটা আমাদের দায়িত্ব।"}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:+8801700000000"
                                className="inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-10 py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 text-lg"
                            >
                                <PhoneCall size={22} />
                                {lang === "en" ? "Call Now: +880 1700-000000" : "কল করুন: +৮৮০ ১৭০০-০০০০০০"}
                            </a>
                            <Link
                                href="/#contact"
                                className="inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-10 py-4 rounded-xl border border-white/20 transition-all hover:-translate-y-0.5 text-lg"
                            >
                                <MessageCircle size={22} />
                                {lang === "en" ? "Send a Message" : "মেসেজ পাঠান"}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Sticky Mobile CTA Bar ────────────────────────────────────── */}
            <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
                <div className="bg-gray-900/95 backdrop-blur-md border-t border-emerald-900/40 px-4 py-3 flex items-center gap-3 shadow-2xl">
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm truncate">
                            {lang === "en" ? service.title.en : service.title.bn}
                        </p>
                        <p className="text-emerald-400 text-xs font-medium">
                            {lang === "en" ? "24/7 Support Available" : "২৪/৭ সহায়তা পাচ্ছেন"}
                        </p>
                    </div>
                    <a
                        href="tel:+8801700000000"
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shrink-0 shadow-lg"
                    >
                        <PhoneCall size={16} />
                        {lang === "en" ? "Call" : "কল করুন"}
                    </a>
                </div>
            </div>

            {/* ── Video Lightbox Modal ─────────────────────────────────────── */}
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
                                    {lang === "en" ? "Close" : "বন্ধ করুন"}
                                </span>
                            </button>

                            <div className="rounded-2xl overflow-hidden shadow-2xl aspect-video border border-white/10 bg-gray-900 flex items-center justify-center">
                                {hasVideo ? (
                                    <iframe
                                        src={`${extended.videoUrl}?autoplay=1&rel=0`}
                                        title={service.title.en}
                                        allow="autoplay; encrypted-media; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    />
                                ) : (
                                    <div className="text-center text-white/60 p-12">
                                        <Play size={48} className="mx-auto mb-4 text-emerald-400" />
                                        <p className="text-lg font-medium mb-2">
                                            {lang === "en" ? "Video Coming Soon" : "ভিডিও近শীঘ্রই আসছে"}
                                        </p>
                                        <p className="text-sm">
                                            {lang === "en"
                                                ? "In the meantime, call us to learn more."
                                                : "এই মুহূর্তে আমাদের কল করুন আরও জানতে।"}
                                        </p>
                                        <a
                                            href="tel:+8801700000000"
                                            className="inline-flex items-center gap-2 mt-6 bg-emerald-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-emerald-400 transition-all"
                                        >
                                            <PhoneCall size={18} />
                                            {lang === "en" ? "Call Us" : "কল করুন"}
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
                serviceId={serviceId}
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
