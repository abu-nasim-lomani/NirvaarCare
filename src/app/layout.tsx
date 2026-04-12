import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import BetaWatermark from "@/components/ui/BetaWatermark";

import { Hind_Siliguri } from "next/font/google";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind",
  display: "swap",
});

export const metadata: Metadata = {
    title: "নির্ভার কেয়ার | Nirvaar Care",
    description: "আপনার স্বাস্থ্য, আমাদের অগ্রাধিকার। উন্নত চিকিৎসাসেবা এবং নিরবচ্ছিন্ন যত্ন নিশ্চিত করতে আমরা আছি আপনার পাশে।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`h-full antialiased ${hindSiliguri.variable}`}
    >
      <body className={`${hindSiliguri.className} min-h-full flex flex-col font-sans`}>
        <ThemeProvider>
          <LanguageProvider>
            <SiteConfigProvider>
              {children}
              <BetaWatermark />
            </SiteConfigProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
