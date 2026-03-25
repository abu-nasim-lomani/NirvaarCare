"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { testimonialData } from "@/constants";
import { useLang } from "@/context/LanguageContext";

export default function Testimonials() {
    const { lang } = useLang();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 30 },
        visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" as const } 
        },
    };

    return (
        <section id="testimonials" className="py-20 md:py-28 bg-white dark:bg-slate-900 overflow-hidden relative">
            
            {/* Soft Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-50/60 dark:bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-50/60 dark:bg-teal-900/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Section Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-2xl mx-auto mb-16 lg:mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold text-sm mb-6 border border-emerald-200 dark:border-emerald-800">
                        {lang === "en" ? testimonialData.badge.en : testimonialData.badge.bn}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-[1.2]">
                        {lang === "en" ? testimonialData.title.en : testimonialData.title.bn}
                    </h2>
                </motion.div>

                {/* 3-Column Testimonials Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    {testimonialData.items.map((testimonial) => (
                        <motion.div 
                            key={testimonial.id}
                            variants={cardVariants}
                            className="bg-slate-50 dark:bg-gray-950 p-8 sm:p-10 rounded-[2rem] relative shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 dark:border-gray-800 flex flex-col group"
                        >
                            {/* Decorative Quote Mark */}
                            <div className="absolute top-8 right-8 text-emerald-200 dark:text-emerald-900/40 opacity-50 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                                <Quote size={60} strokeWidth={1} fill="currentColor" />
                            </div>

                            {/* Ratings */}
                            <div className="flex items-center gap-1 mb-6 relative z-10">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} size={18} fill="currentColor" className="text-amber-400" />
                                ))}
                            </div>

                            {/* Quote Text */}
                            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-6 flex-grow relative z-10 italic">
                                "{lang === "en" ? testimonial.quote.en : testimonial.quote.bn}"
                            </p>

                            {/* Author Info */}
                            <div className="flex items-center gap-4 mt-auto border-t border-gray-200 dark:border-gray-800 pt-6 relative z-10">
                                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-100 dark:border-emerald-900/50 shadow-md">
                                    <Image
                                        src={testimonial.image}
                                        alt={lang === "en" ? testimonial.name.en : testimonial.name.bn}
                                        fill
                                        className="object-cover"
                                        sizes="56px"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-base">
                                        {lang === "en" ? testimonial.name.en : testimonial.name.bn}
                                    </h4>
                                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                        {lang === "en" ? testimonial.role.en : testimonial.role.bn}
                                    </p>
                                </div>
                            </div>

                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
}
