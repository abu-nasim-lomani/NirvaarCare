"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, Quote } from "lucide-react";
import Link from "next/link";
import { aboutData } from "@/constants";
import { useLang } from "@/context/LanguageContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function AboutUsPage() {
    const { lang } = useLang();

    return (
        <>
            <Navbar />
            <main className="flex-1 flex flex-col w-full bg-white dark:bg-gray-950 relative overflow-hidden isolate pt-20">
                
                {/* Background floating gradient elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-emerald-50/50 dark:bg-emerald-900/10 blur-3xl opacity-70"></div>
                    <div className="absolute top-[40%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-50/50 dark:bg-blue-900/10 blur-3xl opacity-70"></div>
                </div>

                {/* Premium Full-Width Hero Section */}
                <section className="relative w-full h-[60vh] min-h-[500px] flex flex-col justify-end pb-20">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={aboutData.image1}
                            alt="Nirvaar Care Philosophy"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/60 to-gray-900/30"></div>
                    </div>

                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
                        <Link 
                            href="/#about" 
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium mb-8 transition-colors backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full border border-white/20 w-fit"
                        >
                            <ArrowLeft size={18} />
                            {lang === "en" ? "Back to Home" : "হোমপেজে ফিরে যান"}
                        </Link>

                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 font-semibold text-sm mb-6 backdrop-blur-md">
                                {lang === "en" ? aboutData.badge.en : aboutData.badge.bn}
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] max-w-4xl tracking-tight">
                                {lang === "en" ? aboutData.tagline.en : aboutData.tagline.bn}
                            </h1>
                        </motion.div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-20 md:py-28">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        
                        {/* The Full Origin Story in an elegant paper-like card */}
                        <div className="relative">
                            {/* Decorative Quote Mark */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="absolute -top-10 -left-6 md:-left-12 text-emerald-100 dark:text-emerald-900/50 z-0"
                            >
                                <Quote size={120} className="rotate-180" strokeWidth={1} />
                            </motion.div>

                            <div className="relative z-10 space-y-10 text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                {aboutData.philosophyParagraphs.map((para, idx) => (
                                    <motion.p 
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.6, delay: idx * 0.15 }}
                                        className={idx === 0 
                                            ? "text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-white leading-snug tracking-tight" 
                                            : ""
                                        }
                                    >
                                        {lang === "en" ? para.en : para.bn}
                                    </motion.p>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <motion.div 
                            initial={{ opacity: 0, scaleX: 0 }}
                            whileInView={{ opacity: 1, scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-transparent rounded-full my-20"
                        ></motion.div>

                        {/* Vision and Mission Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                            {/* Vision */}
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="group relative bg-white dark:bg-gray-900 rounded-3xl p-10 border border-gray-100 dark:border-gray-800 shadow-xl hover:shadow-2xl hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-500 overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500 group-hover:bg-emerald-400 transition-colors"></div>
                                <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform duration-500">
                                    🎯
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                    {lang === "en" ? aboutData.vision.title.en : aboutData.vision.title.bn}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                                    {lang === "en" ? aboutData.vision.text.en : aboutData.vision.text.bn}
                                </p>
                            </motion.div>

                            {/* Mission */}
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="group relative bg-white dark:bg-gray-900 rounded-3xl p-10 border border-gray-100 dark:border-gray-800 shadow-xl hover:shadow-2xl hover:blue-200 dark:hover:border-blue-800 transition-all duration-500 overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-2 h-full bg-blue-500 group-hover:bg-blue-400 transition-colors"></div>
                                <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform duration-500">
                                    🚀
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                    {lang === "en" ? aboutData.mission.title.en : aboutData.mission.title.bn}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                                    {lang === "en" ? aboutData.mission.text.en : aboutData.mission.text.bn}
                                </p>
                            </motion.div>
                        </div>

                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
