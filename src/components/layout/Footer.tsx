"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Phone, Mail, MapPin, ArrowRight, HeartPulse } from "lucide-react";
import { footerData } from "@/constants";
import { useLang } from "@/context/LanguageContext";
import { useSiteConfig } from "@/context/SiteConfigContext";

// Custom SVG Icons for Brands
const FacebookIcon = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const TwitterIcon = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const InstagramIcon = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);
const LinkedinIcon = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
);

export default function Footer({ data }: { data?: any }) {
    const { lang } = useLang();
    const { sections } = useSiteConfig();
    
    // Auto pickup footer custom data globally even if not passed explicitly 
    const footerSection = sections?.find(s => s.component_id === "Footer");
    const activeData = data || footerSection?.content_data;
    const content = activeData && Object.keys(activeData).length > 0 ? activeData : footerData;

    // Map string keys from data to actual Lucide components
    const iconMap: Record<string, React.FC<any>> = {
        Phone,
        Mail,
        MapPin
    };

    return (
        <footer className="relative bg-gray-100 dark:bg-slate-950 text-gray-600 dark:text-slate-300 overflow-hidden pt-24 pb-8 border-t border-gray-200 dark:border-slate-900/50">
            
            {/* Cinematic Background Orbs */}
            <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-emerald-200/30 dark:bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-200/20 dark:bg-teal-900/10 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
                    
                    {/* Brand Column */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <Link href="/" className="inline-flex items-center gap-2 group">
                            {content.logoUrl ? (
                                <img src={content.logoUrl} alt="NirvaarCare Logo" className="h-10 w-auto object-contain drop-shadow-sm" />
                            ) : (
                                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform duration-300">
                                    <HeartPulse size={28} strokeWidth={2.5} />
                                </div>
                            )}
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 tracking-tight">
                                Nirvaar
                                <span className="font-light text-gray-800 dark:text-slate-100">Care</span>
                            </span>
                        </Link>
                        
                        <p className="text-gray-500 dark:text-slate-400 leading-relaxed text-xs sm:text-sm pr-4">
                            {lang === "en" ? content.brandDesc?.en : content.brandDesc?.bn}
                        </p>

                        <div className="flex items-center gap-4">
                            {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon].map((Icon, idx) => (
                                <a 
                                    key={idx}
                                    href="#" 
                                    className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-white hover:bg-emerald-600 hover:border-emerald-500 transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:-translate-y-1"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h3 className="text-gray-900 dark:text-white font-semibold text-sm mb-5">
                            {lang === "en" ? content.quickLinks?.title?.en : content.quickLinks?.title?.bn}
                        </h3>
                        <ul className="space-y-3">
                            {content.quickLinks?.links?.map((link: any, idx: number) => (
                                <li key={idx}>
                                    <Link 
                                        href={link.href}
                                        className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-300 group"
                                    >
                                        <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                        {lang === "en" ? link.en : link.bn}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h3 className="text-gray-900 dark:text-white font-semibold text-sm mb-5">
                            {lang === "en" ? content.contactInfo?.title?.en : content.contactInfo?.title?.bn}
                        </h3>
                        <ul className="space-y-5">
                            {content.contactInfo?.items?.map((item: any, idx: number) => {
                                const Icon = iconMap[item.icon];
                                const text = typeof item.text === 'object' 
                                    ? (lang === "en" ? item.text.en : item.text.bn) 
                                    : item.text;

                                return (
                                    <li key={idx} className="flex items-start gap-4 text-gray-500 dark:text-slate-400 group">
                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-colors duration-300 flex-shrink-0">
                                            {Icon && <Icon size={18} />}
                                        </div>
                                        <span className="mt-1.5 text-xs sm:text-sm group-hover:text-gray-800 dark:group-hover:text-slate-200 transition-colors duration-300">{text}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </motion.div>

                    {/* Newsletter */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h3 className="text-gray-900 dark:text-white font-semibold text-sm mb-4">
                            {lang === "en" ? "Newsletter" : "নিউজলেটার"}
                        </h3>
                        <p className="text-gray-500 dark:text-slate-400 text-xs mb-4">
                            {lang === "en" ? "Subscribe to our newsletter for health tips and latest updates." : "স্বাস্থ্য বিষয়ক টিপস এবং সর্বশেষ আপডেট পেতে আমাদের নিউজলেটার সাবস্ক্রাইব করুন।"}
                        </p>
                        <form className="relative" onSubmit={(e) => e.preventDefault()}>
                            <input 
                                type="email" 
                                placeholder={lang === "en" ? "Your email address" : "আপনার ইমেইল অ্যাড্রেস"}
                                className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-800 rounded-full px-6 py-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all pr-14"
                            />
                            <button 
                                type="submit"
                                className="absolute right-2 top-2 bottom-2 w-10 flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                            >
                                <ArrowRight size={18} />
                            </button>
                        </form>
                    </motion.div>

                </div>

                {/* Bottom Copyright */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="pt-8 border-t border-gray-200 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 dark:text-slate-500 text-sm"
                >
                    <p>{lang === "en" ? content.copyright?.en : content.copyright?.bn}</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-emerald-400 transition-colors">{lang === "en" ? "Privacy Policy" : "প্রাইভেসি পলিসি"}</Link>
                        <Link href="#" className="hover:text-emerald-400 transition-colors">{lang === "en" ? "Terms of Service" : "শর্তাবলী"}</Link>
                    </div>
                </motion.div>

            </div>
        </footer>
    );
}
