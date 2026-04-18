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
const TwitterIcon = ({ size = 24 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
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
    const platformIconMap: Record<string, React.FC<any>> = {
        Facebook: FacebookIcon,
        WhatsApp: WhatsappIcon,
        YouTube: YoutubeIcon,
        Instagram: InstagramIcon,
        LinkedIn: LinkedinIcon,
        Twitter: TwitterIcon
    };

    // Helper to extract the actual src URL if the user pastes an entire <iframe> snippet
    const extractIframeSrc = (input: string) => {
        if (!input) return "";
        const match = input.match(/src=["'](.*?)["']/);
        return match ? match[1] : input;
    };

    const defaultSocialLinks = [
        { platform: "Facebook", href: "https://www.facebook.com/nirvaarcare" },
        { platform: "WhatsApp", href: "https://wa.me/8801715599599" },
        { platform: "YouTube", href: "https://www.youtube.com/@NirvaarCare" },
        { platform: "Instagram", href: "https://www.instagram.com/nirvaarcare" },
    ];
    
    const socialLinksData = Array.isArray(content.socialLinks) && content.socialLinks.length > 0 ? content.socialLinks : defaultSocialLinks;

    const defaultOffices = [
        {
            name: { en: "Dhaka Office", bn: "ঢাকা অফিস" },
            phone: "01715-599599",
            email: "support@nirvaarcare.com",
            address: { en: "Gulshan 1, Dhaka, Bangladesh", bn: "গুলশান ১, ঢাকা, বাংলাদেশ" },
            mapUrl: "https://maps.app.goo.gl/9y5LzJqPnvWvxKmb8",
            mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14605.105260105747!2d90.4042838!3d23.7744317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7715a40c603%3A0xec01cd75f33139f5!2sGulshan%201%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1714500000000!5m2!1sen!2sbd"
        },
        {
            name: { en: "Sydney Office", bn: "সিডনি অফিস" },
            phone: "+61 400 000 000",
            email: "sydney@nirvaarcare.com",
            address: { en: "Sydney CBD, NSW, Australia", bn: "সিডনি সিবিডি, এনএসডব্লিউ, অস্ট্রেলিয়া" },
            mapUrl: "https://maps.app.goo.gl/SydneyLinkToReplace",
            mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.871239851726!2d151.20786011520935!3d-33.86713898065604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ae401e8b983f%3A0x5017d681632ccc0!2sSydney%20CBD%2C%20NSW%2C%20Australia!5e0!3m2!1sen!2sau!4v1714500000000!5m2!1sen!2sau"
        }
    ];

    const officesData = Array.isArray(content.offices) && content.offices.length > 0 ? content.offices : defaultOffices;

    return (
        <footer id="contact" className="relative bg-gray-100 dark:bg-slate-950 text-gray-600 dark:text-slate-300 overflow-hidden pt-24 pb-8 border-t border-gray-200 dark:border-slate-900/50">
            
            {/* Cinematic Background Orbs */}
            <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-emerald-200/30 dark:bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-200/20 dark:bg-teal-900/10 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Main Grid: Custom Layout to give more width to cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1.5fr_1.5fr] gap-8 lg:gap-12 mb-16">
                    
                    {/* Brand Column (Smaller Part) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6 md:col-span-2 lg:col-span-1"
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
                            {socialLinksData.map((link: any, idx: number) => {
                                const Icon = platformIconMap[link.platform] || FacebookIcon;
                                return (
                                    <a 
                                        key={idx}
                                        href={link.href} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-white hover:bg-emerald-600 hover:border-emerald-500 transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] hover:-translate-y-1"
                                    >
                                        <Icon size={18} />
                                    </a>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Dynamic Office Branches */}
                    {officesData.map((office: any, idx: number) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 + (idx * 0.1) }}
                            className="bg-white/5 dark:bg-slate-900/40 backdrop-blur-md border border-gray-200 dark:border-slate-800/80 rounded-2xl p-6 md:p-8 hover:bg-white/10 dark:hover:bg-slate-900/60 transition-colors duration-300 group"
                        >
                            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-5">
                                {lang === "en" ? office.name?.en : office.name?.bn}
                            </h3>
                            
                            <div className="flex flex-col gap-4">
                                <ul className="space-y-3">
                                    {office.phone && (
                                        <li className="flex items-center gap-3 text-gray-500 dark:text-slate-400 group/item">
                                            <Phone size={15} className="text-emerald-500 flex-shrink-0" />
                                            <span className="text-sm font-medium group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400 transition-colors">{office.phone}</span>
                                        </li>
                                    )}
                                    {office.email && (
                                        <li className="flex items-center gap-3 text-gray-500 dark:text-slate-400 group/item">
                                            <Mail size={15} className="text-emerald-500 flex-shrink-0" />
                                            <span className="text-sm font-medium group-hover/item:text-emerald-600 dark:group-hover/item:text-emerald-400 transition-colors break-all">{office.email}</span>
                                        </li>
                                    )}
                                    {office.address && (
                                        <li className="flex items-start gap-3 text-gray-500 dark:text-slate-400 group/item">
                                            <MapPin size={15} className="mt-0.5 text-emerald-500 flex-shrink-0" />
                                            <span className="text-sm leading-relaxed group-hover/item:text-gray-800 dark:group-hover/item:text-slate-200 transition-colors">
                                                {lang === "en" ? office.address.en : office.address.bn}
                                            </span>
                                        </li>
                                    )}
                                </ul>

                                {/* Map Box */}
                                {office.mapEmbedUrl && (
                                    <a 
                                        href={office.mapUrl || "#"} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="block relative w-full h-32 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-slate-700 group/map"
                                    >
                                        <iframe 
                                            src={extractIframeSrc(office.mapEmbedUrl)} 
                                            className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] border-0 pointer-events-none filter grayscale opacity-70 group-hover/map:grayscale-0 group-hover/map:opacity-100 transition-all duration-500"
                                            loading="lazy" 
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover/map:bg-transparent transition-colors duration-300">
                                            <div className="bg-white/90 backdrop-blur-sm dark:bg-slate-900/90 text-emerald-600 dark:text-emerald-400 p-1.5 rounded-lg shadow-sm transform scale-90 opacity-0 group-hover/map:scale-100 group-hover/map:opacity-100 transition-all duration-300">
                                                <ArrowRight size={16} />
                                            </div>
                                        </div>
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}

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
