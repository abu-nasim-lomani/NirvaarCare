"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { whyChooseData } from "@/constants";
import { useLang } from "@/context/LanguageContext";

export default function WhyChooseUs({ data }: { data?: any }) {
    const { lang } = useLang();
    const content = data && Object.keys(data).length > 0 ? data : whyChooseData;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    };

    return (
        <section id="why-choose-us" className="py-20 md:py-28 bg-slate-50 dark:bg-gray-950 overflow-hidden relative">
            
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-0 right-[10%] w-[400px] h-[400px] bg-emerald-100/50 dark:bg-emerald-900/10 rounded-full blur-[100px] opacity-60"></div>
                <div className="absolute bottom-[0%] left-[-5%] w-[500px] h-[500px] bg-teal-50/50 dark:bg-teal-900/10 rounded-full blur-[120px] opacity-60"></div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Section Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold text-sm mb-6 border border-emerald-200 dark:border-emerald-800">
                        <ShieldCheck size={16} />
                        {lang === "en" ? content.badge?.en : content.badge?.bn}
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-8">
                        {lang === "en" ? content.title?.en : content.title?.bn}
                    </h2>
                    
                    <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl leading-relaxed text-left md:text-center">
                        {lang === "en" ? content.subtitle?.en : content.subtitle?.bn}
                    </p>
                </motion.div>

                {/* Priorities List */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-800"
                >
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-8 border-b border-gray-100 dark:border-gray-800 pb-4">
                        {lang === "en" ? content.listTitle?.en : content.listTitle?.bn}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {content.features?.map((feature: any) => (
                            <motion.div key={feature.id} variants={itemVariants} className="flex items-start gap-4 group">
                                <div className="mt-1 flex-shrink-0 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                                    <CheckCircle2 size={18} strokeWidth={2.5} />
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 font-medium text-lg leading-snug pt-1">
                                    {lang === "en" ? feature.title?.en : feature.title?.bn}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
