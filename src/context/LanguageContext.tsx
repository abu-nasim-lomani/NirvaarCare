"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "en" | "bn";

interface LanguageContextType {
    lang: Lang;
    toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
    lang: "en",
    toggleLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLang] = useState<Lang>("bn");
    const toggleLang = () => setLang((prev) => (prev === "en" ? "bn" : "en"));

    return (
        <LanguageContext.Provider value={{ lang, toggleLang }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLang() {
    return useContext(LanguageContext);
}
