"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { aboutData } from "@/constants";
import { useLang } from "@/context/LanguageContext";

export default function AboutUs({ data }: { data?: any }) {
    const { lang } = useLang();
    const content = data && Object.keys(data).length > 0 ? data : aboutData;

    return (
        <section id="about" className="py-20 md:py-28 overflow-hidden bg-white dark:bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch">
                    
                    {/* Sticky Image Section (Left) */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="w-full lg:w-5/12 h-full lg:sticky lg:top-32 self-start"
                    >
                        {/* Main large image */}
                        <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                key={content.image1 || aboutData.image1}
                                src={content.image1 || aboutData.image1}
                                alt="Caregiver helping an elderly person"
                                fill
                                unoptimized={true}
                                className="object-cover transition-transform duration-700 hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            {/* Gradient Overlay for elegance */}
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-transparent to-transparent"></div>
                            
                            {/* Integrated Simple Badge (Bottom left inside image) */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-xl flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-2xl shadow-inner">
                                        {lang === "en" ? content.yearsExperience?.en : content.yearsExperience?.bn}
                                    </div>
                                    <div>
                                        <p className="text-base font-bold text-white leading-tight">
                                            {lang === "en" ? content.experienceText?.en?.split(" ")[0] : content.experienceText?.bn?.split(" ")[0]}
                                            <br />
                                            {lang === "en" ? content.experienceText?.en?.split(" ")[1] : content.experienceText?.bn?.split(" ")[1]}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Scrolling Content Section (Right) */}
                    <div className="w-full lg:w-7/12 flex flex-col pt-4 lg:pt-0 pb-10">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Section Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold text-sm mb-6">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                {lang === "en" ? content.badge?.en : content.badge?.bn}
                            </div>

                            {/* Tagline / Big Title */}
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-[1.2]">
                                {lang === "en" ? content.tagline?.en : content.tagline?.bn}
                            </h2>

                            {/* Vision and Mission Cards (Duo) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                                {/* Vision */}
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-800/50">
                                    <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center">🎯</div>
                                        {lang === "en" ? content.vision?.title?.en : content.vision?.title?.bn}
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                        {lang === "en" ? content.vision?.text?.en : content.vision?.text?.bn}
                                    </p>
                                </div>
                                {/* Mission */}
                                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-800/50">
                                    <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center">🚀</div>
                                        {lang === "en" ? content.mission?.title?.en : content.mission?.title?.bn}
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                        {lang === "en" ? content.mission?.text?.en : content.mission?.text?.bn}
                                    </p>
                                </div>
                            </div>

                            {/* The Origin Story First Paragraph Only */}
                            <div className="space-y-6 text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-[1.8] mb-10">
                                {content.philosophyParagraphs?.slice(0, 1).map((para: any, idx: number) => (
                                    <motion.p 
                                        key={idx}
                                        initial={{ opacity: 0, y: 15 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                                        className={idx === 0 ? "font-medium text-gray-800 dark:text-gray-200 text-base sm:text-lg border-l-4 border-emerald-500 pl-4" : ""}
                                    >
                                        {lang === "en" ? para.en : para.bn}
                                    </motion.p>
                                ))}
                            </div>

                            {/* Read More CTA Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4 }}
                            >
                                <a 
                                    href="/about-us"
                                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-full font-bold transition-all hover:scale-105 shadow-xl shadow-emerald-600/20"
                                >
                                    <span>{lang === "en" ? "Read Our Full Story" : "সম্পূর্ণ গল্পটি পড়ুন"}</span>
                                    <ArrowRight size={20} />
                                </a>
                            </motion.div>
                        </motion.div>
                    </div>
                    
                </div>
            </div>
        </section>
    );
}
