"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, PhoneCall, Heart, Sun, Moon, Globe } from "lucide-react";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useSiteConfig } from "@/context/SiteConfigContext";

export default function Navbar({ data, isPreview = false }: { data?: any, isPreview?: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { lang, toggleLang } = useLang();
    const { isDark, toggleTheme } = useTheme();
    const { sections, isLoading } = useSiteConfig();
    const navItems = sections.filter(s => s.is_visible && s.show_in_nav);

    const navbarSection = sections.find(s => s.component_id === "Navbar");
    const content = data || navbarSection?.content_data || {};

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`${isPreview ? "relative !bg-gray-900 border-none rounded-2xl overflow-hidden mt-4" : "fixed"} w-full z-50 top-0 transition-all duration-500 ${
                scrolled && !isPreview
                    ? "bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-lg border-b border-gray-100 dark:border-gray-800"
                    : (isPreview ? "" : "bg-transparent border-b border-transparent")
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2 group cursor-pointer">
                        {content.logoUrl ? (
                            <img src={content.logoUrl} alt="NirvaarCare Logo" className="h-10 w-auto object-contain drop-shadow-sm" />
                        ) : (
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md group-hover:shadow-emerald-400/40 transition-shadow duration-300">
                                <Heart size={18} className="text-white" fill="white" />
                            </div>
                        )}
                        <span className="text-2xl font-bold tracking-tight">
                            <span className={scrolled && !isPreview ? "text-emerald-700 dark:text-emerald-400" : (isPreview ? "text-emerald-400" : "text-emerald-300")}>
                                {lang === "en" ? "Nirvaar" : "নির্ভার"}
                            </span>
                            <span className={scrolled && !isPreview ? "text-gray-800 dark:text-gray-100" : "text-white"}>
                                {lang === "en" ? " Care" : " কেয়ার"}
                            </span>
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden xl:flex items-center gap-1">
                        {!isLoading && navItems.map((link) => (
                            <Link key={link.id} href={link.nav_href}>
                                <span className={`relative px-3.5 py-2 font-medium text-sm transition-colors duration-300 group rounded-lg block whitespace-nowrap ${
                                    scrolled
                                        ? "text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-emerald-900/20"
                                        : "text-white/90 hover:text-white hover:bg-white/10"
                                }`}>
                                    {lang === "en" ? link.nav_label_en : link.nav_label_bn}
                                    <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                                </span>
                            </Link>
                        ))}
                    </div>

                    {/* Right side controls */}
                    <div className="hidden xl:flex items-center gap-2">

                        {/* Language Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={toggleLang}
                            title={lang === "en" ? "Switch to Bangla" : "Switch to English"}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 border border-transparent relative ${
                                scrolled
                                    ? "text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/70 dark:hover:bg-emerald-900/20 hover:border-emerald-200 dark:hover:border-emerald-800"
                                    : "text-white/80 hover:text-white hover:bg-white/15 hover:border-white/20"
                            }`}
                        >
                            <AnimatePresence mode="wait">
                                {lang === "en" ? (
                                    <motion.span
                                        key="globe-en"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex flex-col items-center leading-none"
                                    >
                                        <Globe size={15} />
                                        <span className="text-[8px] font-bold mt-0.5 tracking-wide">EN</span>
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="globe-bn"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex flex-col items-center leading-none"
                                    >
                                        <Globe size={15} />
                                        <span className="text-[8px] font-bold mt-0.5 tracking-wide">বাং</span>
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        {/* Dark / Light Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={toggleTheme}
                            title={lang === "en" ? "Toggle theme" : "থিম পরিবর্তন"}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 border border-transparent ${
                                scrolled
                                    ? "text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/70 dark:hover:bg-emerald-900/20 hover:border-emerald-200 dark:hover:border-emerald-800"
                                    : "text-white/80 hover:text-white hover:bg-white/15 hover:border-white/20"
                            }`}
                        >
                            <AnimatePresence mode="wait">
                                {isDark ? (
                                    <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <Sun size={18} />
                                    </motion.span>
                                ) : (
                                    <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                                        <Moon size={18} />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        {/* CTA */}
                        <motion.a
                            href={content.emergencyUrl || "tel:+8801700000000"}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg shadow-emerald-600/25 hover:shadow-emerald-500/40 transition-all duration-300 ml-1"
                        >
                            <PhoneCall size={16} />
                            <span>{lang === "en" ? (content.emergencyText?.en || "Emergency") : (content.emergencyText?.bn || "জরুরি সেবা")}</span>
                        </motion.a>
                    </div>

                    {/* Mobile hamburger (shown below xl) */}
                    <div className="xl:hidden flex items-center gap-2">
                        <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={toggleLang}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${
                                scrolled
                                    ? "text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                    : "text-white/80 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            <AnimatePresence mode="wait">
                                {lang === "en" ? (
                                    <motion.span key="m-globe-en" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="flex flex-col items-center leading-none">
                                        <Globe size={14} />
                                        <span className="text-[7px] font-bold mt-0.5">EN</span>
                                    </motion.span>
                                ) : (
                                    <motion.span key="m-globe-bn" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} className="flex flex-col items-center leading-none">
                                        <Globe size={14} />
                                        <span className="text-[7px] font-bold mt-0.5">বাং</span>
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={toggleTheme}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${
                                scrolled
                                    ? "text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                    : "text-white/80 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </motion.button>

                        <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={() => setIsOpen(!isOpen)}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors duration-200 ${
                                scrolled
                                    ? "bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400"
                                    : "bg-white/10 hover:bg-white/20 text-white"
                            }`}
                        >
                            {isOpen ? <X size={22} /> : <Menu size={22} />}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="md:hidden bg-white dark:bg-gray-950 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 overflow-hidden"
                    >
                        <div className="px-4 pt-3 pb-6 space-y-1">
                            {!isLoading && navItems.map((link, index) => (
                                <Link key={link.id} href={link.nav_href}>
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.06 }}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/70 dark:hover:bg-emerald-900/20 rounded-xl transition-all duration-200 cursor-pointer"
                                    >
                                        {lang === "en" ? link.nav_label_en : link.nav_label_bn}
                                    </motion.span>
                                </Link>
                            ))}
                            <div className="pt-3">
                                <motion.a
                                    href={content.emergencyUrl || "tel:+8801700000000"}
                                    whileTap={{ scale: 0.97 }}
                                    className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-emerald-600/20"
                                >
                                    <PhoneCall size={17} />
                                    <span>{lang === "en" ? (content.emergencyTextMobile?.en || "Emergency Hotline") : (content.emergencyTextMobile?.bn || "জরুরি সেবা (হটলাইন)")}</span>
                                </motion.a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}