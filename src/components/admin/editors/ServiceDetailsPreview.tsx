import { CheckCircle2, ChevronDown, MessageCircle, PhoneCall, Play, Users, Shield, Clock, Heart, ArrowRight } from "lucide-react";
import Image from "next/image";
import { testimonialData } from "@/constants";

export default function ServiceDetailsPreview({ service }: { service: any }) {
    if (!service) return <div className="p-8 text-center text-gray-500">Select a service to preview</div>;

    const extended = service.extended || { tagline: {}, benefits: [], steps: [] };

    return (
        <div className="w-full bg-white dark:bg-gray-950 flex flex-col relative pointer-events-none select-none">
            {/* Hero Section */}
            <section className="relative w-full min-h-[600px] flex flex-col justify-end pb-12 pt-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {service.image && (
                        <Image src={service.image} alt="Preview" fill className="object-cover" unoptimized />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-gray-900/40" />
                </div>
                
                <div className="w-full px-6 relative z-10">
                    <div className="max-w-4xl">
                        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
                            {service.title?.en || "Service Title"}
                        </h1>
                        <p className="text-lg text-white/70 leading-relaxed max-w-2xl mb-6">
                            {extended.tagline?.en || "Service tagline here"}
                        </p>
                        
                        <div className="flex flex-wrap gap-3">
                            <div className="inline-flex items-center gap-2 bg-emerald-500 text-white font-semibold px-6 py-3 rounded-lg text-sm">
                                <PhoneCall size={16} /> Call Now
                            </div>
                            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 font-semibold px-6 py-3 rounded-lg text-sm">
                                <MessageCircle size={16} /> Book Service
                            </div>
                            {extended.videoUrl && (
                                <div className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-6 py-3 rounded-lg text-sm border border-white/20">
                                    <Play size={16} className="fill-white" /> Watch Video
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Overview & Benefits */}
            <section className="py-12 bg-white dark:bg-gray-950 px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Overview */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 text-xs font-semibold mb-4">
                            Service Overview
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            {service.title?.en}
                        </h2>
                        <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl p-5 border border-emerald-100">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                                {extended.fullDescription?.en || service.description?.en || "Description goes here"}
                            </p>
                        </div>

                        {/* Steps */}
                        <div className="mt-8 space-y-4">
                            <h3 className="text-md font-bold text-gray-900 dark:text-white">How It Works</h3>
                            {extended.steps?.map((step: any, idx: number) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                                        {idx + 1}
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm pt-1">
                                        {step.en}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Benefits */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">What You'll Get</h3>
                        <div className="space-y-3">
                            {extended.benefits?.map((benefit: any, idx: number) => (
                                <div key={idx} className="flex gap-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 shadow-sm">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm pt-1">
                                        {benefit.en}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Deliveries */}
            <section className={`py-12 bg-gray-50 dark:bg-gray-900 border-y border-gray-100 ${(!extended.deliveries || extended.deliveries.length === 0) ? 'opacity-50' : ''}`}>
                <div className="px-6">
                    <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8 relative">
                        How We Deliver This Service
                        {(!extended.deliveries || extended.deliveries.length === 0) && (
                            <span className="absolute -top-3 -right-4 bg-orange-100 text-orange-600 text-[10px] px-2 py-1 rounded-full uppercase tracking-wider">Hidden (Add Points to Show)</span>
                        )}
                    </h2>
                    
                    {extended.deliveries && extended.deliveries.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {extended.deliveries.map((del: any, idx: number) => (
                                <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start gap-3">
                                    <CheckCircle2 className="text-emerald-500 w-5 h-5 shrink-0 mt-0.5" />
                                    <p className="text-sm text-gray-700">{del.en || "..."}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500 text-sm">
                            Add delivery points from the editor to see them here.
                        </div>
                    )}
                </div>
            </section>

            {/* Stories */}
            <section className="py-12 bg-emerald-50/50">
                <div className="px-6">
                    <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8 relative">
                        Client Stories 
                        {(!extended.stories || extended.stories.length === 0) && (
                            <span className="absolute -top-3 -right-4 bg-blue-100 text-blue-600 text-[10px] px-2 py-1 rounded-full uppercase tracking-wider">Using Global Fallback</span>
                        )}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {((extended.stories && extended.stories.length > 0) ? extended.stories : testimonialData.items).map((story: any, idx: number) => (
                            <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex gap-1 mb-3">
                                    {Array.from({ length: story.rating || 5 }).map((_, i) => (
                                        <span key={i} className="text-amber-400 text-sm">★</span>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-600 italic mb-4">"{story.quote?.en || "..."}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden relative border border-gray-300">
                                        {story.image && <Image src={story.image} alt="Avatar" fill className="object-cover" unoptimized />}
                                    </div>
                                    <p className="text-xs font-bold">{story.name?.en || "Name"}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
