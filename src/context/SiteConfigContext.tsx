"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export interface SiteSection {
    id: string;
    component_id: string;
    nav_label_en: string;
    nav_label_bn: string;
    nav_href: string;
    is_visible: boolean;
    show_in_nav: boolean;
    order_index: number;
    content_data?: any;
}

interface SiteConfigContextType {
    sections: SiteSection[];
    isLoading: boolean;
    reorderSections: (newOrder: SiteSection[]) => Promise<void>;
    toggleVisibility: (id: string, isVisible: boolean) => Promise<void>;
    toggleNavVisibility: (id: string, showInNav: boolean) => Promise<void>;
    addSection: (section: Omit<SiteSection, "id">) => Promise<void>;
    deleteSection: (id: string) => Promise<void>;
    updateSection: (id: string, updates: Partial<SiteSection>) => Promise<void>;
    updateSectionData: (id: string, contentData: any) => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export function SiteConfigProvider({ children }: { children: ReactNode }) {
    const [sections, setSections] = useState<SiteSection[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("site_sections")
            .select("*")
            .order("order_index", { ascending: true });

        if (error) {
            console.error("Error fetching sections:", error);
        } else if (data) {
            setSections(data);
        }
        setIsLoading(false);
    };

    const reorderSections = async (newOrder: SiteSection[]) => {
        // Optimistic update
        setSections(newOrder);

        // Update database (using upsert or individual updates)
        // Note: Supabase upsert requires the primary key. Since newOrder has IDs, it will update them.
        const updates = newOrder.map((section, index) => ({
            id: section.id,
            component_id: section.component_id,
            nav_label_en: section.nav_label_en,
            nav_label_bn: section.nav_label_bn,
            nav_href: section.nav_href,
            is_visible: section.is_visible,
            show_in_nav: section.show_in_nav,
            order_index: index + 1,
        }));

        const { error } = await supabase.from("site_sections").upsert(updates);
        
        if (error) {
            console.error("Error reordering sections:", error);
            // Revert changes on error
            fetchSections();
        }
    };

    const toggleVisibility = async (id: string, is_visible: boolean) => {
        setSections((prev) =>
            prev.map((s) => (s.id === id ? { ...s, is_visible } : s))
        );
        const { error } = await supabase
            .from("site_sections")
            .update({ is_visible })
            .eq("id", id);
        if (error) {
            console.error("Error updating visibility", error);
            fetchSections();
        }
    };

    const toggleNavVisibility = async (id: string, show_in_nav: boolean) => {
        setSections((prev) =>
            prev.map((s) => (s.id === id ? { ...s, show_in_nav } : s))
        );
        const { error } = await supabase
            .from("site_sections")
            .update({ show_in_nav })
            .eq("id", id);
        if (error) {
            console.error("Error updating nav visibility", error);
            fetchSections();
        }
    };

    const addSection = async (section: Omit<SiteSection, "id">) => {
        const { data, error } = await supabase
            .from("site_sections")
            .insert(section)
            .select()
            .single();

        if (error) {
            console.error("Error adding section:", error);
        } else if (data) {
            setSections((prev) => [...prev, data].sort((a,b) => a.order_index - b.order_index));
        }
    };

    const deleteSection = async (id: string) => {
        setSections((prev) => prev.filter((s) => s.id !== id));
        const { error } = await supabase.from("site_sections").delete().eq("id", id);
        if (error) {
            console.error("Error deleting section:", error);
            fetchSections();
        }
    };

    const updateSection = async (id: string, updates: Partial<SiteSection>) => {
        setSections((prev) =>
            prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
        );
        const { error } = await supabase
            .from("site_sections")
            .update(updates)
            .eq("id", id);
        if (error) {
            console.error("Error updating section:", error);
            fetchSections();
        }
    };

    const updateSectionData = async (id: string, content_data: any) => {
        setSections((prev) =>
            prev.map((s) => (s.id === id ? { ...s, content_data } : s))
        );
        const { error } = await supabase
            .from("site_sections")
            .update({ content_data })
            .eq("id", id);
        if (error) {
            console.error("Error updating section data:", error);
            fetchSections();
        }
    };

    return (
        <SiteConfigContext.Provider
            value={{
                sections,
                isLoading,
                reorderSections,
                toggleVisibility,
                toggleNavVisibility,
                addSection,
                deleteSection,
                updateSection,
                updateSectionData,
            }}
        >
            {children}
        </SiteConfigContext.Provider>
    );
}

export function useSiteConfig() {
    const context = useContext(SiteConfigContext);
    if (!context) {
        throw new Error("useSiteConfig must be used within a SiteConfigProvider");
    }
    return context;
}
