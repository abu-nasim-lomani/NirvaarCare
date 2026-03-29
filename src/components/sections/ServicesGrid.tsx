"use client";

import { motion } from "framer-motion";
import { Activity, Stethoscope, Pill, Ambulance, ShoppingBag, HeartHandshake, ArrowRight } from "lucide-react";
import { servicesData } from "@/constants";
import { useLang } from "@/context/LanguageContext";
import Link from "next/link";

// Map string keys from data to actual Lucide components
const iconMap: Record<string, React.FC<any>> = {
    Activity,
    Stethoscope,
    Pill,
    Ambulance,
    ShoppingBag,
    HeartHandshake,
};

export default function ServicesGrid({ data }: { data?: any }) {
    const { lang } = useLang();
    const content = data && Object.keys(data).length > 0 ? data : servicesData;

    // Container variants for staggered animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            transition: { duration: 0.6, ease: "easeOut" as const } 
        },
    };

    return (
        <section id="services" className="py-20 md:py-28 bg-slate-50 dark:bg-gray-950 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-3xl mx-auto mb-16 relative z-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold text-sm mb-6 border border-emerald-200 dark:border-emerald-800">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        {lang === "en" ? content.badge?.en : content.badge?.bn}
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-[1.2]">
                        {lang === "en" ? content.title?.en : content.title?.bn}
                    </h2>
                </motion.div>

                {/* Services Grid (Premium Dark CSS-Only Style) */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    {content.items?.map((service: any) => {
                        const IconComponent = iconMap[service.icon] || Activity;
                        
                        return (
                            <motion.div 
                                key={service.id}
                                variants={cardVariants}
                                className="group relative h-auto min-h-[180px] sm:min-h-[200px] rounded-[1.5rem] overflow-hidden bg-white dark:bg-slate-900 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-gray-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-500/50 flex flex-col"
                            >
                                {/* Glowing Ambient Orb (Abstract Design) */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-100 dark:bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-200 dark:group-hover:bg-emerald-400/30 group-hover:scale-150 transition-all duration-700 ease-in-out"></div>
                                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-100 dark:bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-200 dark:group-hover:bg-blue-400/20 group-hover:scale-150 transition-all duration-700 ease-in-out"></div>
                                
                                {/* Deep Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-gray-50/80 dark:from-slate-900/90 dark:to-slate-800/80 z-0"></div>

                                {/* Dynamic Hover Gradient Border Fill */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50/50 dark:from-emerald-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                                
                                <Link href={`/services/${service.id}`} className="absolute inset-0 w-full h-full z-20" aria-label={`View details of ${service.title?.en || "Service"}`}></Link>

                                {/* Content Inside */}
                                <div className="relative p-5 sm:p-6 flex flex-col h-full z-10 text-gray-900 dark:text-white">
                                    {/* Top: Icon */}
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 dark:bg-white/5 backdrop-blur-md border border-emerald-100 dark:border-white/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)] dark:shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:text-white group-hover:bg-emerald-500 group-hover:border-emerald-400 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-all duration-500 mb-4 flex-shrink-0">
                                        {IconComponent && <IconComponent size={20} strokeWidth={2} className="sm:w-6 sm:h-6 w-5 h-5" />}
                                    </div>

                                    {/* Bottom: Text */}
                                    <div className="flex flex-col flex-grow justify-start">
                                        <h3 className="text-base sm:text-lg font-bold mb-1.5 text-gray-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-white transition-colors duration-300">
                                            {lang === "en" ? service.title.en : service.title.bn}
                                        </h3>
                                        
                                        <p className="text-gray-600 dark:text-slate-400 text-xs sm:text-sm leading-snug group-hover:text-gray-800 dark:group-hover:text-slate-200 transition-colors duration-300">
                                            {lang === "en" ? service.description.en : service.description.bn}
                                        </p>

                                        {/* Minimal CTA Arrow */}
                                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 mt-3">
                                            <span className="text-[10px] sm:text-xs uppercase tracking-wider">{lang === "en" ? "Explore" : "বিস্তারিত"}</span>
                                            <ArrowRight size={14} className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>



            </div>
        </section>
    );
}

