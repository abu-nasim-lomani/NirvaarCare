"use client";

import { motion } from "framer-motion";
import WhatWeDo from "@/components/sections/WhatWeDo";
import { servicesData, whyChooseData } from "@/constants";
import { useLang } from "@/context/LanguageContext";
import { 
    Activity, Stethoscope, Pill, Ambulance, ShoppingBag, HeartHandshake,
    CheckCircle2, ShieldCheck, Home, Search, FileText, Calendar, Video, Car, Users, User, Clock, Phone, Sun, Book, Heart, Truck
} from "lucide-react";

// Icon mapper for dynamic mapping based on constants
const getIcon = (name: string, size = 20, className = "") => {
    const iconMap: Record<string, any> = {
        Activity, Stethoscope, Pill, Ambulance, ShoppingBag, HeartHandshake,
        home: Home, search: Search, escort: Users, file: FileText,
        calendar: Calendar, video: Video, car: Car, user: User, 
        delivery: Truck, clock: Clock, phone: Phone, activity: Activity,
        ambulance: Ambulance, users: Users, shopping: ShoppingBag, 
        building: Home, shield: ShieldCheck, heart: Heart, book: Book, sun: Sun
    };
    const IconComponent = iconMap[name] || CheckCircle2;
    return <IconComponent size={size} className={className} />;
};

export default function WhatWeDoPage() {
    const { lang } = useLang();

    return (
        <main className="flex-1 w-full bg-slate-50 dark:bg-gray-950 font-sans mt-20 overflow-hidden">
            
            {/* 1. Hero Intro (Reusing the existing block) */}
            <div className="relative pt-12 pb-8 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/20 pointer-events-none"></div>
                <WhatWeDo hideButton={true} />
            </div>

            {/* 2. Detailed Services Breakdown */}
            <section className="py-20 lg:py-28 relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/50 dark:bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-20"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    
                    <div className="text-center mb-16">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
                        >
                            {lang === "en" ? servicesData.title.en : servicesData.title.bn}
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
                        >
                            {lang === "en" ? "Every step of the way, we provide specialized support categorized to meet the unique needs of your loved ones." : "আপনার প্রিয়জনের বিভিন্ন ধরনের প্রয়োজন অনুযায়ী আমাদের বিশেষায়িত সেবাসমূহ নিচে বিস্তারিত তুলে ধরা হলো:"}
                        </motion.p>
                    </div>

                    <div className="space-y-24">
                        {servicesData.items.map((service, idx) => (
                            <div key={service.id} className="relative group">
                                {/* Connecting line for desktop (timeline effect) */}
                                {idx !== servicesData.items.length - 1 && (
                                    <div className="hidden lg:block absolute left-[55px] top-[100px] bottom-[-100px] w-0.5 bg-gradient-to-b from-emerald-200 to-transparent dark:from-emerald-800 z-0"></div>
                                )}
                                
                                <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 relative z-10">
                                    
                                    {/* Left Sidebar (Sticky) */}
                                    <div className="lg:w-1/3 flex-shrink-0">
                                        <div className="sticky top-32">
                                            <motion.div 
                                                initial={{ opacity: 0, x: -30 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true, margin: "-100px" }}
                                                className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/40 dark:shadow-none overflow-hidden relative"
                                            >
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full pointer-events-none"></div>
                                                <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                                                    {getIcon(service.icon, 32)}
                                                </div>
                                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                                    {lang === "en" ? service.title.en : service.title.bn}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                                    {lang === "en" ? service.extended.tagline.en : service.extended.tagline.bn}
                                                </p>
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Right Content (Benefits List) */}
                                    <div className="lg:w-2/3">
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            {service.extended.benefits.map((benefit: any, bIdx: number) => (
                                                <motion.div
                                                    key={bIdx}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true, margin: "-50px" }}
                                                    transition={{ delay: bIdx * 0.1 }}
                                                    className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 hover:border-emerald-200 dark:hover:border-emerald-800/50 group/card"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover/card:scale-110 transition-transform">
                                                        {getIcon(benefit.icon, 20)}
                                                    </div>
                                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-[16px]">
                                                        {lang === "en" ? benefit.en : benefit.bn}
                                                    </p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Our Promise / Security Section (Why Choose Us) */}
            <section className="py-20 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 font-semibold text-sm mb-6 border border-teal-200 dark:border-teal-800">
                            <ShieldCheck size={16} />
                            {lang === "en" ? whyChooseData.badge.en : whyChooseData.badge.bn}
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                            {lang === "en" ? whyChooseData.title.en : whyChooseData.title.bn}
                        </h2>
                        
                        <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl leading-relaxed mb-6">
                            {lang === "en" ? whyChooseData.subtitle?.en : whyChooseData.subtitle?.bn}
                        </p>
                        
                        <p className="text-xl md:text-2xl font-semibold text-emerald-600 dark:text-emerald-400 mt-8 font-serif">
                            {lang === "en" ? "Honoring your trust is our core commitment." : "আপনার বিশ্বাসের মর্যাদা রাখাই আমাদের অঙ্গীকার।"}
                        </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-gray-950 rounded-3xl p-8 md:p-12 border border-gray-100 dark:border-gray-800">
                        <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">
                            {lang === "en" ? whyChooseData.listTitle?.en : whyChooseData.listTitle?.bn}
                        </h3>
                        
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {whyChooseData.features?.map((item, idx) => (
                                <motion.div 
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex items-start gap-4 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm"
                                >
                                    <div className="mt-1 w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400">
                                        <CheckCircle2 size={14} className="fill-emerald-500 text-white dark:text-gray-900" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 dark:text-white text-[16px] leading-[1.4]">
                                            {lang === "en" ? item.title.en : item.title.bn}
                                        </h4>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

        </main>
    );
}
