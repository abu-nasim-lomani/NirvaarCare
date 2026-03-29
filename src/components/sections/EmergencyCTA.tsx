"use client";

import { motion } from "framer-motion";
import { PhoneCall, ShieldAlert, Clock } from "lucide-react";
import { emergencyCtaData } from "@/constants";
import { useLang } from "@/context/LanguageContext";

export default function EmergencyCTA({ data }: { data?: any }) {
    const { lang } = useLang();
    const content = data && Object.keys(data).length > 0 ? data : emergencyCtaData;

    return (
        <section id="contact" className="relative py-16 md:py-20 bg-emerald-50 dark:bg-emerald-900 overflow-hidden">
            {/* Dark/Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/80 to-teal-50/80 dark:from-emerald-950/90 dark:to-slate-950/90 z-0"></div>
            
            {/* Abstract Glowing Orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-300/30 dark:bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="bg-white/60 dark:bg-white/10 backdrop-blur-lg border border-emerald-200 dark:border-white/20 rounded-[2rem] p-8 sm:p-10 text-center shadow-xl relative overflow-hidden"
                >
                    {/* Inner subtle glow */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

                    {/* Top Alert Icon */}
                    <div className="relative inline-flex items-center justify-center mb-6">
                        <div className="absolute inset-0 bg-red-500/20 dark:bg-red-500/30 rounded-full blur-xl"></div>
                        <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-white/10 border border-red-200 dark:border-white/20 flex items-center justify-center text-red-500 dark:text-red-400 relative z-10 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                            <ShieldAlert size={26} strokeWidth={1.5} />
                        </div>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-emerald-900 dark:text-white mb-4 leading-tight">
                        {lang === "en" ? content.title?.en : content.title?.bn}
                    </h2>
                    
                    <p className="text-emerald-700 dark:text-emerald-100/80 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
                        {lang === "en" ? content.description?.en : content.description?.bn}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        {/* Call Button */}
                        <a 
                            href={`tel:${content.phone || emergencyCtaData.phone}`}
                            className="group relative inline-flex items-center justify-center gap-2.5 bg-red-500 hover:bg-red-600 text-white px-7 sm:px-9 py-3.5 rounded-full font-bold text-sm sm:text-base transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] overflow-hidden"
                        >
                            <PhoneCall size={18} className="animate-pulse" />
                            <span>{lang === "en" ? content.buttonText?.en : content.buttonText?.bn}</span>
                        </a>

                        {/* Status Indicator */}
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-200/90 font-medium px-5 py-3 rounded-full bg-emerald-100 dark:bg-white/5 border border-emerald-200 dark:border-white/10">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-xs sm:text-sm tracking-wide uppercase">
                                {lang === "en" ? "24/7 Available" : "২৪/৭ খোলা আছে"}
                            </span>
                        </div>
                    </div>

                </motion.div>
            </div>
        </section>
    );
}
