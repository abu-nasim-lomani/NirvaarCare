"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
    LayoutDashboard, User, Activity, FileText, CreditCard, 
    CalendarCheck, Watch, Package, Stethoscope, 
    ClipboardList, Pill, Building2, LogOut, HeartPulse, Menu, X 
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useLang } from "@/context/LanguageContext";

// Define menu structures per role
const roleMenus = {
    customer: [
        { icon: LayoutDashboard, label: { en: "Overview", bn: "ওভারভিউ" }, href: "customer" },
        { icon: CalendarCheck, label: { en: "My Bookings", bn: "আমার বুকিং" }, href: "customer/bookings" },
        { icon: FileText, label: { en: "Medical Reports", bn: "মেডিকেল রিপোর্ট" }, href: "customer/reports" },
        { icon: CreditCard, label: { en: "Billing & Plans", bn: "বিলিং ও প্ল্যান" }, href: "customer/billing" },
    ],
    caregiver: [
        { icon: LayoutDashboard, label: { en: "Duty Roster", bn: "ডিউটি রোস্টার" }, href: "caregiver" },
        { icon: ClipboardList, label: { en: "Patient Updates", bn: "রোগীর অবস্থা" }, href: "caregiver/updates" },
        { icon: Watch, label: { en: "Time Tracker", bn: "সময় ট্র্যাকার" }, href: "caregiver/tracker" },
    ],
    doctor: [
        { icon: LayoutDashboard, label: { en: "Consultations", bn: "পরামর্শ" }, href: "doctor" },
        { icon: User, label: { en: "Patient Queue", bn: "রোগীদের তালিকা" }, href: "doctor/queue" },
        { icon: Pill, label: { en: "Prescriptions", bn: "প্রেসক্রিপশন" }, href: "doctor/prescriptions" },
    ],
    partner: [
        { icon: Building2, label: { en: "Partner Portal", bn: "পার্টনার পোর্টাল" }, href: "partner" },
        { icon: Package, label: { en: "Service Requests", bn: "সার্ভিস রিকোয়েস্ট" }, href: "partner/requests" },
        { icon: Activity, label: { en: "Upload Results", bn: "রেজাল্ট আপলোড" }, href: "partner/results" },
    ]
};

export default function DashboardSidebar({ 
    isOpen, 
    setIsOpen 
}: { 
    isOpen: boolean, 
    setIsOpen: (v: boolean) => void 
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { lang } = useLang();
    const supabase = createClient();
    
    // Extract role from URL segment, fallback to empty array if not found
    const currentRole = (pathname.split('/')[2] as keyof typeof roleMenus) || 'customer';
    const menuItems = roleMenus[currentRole] || roleMenus.customer;

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/auth/login");
        router.refresh();
    };

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`
                    self-start fixed lg:sticky lg:top-20 left-0 z-40 h-[100dvh] lg:h-[calc(100vh-5rem)] bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none overflow-hidden
                    ${isOpen ? "w-72 translate-x-0 top-0 z-50" : "w-0 lg:w-72 -translate-x-full lg:translate-x-0"}
                `}
            >
                {/* User Welcome Area instead of Logo */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/40 dark:to-teal-800/40 border border-emerald-200/50 dark:border-emerald-700/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <User size={20} className="shrink-0" />
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium block">
                                {lang === "en" ? "Welcome back" : "স্বাগতম"}
                            </span>
                            <span className="text-sm font-bold text-gray-900 dark:text-white capitalize tracking-wide block truncate max-w-[140px]">
                                {currentRole}
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 no-scrollbar">
                    {menuItems.map((item, idx) => {
                        const Icon = item.icon;
                        const href = `/dashboard/${item.href}`;
                        const isActive = pathname === href || pathname.startsWith(`${href}/`);
                        
                        return (
                            <Link key={idx} href={href} onClick={() => setIsOpen(false)}>
                                <span className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium text-sm group relative overflow-hidden ${
                                    isActive 
                                        ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10" 
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-gray-900 dark:hover:text-white"
                                }`}>
                                    {isActive && (
                                        <motion.div layoutId="sidebar-active" className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-full" />
                                    )}
                                    <Icon size={20} className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                    <span>{lang === "en" ? item.label.en : item.label.bn}</span>
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800/50">
                    <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium text-sm group"
                    >
                        <LogOut size={20} className="group-hover:scale-110 transition-transform duration-200 group-hover:-translate-x-1" />
                        {lang === "en" ? "Sign Out securely" : "নিরাপদে লগ আউট করুন"}
                    </button>
                </div>
            </aside>
        </>
    );
}
