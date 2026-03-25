"use client";

import dynamic from "next/dynamic";
import TrustBanner from "@/components/sections/TrustBanner";
import AboutUs from "@/components/sections/AboutUs";
import ServicesGrid from "@/components/sections/ServicesGrid";
import HowItWorks from "@/components/sections/HowItWorks";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Testimonials from "@/components/sections/Testimonials";
import EmergencyCTA from "@/components/sections/EmergencyCTA";

const HeroSlider = dynamic(() => import("@/components/sections/HeroSlider"), {
    ssr: false,
    loading: () => (
        <div className="min-h-[90vh] bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-800 animate-pulse" />
    ),
});

export default function Home() {
    return (
        <main className="flex-1 flex flex-col w-full">
            <HeroSlider />
            <TrustBanner />
            <AboutUs />
            <ServicesGrid />
            <HowItWorks />
            <WhyChooseUs />
            <Testimonials />
            <EmergencyCTA />
        </main>
    );
}
