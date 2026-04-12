"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, PhoneCall, Heart, Sun, Moon, Globe, User, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import AuthModal from "@/components/auth/AuthModal";

export default function Navbar({ data, isPreview = false }: { data?: any, isPreview?: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const { lang, toggleLang } = useLang();
    const { isDark, toggleTheme } = useTheme();
    const pathname = usePathname();
    const { sections, isLoading } = useSiteConfig();
    const navItems = sections.filter(s => s.is_visible && s.show_in_nav);

    const navbarSection = sections.find(s => s.component_id === "Navbar");
    const content = data || navbarSection?.content_data || {};

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Auth state listener
    useEffect(() => {
        if (isPreview) return;
        const supabase = createClient();
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, [isPreview]);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setUser(null);
        setUserMenuOpen(false);
    };

    // Get display name from user metadata
    const displayName = user?.user_metadata?.full_name
        || user?.user_metadata?.name  // Google users
        || user?.email?.split("@")[0] // fallback
        || "User";

    // Get initials for the avatar circle
    const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

    const isDashboard = pathname?.includes('/dashboard') || false;
    const isDarkHeroPage = pathname === '/' || pathname?.startsWith('/services/');
    const effectiveScrolled = scrolled || isDashboard || !isDarkHeroPage;

    const iconBtnClass = (active: boolean) => active
        ? "text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/70 dark:hover:bg-emerald-900/20 hover:border-emerald-200 dark:hover:border-emerald-800"
        : "text-white/80 hover:text-white hover:bg-white/15 hover:border-white/20";

    return (
        <>
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`${isPreview ? "relative !bg-gray-900 border-none rounded-2xl overflow-hidden mt-4" : "fixed"} w-full z-50 top-0 transition-all duration-500 ${
                effectiveScrolled && !isPreview
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
                        <div className="flex flex-col leading-none">
                            <span className="text-2xl font-bold tracking-tight">
                                <span className={effectiveScrolled && !isPreview ? "text-emerald-700 dark:text-emerald-400" : (isPreview ? "text-emerald-400" : "text-emerald-300")}>
                                    {lang === "en" ? "Nirvaar" : "নির্ভার"}
                                </span>
                                <span className={effectiveScrolled && !isPreview ? "text-gray-800 dark:text-gray-100" : "text-white"}>
                                    {lang === "en" ? " Care" : " কেয়ার"}
                                </span>
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden xl:flex items-center gap-1">
                        {!isLoading && navItems.map((link) => (
                            <Link key={link.id} href={link.nav_href?.startsWith('#') ? `/${link.nav_href}` : link.nav_href || "#"}>
                                <span className={`relative px-3.5 py-2 font-medium text-[15px] transition-colors duration-300 group rounded-lg block whitespace-nowrap ${
                                    effectiveScrolled
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
                            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 border border-transparent relative ${iconBtnClass(effectiveScrolled && !isPreview)}`}
                        >
                            <AnimatePresence mode="wait">
                                {lang === "en" ? (
                                    <motion.span key="globe-en" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="flex flex-col items-center leading-none">
                                        <Globe size={15} />
                                        <span className="text-[8px] font-bold mt-0.5 tracking-wide">EN</span>
                                    </motion.span>
                                ) : (
                                    <motion.span key="globe-bn" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} className="flex flex-col items-center leading-none">
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
                            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 border border-transparent ${iconBtnClass(effectiveScrolled && !isPreview)}`}
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

                        {/* User Auth Section */}
                        {!isPreview && (
                            user ? (
                                // Logged-in: Avatar + Dropdown
                                <div className="relative">
                                    <motion.button
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.96 }}
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-full font-medium text-sm transition-all duration-200 border ml-1 ${
                                            effectiveScrolled
                                                ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                                                : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                                        }`}
                                    >
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                            {initials}
                                        </div>
                                        <span className="max-w-[100px] truncate">{displayName}</span>
                                        <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                                    </motion.button>

                                    {/* Dropdown Menu */}
                                    <AnimatePresence>
                                        {userMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50"
                                            >
                                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                                                    <p className="text-xs text-gray-500">Signed in as</p>
                                                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{displayName}</p>
                                                </div>
                                                <Link
                                                    href="/dashboard"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors border-b border-gray-100 dark:border-gray-800"
                                                >
                                                    <LayoutDashboard size={16} />
                                                    {lang === "en" ? "Dashboard" : "ড্যাশবোর্ড"}
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                >
                                                    <LogOut size={16} />
                                                    {lang === "en" ? "Sign Out" : "লগ আউট"}
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                // Not logged in: Login button only
                                <motion.button
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => setAuthModalOpen(true)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 border ml-1 ${
                                        effectiveScrolled
                                            ? "border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                            : "border-white/30 text-white hover:bg-white/10"
                                    }`}
                                >
                                    <User size={15} />
                                    {lang === "en" ? "Login" : "লগিন"}
                                </motion.button>
                            )
                        )}


                    </div>

                    {/* Mobile hamburger (shown below xl) */}
                    <div className="xl:hidden flex items-center gap-2">
                        <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={toggleLang}
                            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${
                                effectiveScrolled
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
                                effectiveScrolled
                                    ? "text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                    : "text-white/80 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                        </motion.button>

                        {/* Mobile user avatar */}
                        {!isPreview && user && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shadow">
                                {initials}
                            </div>
                        )}

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
                                <Link key={link.id} href={link.nav_href?.startsWith('#') ? `/${link.nav_href}` : link.nav_href || "#"}>
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.06 }}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center px-4 py-3 text-base font-medium transition-all duration-200 cursor-pointer text-gray-700 dark:text-gray-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/70 dark:hover:bg-emerald-900/20 rounded-xl"
                                    >
                                        {lang === "en" ? link.nav_label_en : link.nav_label_bn}
                                    </motion.span>
                                </Link>
                            ))}

                            {/* Mobile auth section */}
                            {!isPreview && (
                                <div className="pt-3 space-y-2">
                                    {user ? (
                                        <>
                                            <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold">
                                                    {initials}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{displayName}</p>
                                                    <p className="text-xs text-gray-500">Logged in</p>
                                                </div>
                                            </div>
                                            <Link
                                                href="/dashboard"
                                                onClick={() => setIsOpen(false)}
                                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl transition-colors"
                                            >
                                                <LayoutDashboard size={16} />
                                                {lang === "en" ? "Dashboard" : "ড্যাশবোর্ড"}
                                            </Link>
                                            <button
                                                onClick={() => { handleLogout(); setIsOpen(false); }}
                                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                            >
                                                <LogOut size={16} />
                                                {lang === "en" ? "Sign Out" : "লগ আউট"}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => { setAuthModalOpen(true); setIsOpen(false); }}
                                                className="w-full flex justify-center items-center gap-2 border border-emerald-400 text-emerald-600 dark:text-emerald-400 px-6 py-3 rounded-full font-semibold transition hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                            >
                                                <User size={17} />
                                                {lang === "en" ? "Login / Register" : "লগিন / নিবন্ধন"}
                                            </button>
                                            <motion.a
                                                href={content.emergencyUrl || "tel:+8801715599599"}
                                                whileTap={{ scale: 0.97 }}
                                                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-emerald-600/20"
                                            >
                                                <PhoneCall size={17} />
                                                <span>{lang === "en" ? (content.emergencyTextMobile?.en || "Emergency Hotline") : (content.emergencyTextMobile?.bn || "জরুরি সেবা (হটলাইন)")}</span>
                                            </motion.a>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>

        {/* Global Auth Modal */}
        <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            onSuccess={() => {
                setAuthModalOpen(false);
                window.location.href = "/dashboard";
            }}
        />
        </>
    );
}