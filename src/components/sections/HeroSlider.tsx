"use client";

import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import { Autoplay, EffectFade } from "swiper/modules";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { PhoneCall, ArrowRight, ChevronRight } from "lucide-react";
import { heroSlides } from "@/constants";
import { useLang } from "@/context/LanguageContext";

import "swiper/css";
import "swiper/css/effect-fade";

const AUTOPLAY_DELAY = 5500;

// ── Animation Variants ────────────────────────────────────────────────────────

const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.16 } },
    exit:   { transition: { staggerChildren: 0.08, staggerDirection: -1 } },
};

const itemVariants: Variants = {
    hidden:  { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0,  transition: { duration: 0.6, ease: "easeOut" } },
    exit:    { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn"  } },
};

// Background gradient colours per slide
const bgColours = [
    "bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-800",
    "bg-gradient-to-br from-teal-950 via-teal-900 to-cyan-900",
    "bg-gradient-to-br from-cyan-950 via-slate-900 to-teal-900",
    "bg-gradient-to-br from-red-950 via-red-900 to-rose-900",
    "bg-gradient-to-br from-amber-950 via-amber-900 to-yellow-900",
    "bg-gradient-to-br from-violet-950 via-violet-900 to-purple-900",
    "bg-gradient-to-br from-slate-950 via-gray-900 to-slate-800",
];

// Ken Burns keyframes — alternating zoom + subtle drift per slide
const kenBurnsClasses = [
    "animate-ken-burns-1",
    "animate-ken-burns-2",
    "animate-ken-burns-3",
    "animate-ken-burns-4",
    "animate-ken-burns-1",
    "animate-ken-burns-3",
    "animate-ken-burns-2",
];

export default function HeroSlider() {
    const { lang }          = useLang();
    const prefersReduced    = useReducedMotion();
    const [activeIndex, setActiveIndex]     = useState(0);
    const [progress, setProgress]           = useState(0);
    const [isPaused, setIsPaused]           = useState(false);
    const swiperRef = useRef<SwiperType | null>(null);
    const rafRef    = useRef<number | null>(null);
    const startRef  = useRef<number | null>(null);

    // ── Progress bar animation ──────────────────────────────────────────────
    useEffect(() => {
        if (prefersReduced || isPaused) return;

        setProgress(0);
        startRef.current = performance.now();

        const tick = (now: number) => {
            const elapsed = now - (startRef.current ?? now);
            setProgress(Math.min(elapsed / AUTOPLAY_DELAY, 1));
            if (elapsed < AUTOPLAY_DELAY) {
                rafRef.current = requestAnimationFrame(tick);
            }
        };
        rafRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [activeIndex, isPaused, prefersReduced]);

    const handleMouseEnter = () => {
        setIsPaused(true);
        swiperRef.current?.autoplay.pause();
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    const handleMouseLeave = () => {
        setIsPaused(false);
        swiperRef.current?.autoplay.resume();
    };

    return (
        <section
            id="home"
            className="relative w-full h-[100dvh] overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-label="Hero slider"
        >
            <Swiper
                modules={[Autoplay, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                autoplay={{ delay: AUTOPLAY_DELAY, disableOnInteraction: false }}
                speed={1200}
                loop
                onSwiper={(sw) => { swiperRef.current = sw; }}
                onSlideChange={(sw) => setActiveIndex(sw.realIndex)}
                className="w-full h-full" style={{ height: "100dvh" }}
            >
                {heroSlides.map((slide, idx) => (
                    <SwiperSlide key={slide.id}>

                        {/* ── Background: real image + gradient fallback ── */}
                        <div className="absolute inset-0 overflow-hidden">
                            {/* Gradient fallback (always visible as base) */}
                            <div className={`absolute inset-0 ${bgColours[idx % bgColours.length]}`} />
                            {/* Real image — gracefully hidden if file missing */}
                            <Image
                                src={slide.imageBg}
                                alt={`${lang === "en" ? slide.badge.en : slide.badge.bn} background`}
                                fill
                                priority={idx === 0}
                                sizes="100vw"
                                className={`object-cover object-center ${
                                    !prefersReduced ? kenBurnsClasses[idx % kenBurnsClasses.length] : ""
                                }`}
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                        </div>

                        {/* ── Gradient overlay ──────────────────────────── */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.10)_0%,_transparent_60%)]" />

                        {/* ── Text Content ─────────────────────────────── */}
                        <div className="relative z-10 h-[100dvh] flex items-center">
                            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-24 pb-20 w-full">
                                <AnimatePresence mode="wait">
                                    {activeIndex === idx && (
                                        <motion.div
                                            key={`slide-${slide.id}-${lang}`}
                                            variants={prefersReduced ? undefined : containerVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            className="max-w-2xl"
                                        >
                                            {/* Badge */}
                                            <motion.div variants={prefersReduced ? undefined : itemVariants}>
                                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-semibold tracking-wider uppercase backdrop-blur-sm mb-3">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                    {lang === "en" ? slide.badge.en : slide.badge.bn}
                                                </span>
                                            </motion.div>

                                            <motion.h1
                                                variants={prefersReduced ? undefined : itemVariants}
                                                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-snug mb-3"
                                            >
                                                {(lang === "en" ? slide.headline.en : slide.headline.bn)
                                                    .split("\n")
                                                    .map((line, li) => (
                                                        <span key={li} className="block">
                                                            {line.split(" ").map((word, wi) => (
                                                                <motion.span
                                                                    key={wi}
                                                                    variants={prefersReduced ? undefined : {
                                                                        hidden:  { opacity: 0, y: 14 },
                                                                        visible: { opacity: 1, y: 0, transition: { duration: 0.45, delay: (li * 6 + wi) * 0.05, ease: "easeOut" } },
                                                                        exit:    { opacity: 0, transition: { duration: 0.2 } },
                                                                    }}
                                                                    className="inline-block mr-[0.25em]"
                                                                >
                                                                    {word}
                                                                </motion.span>
                                                            ))}
                                                        </span>
                                                    ))}
                                            </motion.h1>

                                            {/* Sub-headline */}
                                            <motion.p
                                                variants={prefersReduced ? undefined : itemVariants}
                                                className="text-xs sm:text-sm lg:text-base text-white/75 leading-relaxed mb-3 max-w-xl"
                                            >
                                                {lang === "en" ? slide.sub.en : slide.sub.bn}
                                            </motion.p>

                                            {/* Trust badge */}
                                            <motion.p
                                                variants={prefersReduced ? undefined : itemVariants}
                                                className="text-white/55 text-[11px] sm:text-xs mb-5 font-medium"
                                            >
                                                {lang === "en" ? slide.trust.en : slide.trust.bn}
                                            </motion.p>

                                            {/* CTA Buttons */}
                                            <motion.div
                                                variants={prefersReduced ? undefined : itemVariants}
                                                className="flex flex-wrap gap-3 sm:gap-4"
                                            >
                                                {/* Primary */}
                                                <Link href={slide.primaryCTA.href}>
                                                    <motion.span
                                                        whileHover={{ scale: 1.04 }}
                                                        whileTap={{ scale: 0.97 }}
                                                        className="group inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-5 py-2.5 rounded-full shadow-xl shadow-emerald-900/40 transition-colors duration-300 cursor-pointer text-sm"
                                                    >
                                                        {lang === "en" ? slide.primaryCTA.en : slide.primaryCTA.bn}
                                                        <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                                                    </motion.span>
                                                </Link>

                                                {/* Secondary — hidden on xs, shown sm+ */}
                                                <Link href={slide.secondaryCTA.href} className="hidden sm:block">
                                                    <motion.span
                                                        whileHover={{ scale: 1.04, backgroundColor: "rgba(255,255,255,0.15)" }}
                                                        whileTap={{ scale: 0.97 }}
                                                        className="group inline-flex items-center gap-2 border border-white/40 bg-white/10 backdrop-blur-sm text-white font-semibold px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer text-sm"
                                                    >
                                                        {lang === "en" ? slide.secondaryCTA.en : slide.secondaryCTA.bn}
                                                        <ChevronRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                                                    </motion.span>
                                                </Link>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* ── Bottom bar: slide selector + progress + hotline ──────────── */}
            <div className="absolute bottom-0 left-0 right-0 z-20 px-6 sm:px-10 lg:px-16 pb-6 pt-10 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex items-end justify-between gap-4">

                    {/* Slide selector with progress bars */}
                    <div className="flex items-center gap-3">
                        {heroSlides.map((slide, idx) => (
                            <button
                                key={slide.id}
                                onClick={() => swiperRef.current?.slideTo(idx)}
                                aria-label={`Go to slide ${idx + 1}`}
                                className="group flex flex-col items-start gap-1.5 cursor-pointer"
                            >
                                {/* Slide number */}
                                <span className={`text-[10px] font-bold transition-colors duration-300 ${
                                    activeIndex === idx ? "text-emerald-400" : "text-white/30 group-hover:text-white/60"
                                }`}>
                                    0{idx + 1}
                                </span>
                                {/* Progress track */}
                                <div className="h-0.5 rounded-full overflow-hidden bg-white/20" style={{ width: activeIndex === idx ? 52 : 20 }}>
                                    <div
                                        className="h-full bg-emerald-400 rounded-full transition-none"
                                        style={{
                                            width: activeIndex === idx ? `${progress * 100}%` : "0%",
                                            transition: activeIndex === idx ? "none" : "width 0.3s ease",
                                        }}
                                    />
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Hotline pill */}
                    <motion.a
                        href="tel:+8801700000000"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/25 backdrop-blur-md text-white text-sm font-semibold hover:bg-white/20 transition-all"
                    >
                        <PhoneCall size={14} className="text-emerald-400" />
                        {lang === "en" ? "Emergency Hotline" : "জরুরি হটলাইন"}
                    </motion.a>
                </div>
            </div>
        </section>
    );
}
