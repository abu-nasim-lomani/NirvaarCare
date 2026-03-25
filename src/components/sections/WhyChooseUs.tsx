"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ShieldCheck, ActivitySquare, Eye, Clock } from "lucide-react";
import { whyChooseData } from "@/constants";
import { useLang } from "@/context/LanguageContext";

// Map string keys to Lucide components
const iconMap: Record<string, React.FC<any>> = {
    ShieldCheck,
    ActivityPulse: ActivitySquare, // Using ActivitySquare as a fallback for Pulse
    Eye,
    Clock,
};

export default function WhyChooseUs() {
    const { lang } = useLang();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: 30 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
    };

    return (
        <section id="why-choose-us" className="py-20 md:py-28 bg-slate-50 dark:bg-gray-950 overflow-hidden relative">
            
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] bg-emerald-100/50 dark:bg-emerald-900/10 rounded-full blur-[100px] opacity-60"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-[120px] opacity-60"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Section Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="mb-16 text-center max-w-3xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold text-sm mb-6 border border-emerald-200 dark:border-emerald-800">
                        {lang === "en" ? whyChooseData.badge.en : whyChooseData.badge.bn}
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-[1.2]">
                        {lang === "en" ? whyChooseData.title.en : whyChooseData.title.bn}
                    </h2>
                </motion.div>

                {/* Article/Blog Layout */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="max-w-3xl mx-auto space-y-6 sm:space-y-8 text-left"
                >
                    {whyChooseData.features.map((feature) => {
                        const IconComponent = iconMap[feature.icon];
                        
                        return (
                            <motion.div key={feature.id} variants={itemVariants}>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                                    <span className="text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                                        {IconComponent && <IconComponent size={20} strokeWidth={2.5} />}
                                    </span>
                                    {lang === "en" ? feature.title.en : feature.title.bn}
                                </h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base pl-8">
                                    {lang === "en" ? feature.description.en : feature.description.bn}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
