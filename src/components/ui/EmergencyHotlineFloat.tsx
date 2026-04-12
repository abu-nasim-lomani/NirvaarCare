"use client";

import { motion } from "framer-motion";
import { PhoneCall } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

export default function EmergencyHotlineFloat() {
    const { lang } = useLang();

    return (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[9999]">
            <motion.a
                href="tel:+8801700000000"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center justify-center gap-2 px-4 py-3 md:px-5 md:py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all relative overflow-hidden"
            >
                {/* Ping animation behind icon */}
                <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300 origin-center rounded-full" />
                
                <div className="relative flex items-center justify-center">
                    <span className="absolute inset-0 animate-ping rounded-full bg-white/40 opacity-75 hidden md:block" />
                    <PhoneCall size={16} className="text-white relative z-10 md:w-5 md:h-5" />
                </div>
                
                <span className="text-xs md:text-sm font-bold tracking-wide relative z-10">
                    {lang === "en" ? "Emergency Hotline" : "জরুরি হটলাইন"}
                </span>
            </motion.a>
        </div>
    );
}
