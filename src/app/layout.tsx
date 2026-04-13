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
    title: "নির্ভার কেয়ার | Nirvaar Care - Professional Home Healthcare Services",
    description: "Nirvaar Care provides professional home healthcare services in Bangladesh including home nursing, physiotherapy, diagnostic tests, and elderly care. Available 24/7. Call: +880 1715-599599",
    keywords: ["nirvaar care", "nirvaarcare", "home healthcare bangladesh", "home nursing dhaka", "physiotherapy home service", "diagnostic test at home", "elderly care bangladesh", "নির্ভার কেয়ার", "হোম হেলথকেয়ার"],
    authors: [{ name: "Nirvaar Care" }],
    creator: "Nirvaar Care",
    publisher: "Nirvaar Care",
    metadataBase: new URL("https://www.nirvaarcare.com"),
    alternates: {
        canonical: "https://www.nirvaarcare.com",
    },
    openGraph: {
        type: "website",
        locale: "bn_BD",
        url: "https://www.nirvaarcare.com",
        siteName: "Nirvaar Care",
        title: "Nirvaar Care - Professional Home Healthcare Services in Bangladesh",
        description: "Professional home healthcare services including home nursing, physiotherapy, diagnostic tests, and elderly care. Available 24/7 in Bangladesh.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Nirvaar Care - Home Healthcare Services",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Nirvaar Care - Professional Home Healthcare Services",
        description: "Professional home healthcare services in Bangladesh. Available 24/7.",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
    verification: {
        google: "", // Google Search Console verification code যুক্ত করতে হবে
    },
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
