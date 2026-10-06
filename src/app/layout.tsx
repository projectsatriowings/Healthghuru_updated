import type { Metadata } from "next";
import { headers } from "next/headers";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { DialogProvider } from "@/components/providers/DialogProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { AuthModalProvider } from "@/context/AuthModalContext";

// Professional Display Font for high-impact headlines and titles
const plusJakartaDisplay = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
  display: "swap",
});

// Professional Heading Font for clean section titles, cards, and UI
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Highly legible, modern Body Font for all reading text and forms
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// High-precision Monospace Font for counters, metrics, and tickers
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://healthghuru.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HealthGhuru — Live Better. Feel Stronger.",
    template: "%s | HealthGhuru",
  },
  description: "Science-backed wellness platform covering Nutrition, Sleep, Fitness and Mental Health. 20,000+ expert-reviewed articles.",
  alternates: {
    canonical: "./",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "HealthGhuru — Live Better. Feel Stronger.",
    description: "Science-backed wellness platform covering Nutrition, Sleep, Fitness and Mental Health. 20,000+ expert-reviewed articles.",
    url: siteUrl,
    siteName: "HealthGhuru",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HealthGhuru — Live Better. Feel Stronger.",
    description: "Science-backed wellness platform covering Nutrition, Sleep, Fitness and Mental Health. 20,000+ expert-reviewed articles.",
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.png", type: "image/png" }
    ],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();
  const host = headersList.get("x-host") || headersList.get("host") || "";
  const pathname = headersList.get("x-pathname") || "";
  const isAdminDomain = host.startsWith("admin.") || headersList.get("x-is-admin-domain") === "true";
  const isExcluded = isAdminDomain || pathname.startsWith("/admin") || pathname.includes("/print");

  return (
    <html lang="en" suppressHydrationWarning className={`${plusJakartaDisplay.variable} ${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning className="antialiased min-h-screen flex flex-col font-body">
        <AuthProvider>
          <AuthModalProvider>
            <ToastProvider>
              <DialogProvider>
                <SmoothScroll>
                  <ConditionalLayout isExcluded={isExcluded} navbar={<Navbar />} footer={<Footer />}>
                    {children}
                  </ConditionalLayout>
                </SmoothScroll>
              </DialogProvider>
            </ToastProvider>
          </AuthModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
