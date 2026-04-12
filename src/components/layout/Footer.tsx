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
const InstagramIcon = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);
const YoutubeIcon = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.1c-.4 1.5-1.1 3.2-1.1 4.9s.7 3.4 1.1 4.9c.4 1.5 1.7 2.8 3.2 3.2 1.8.5 5.2.7 6.3.7s4.5-.2 6.3-.7c1.5-.4 2.8-1.7 3.2-3.2.4-1.5 1.1-3.2 1.1-4.9s-.7-3.4-1.1-4.9c-.4-1.5-1.7-2.8-3.2-3.2C16.5 3.2 13.1 3 12 3s-4.5.2-6.3.7C4.2 4.3 2.9 5.6 2.5 7.1z"/><polygon points="9.8 15.5 15.8 12 9.8 8.5 9.8 15.5"/></svg>
);
const WhatsappIcon = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
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

    const socialLinks = [
        { Icon: FacebookIcon, href: "https://www.facebook.com/nirvaarcare" },
        { Icon: InstagramIcon, href: "https://www.instagram.com/nirvaarcare" },
        { Icon: YoutubeIcon, href: "https://www.youtube.com/@NirvaarCare" },
        { Icon: WhatsappIcon, href: "https://wa.me/8801715599599" },
    ];

    return (
        <footer className="relative bg-gray-100 dark:bg-slate-950 text-gray-600 dark:text-slate-300 overflow-hidden pt-24 pb-8 border-t border-gray-200 dark:border-slate-900/50">
            
            {/* Cinematic Background Orbs */}
            <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-emerald-200/30 dark:bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-200/20 dark:bg-teal-900/10 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-16">
                    
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
                            {socialLinks.map(({ Icon, href }, idx) => (
                                <a 
                                    key={idx}
                                    href={href} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-white hover:bg-emerald-600 hover:border-emerald-500 transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:-translate-y-1"
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
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



                </div>

                {/* Bottom Copyright */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="pt-8 border-t border-gray-200 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 dark:text-slate-500 text-sm"
                >
                    <p className="w-full text-center">{lang === "en" ? content.copyright?.en : content.copyright?.bn}</p>
                </motion.div>

            </div>
        </footer>
    );
}
