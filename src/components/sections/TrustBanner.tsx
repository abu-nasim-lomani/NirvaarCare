"use client";

import { motion } from "framer-motion";
import { Heart, ShieldCheck, Zap, Stethoscope } from "lucide-react";
import { trustBannerData } from "@/constants";
import { useLang } from "@/context/LanguageContext";

// Map string icon names to Lucide components
const iconMap: Record<string, React.ElementType> = {
    heart: Heart,
    "shield-check": ShieldCheck,
    zap: Zap,
    stethoscope: Stethoscope,
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2, // Wait for hero slider a bit
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { type: "spring" as const, stiffness: 100, damping: 15 } 
    },
};

export default function TrustBanner() {
    const { lang } = useLang();

    return (
        <section 
            className="w-full bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/50 relative z-20"
            aria-label="Trust metrics"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 lg:gap-12 max-w-5xl mx-auto"
                >
                    {trustBannerData.map((item) => {
                        const IconComponent = iconMap[item.icon];
                        return (
                            <motion.div 
                                key={item.id} 
                                variants={itemVariants}
                                className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4 group"
                            >
                                {/* Icon wrapper */}
                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white dark:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-800 shadow-sm flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-emerald-500 transition-all duration-300">
                                    <IconComponent size={24} strokeWidth={2} />
                                </div>
                                
                                {/* Text Content */}
                                <div>
                                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                                        {lang === "en" ? item.enNumber : item.number}
                                    </h3>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight mb-1">
                                        {lang === "en" ? item.text.en : item.text.bn}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-[140px] sm:max-w-none mx-auto sm:mx-0">
                                        {lang === "en" ? item.sub.en : item.sub.bn}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
