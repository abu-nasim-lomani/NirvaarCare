"use client";

import { motion } from "framer-motion";
import { PhoneCall, ClipboardCheck, FileEdit, HeartHandshake } from "lucide-react";
import { processData } from "@/constants";
import { useLang } from "@/context/LanguageContext";

// Map string keys to Lucide components
const iconMap: Record<string, React.FC<any>> = {
    PhoneCall,
    ClipboardCheck,
    FileEdit,
    HeartHandshake,
};

export default function HowItWorks({ data }: { data?: any }) {
    const { lang } = useLang();
    const content = data && Object.keys(data).length > 0 ? data : processData;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
    };

    return (
        <section id="how-it-works" className="py-20 md:py-28 bg-white dark:bg-gray-950 overflow-hidden relative">
            
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-emerald-50/50 dark:bg-emerald-900/10 rounded-full blur-[100px] opacity-60"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-[120px] opacity-60"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Section Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold text-sm mb-6 border border-emerald-200 dark:border-emerald-800">
                        {lang === "en" ? content.badge?.en : content.badge?.bn}
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-[1.2]">
                        {lang === "en" ? content.title?.en : content.title?.bn}
                    </h2>
                </motion.div>

                {/* Steps Layout Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
                >
                    {/* Horizontal Connector Line (Hidden on Mobile) */}
                    <div className="hidden lg:block absolute top-[44px] left-[12%] right-[12%] h-[2px] bg-gray-200 dark:bg-gray-800 z-0">
                        {/* Animated gradient moving across the line */}
                        <motion.div 
                            initial={{ width: "0%" }}
                            whileInView={{ width: "100%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500"
                        ></motion.div>
                    </div>

                    {content.steps?.map((step: any, idx: number) => {
                        const IconComponent = iconMap[step.icon] || PhoneCall;
                        
                        return (
                            <motion.div 
                                key={step.id} 
                                variants={itemVariants}
                                className="relative z-10 flex flex-col items-center text-center group"
                            >
                                {/* Connector line for Mobile/Tablet */}
                                {idx !== content.steps?.length - 1 && (
                                    <div className="lg:hidden absolute top-20 bottom-[-20px] left-1/2 w-[2px] bg-gradient-to-b from-emerald-500/50 to-transparent -translate-x-1/2 z-[-1]"></div>
                                )}

                                {/* Step Number & Icon Container */}
                                <div className="relative mb-6">
                                    <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-900 shadow-xl border border-gray-100 dark:border-gray-800 flex items-center justify-center relative z-10 group-hover:-translate-y-2 transition-transform duration-500 ease-out">
                                        <div className="absolute inset-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500">
                                            {IconComponent && <IconComponent size={28} strokeWidth={2} />}
                                        </div>
                                    </div>
                                    
                                    {/* Small floating step number */}
                                    <div className="absolute -top-2 -right-2 w-8 h-8 text-sm rounded-full bg-blue-600 text-white font-bold flex items-center justify-center border-4 border-white dark:border-gray-950 shadow-md z-20 group-hover:scale-110 transition-transform duration-300">
                                        {lang === "en" ? step.id : ["১", "২", "৩", "৪"][idx]}
                                    </div>
                                </div>

                                {/* Text Content */}
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                                    {lang === "en" ? step.title.en : step.title.bn}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed px-2 lg:px-4">
                                    {lang === "en" ? step.description.en : step.description.bn}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>

            </div>
        </section>
    );
}
