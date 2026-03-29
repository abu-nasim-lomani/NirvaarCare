"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
    Activity, Stethoscope, Pill, Ambulance, 
    ShoppingBag, HeartHandshake, ArrowLeft, 
    CheckCircle2, PhoneCall, CalendarCheck
} from "lucide-react";
import { servicesData } from "@/constants";
import { useLang } from "@/context/LanguageContext";

const iconMap: Record<string, React.FC<any>> = {
    Activity,
    Stethoscope,
    Pill,
    Ambulance,
    ShoppingBag,
    HeartHandshake,
};

// Generic mock benefits to make the details page look premium
const genericBenefits = [
    { bn: "অভিজ্ঞ এবং প্রশিক্ষিত কেয়ারগিভার", en: "Experienced and Trained Caregivers" },
    { bn: "২৪/৭ নিরবচ্ছিন্ন সেবা ও সহায়তা", en: "24/7 Uninterrupted Service & Support" },
    { bn: "বিশেষজ্ঞ চিকিৎসকদের তত্ত্বাবধান", en: "Supervision by Expert Doctors" },
    { bn: "রোগীর অবস্থার নিয়মিত আপডেট", en: "Regular Updates on Patient's Condition" }
];

export default function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { lang } = useLang();

    const serviceId = parseInt(id, 10);
    const service = servicesData.items.find(s => s.id === serviceId);

    if (!service) {
        return notFound();
    }

    const IconComponent = iconMap[service.icon] || Activity;

    return (
        <div className="flex-1 flex flex-col w-full bg-white dark:bg-gray-950 min-h-screen">
            
            {/* Premium Hero Section */}
            <section className="relative w-full h-[55vh] min-h-[450px] flex flex-col justify-end pb-16 pt-28">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={service.image}
                        alt={service.title.en}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 xl:from-gray-950 via-gray-900/80 to-gray-900/40"></div>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
                    <Link 
                        href="/#services" 
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium mb-8 transition-colors backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full border border-white/20 w-fit hover:bg-white/20"
                    >
                        <ArrowLeft size={18} />
                        {lang === "en" ? "Back to Services" : "সার্ভিস পেইজে ফিরে যান"}
                    </Link>

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col gap-4"
                    >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 flex items-center justify-center text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                            <IconComponent size={40} strokeWidth={1.5} />
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mt-2 max-w-4xl">
                            {lang === "en" ? service.title.en : service.title.bn}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 md:py-24 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute -top-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-emerald-50 dark:bg-emerald-900/5 blur-3xl opacity-70 pointer-events-none z-0"></div>
                
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                        
                        {/* Left Content / Main Details */}
                        <div className="lg:col-span-8 space-y-12">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="prose prose-lg dark:prose-invert prose-emerald max-w-none"
                            >
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                    {lang === "en" ? "Service Overview" : "সেবাটির বিস্তারিত"}
                                </h2>
                                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium bg-white/50 dark:bg-slate-900/50 p-6 sm:p-8 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm backdrop-blur-sm">
                                    {lang === "en" ? service.description.en : service.description.bn}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    {lang === "en" ? "Key Benefits" : "মূল সুবিধাসমূহ"}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {genericBenefits.map((benefit, idx) => (
                                        <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-colors">
                                            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                                                {lang === "en" ? benefit.en : benefit.bn}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Sidebar / Action Card */}
                        <div className="lg:col-span-4">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="sticky top-32 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-xl overflow-hidden p-1"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-slate-900 z-0"></div>
                                
                                <div className="relative z-10 p-6 sm:p-8 flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 mx-auto shadow-inner">
                                        <CalendarCheck size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                        {lang === "en" ? "Need this service?" : "এই সেবাটি প্রয়োজন?"}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-8 font-medium">
                                        {lang === "en" 
                                            ? "Contact us today to book this service for your loved ones." 
                                            : "আপনার প্রিয়জনের জন্য সেবাটি গ্রহণ করতে আজই কল করুন।"
                                        }
                                    </p>

                                    <div className="w-full space-y-3">
                                        <a href="tel:+8801700000000" className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                                            <PhoneCall size={20} />
                                            <span>
                                                {lang === "en" ? "Call Now" : "কল করুন"}
                                            </span>
                                        </a>
                                        <Link href="/#contact" className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 font-semibold py-4 px-6 rounded-xl transition-all border border-gray-200 dark:border-slate-700">
                                            {lang === "en" ? "Send a Message" : "মেসেজ পাঠান"}
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                        
                    </div>
                </div>
            </section>
        </div>
    );
}
