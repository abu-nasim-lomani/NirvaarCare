"use client";

import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

const defaultData = {
    badge: { bn: "আমরা যা করি", en: "What We Do" },
    title: { bn: "আপনার প্রিয়জনের যত্নে আমাদের প্রতিশ্রুতি", en: "Our Commitment to Caring for Your Loved Ones" },
    paragraphs: [
        {
            bn: "প্রিয় মানুষদের থেকে দূরে থাকা সহজ নয়। জীবনের প্রয়োজনে অনেকেই দেশের বাইরে বা ব্যস্ত শহরে থাকেন, কিন্তু মন সবসময় পড়ে থাকে বাবা-মা ও আপনজনদের কাছে। তারা কেমন আছেন, সময়মতো খাচ্ছেন কিনা, অসুস্থ হলে পাশে কেউ আছে কিনা - এই দুশ্চিন্তা যেন আপনাকে একা বহন করতে না হয়, সেই দায়িত্বই নেয় নির্ভার কেয়ার।",
            en: "Being away from your loved ones is never easy. Many people live abroad or in busy cities due to work or life commitments, yet their hearts remain close to their parents and family members. Concerns about whether they are eating on time, staying well, or receiving proper care during illness can often become a constant worry. Nirvaar Care is here to share that responsibility with you."
        },
        {
            bn: "আমরা শুধু একটি সেবা প্রদান করি না - আমরা চেষ্টা করি আপনার পরিবারের একজন হয়ে উঠতে। যত্ন, সম্মান ও আন্তরিকতার সাথে আমরা নিশ্চিত করি, আপনার প্রিয়জনরা সবসময় নিরাপদ, স্বস্তিতে এবং ভালো আছেন।",
            en: "We are not just a service provider — we strive to become a trusted extension of your family. With compassion, respect, and sincere care, we ensure that your loved ones remain safe, comfortable, and well cared for at all times."
        }
    ]
};

export default function WhatWeDo({ data, hideButton = false }: { data?: any; hideButton?: boolean }) {
    const { lang } = useLang();
    const content = data && Object.keys(data).length > 0 ? data : defaultData;

    return (
        <section id="what-we-do" className="py-20 md:py-28 bg-white dark:bg-slate-900 overflow-hidden relative">
            
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50/70 dark:bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-50/70 dark:bg-teal-900/10 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                
                {/* Section Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    className="mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 font-semibold text-sm mb-6 border border-emerald-200 dark:border-emerald-800">
                        <Heart size={14} className="fill-emerald-500 text-emerald-500" />
                        {lang === "en" ? content.badge?.en : content.badge?.bn}
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                        {lang === "en" ? content.title?.en : content.title?.bn}
                    </h2>
                </motion.div>

                {/* Content Paragraphs */}
                <div className="space-y-6">
                    {content.paragraphs?.map((p: any, idx: number) => (
                        <motion.p 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.1 * idx }}
                            className="text-gray-600 dark:text-gray-300 text-lg md:text-xl leading-relaxed md:leading-[1.8]"
                        >
                            {lang === "en" ? p.en : p.bn}
                        </motion.p>
                    ))}
                </div>

                {/* Details Button */}
                {!hideButton && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-12"
                    >
                        <Link 
                            href="/what-we-do"
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                        >
                            {lang === "en" ? "View Full Details" : "বিস্তারিত জানুন"}
                            <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                )}

            </div>
        </section>
    );
}
