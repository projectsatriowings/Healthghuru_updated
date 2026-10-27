import type { Metadata } from "next";
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
import { GoogleAnalyticsRouteChange } from "@/components/analytics/GoogleAnalytics";

// Professional Heading & Display Font for clean section titles, cards, and UI
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

const siteUrl = process.env.NODE_ENV === 'production'
  ? 'https://healthghuru.com'
  : (process.env.NEXT_PUBLIC_SITE_URL || 'https://healthghuru.com');

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
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-XXXXXXXXXX";

  return (
    <html lang="en" suppressHydrationWarning className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* Google Analytics 4 (gtag.js) */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaMeasurementId}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        {/* Structured Data (JSON-LD) for Organization & WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${siteUrl}/#organization`,
                  name: "HealthGhuru",
                  url: siteUrl,
                  logo: {
                    "@type": "ImageObject",
                    "@id": `${siteUrl}/#logo`,
                    inLanguage: "en-US",
                    url: `${siteUrl}/images/logo.png`,
                    contentUrl: `${siteUrl}/images/logo.png`,
                    width: 512,
                    height: 512,
                    caption: "HealthGhuru Logo",
                  },
                  image: {
                    "@id": `${siteUrl}/#logo`,
                  },
                  description:
                    "Science-backed wellness platform covering Nutrition, Sleep, Fitness and Mental Health. 20,000+ expert-reviewed articles.",
                  sameAs: [
                    "https://twitter.com/healthghuru",
                    "https://www.facebook.com/healthghuru",
                    "https://www.instagram.com/healthghuru",
                    "https://www.linkedin.com/company/healthghuru",
                  ],
                  contactPoint: {
                    "@type": "ContactPoint",
                    contactType: "Customer Support",
                    email: "info@healthghuru.com",
                    areaServed: "Global",
                    availableLanguage: ["English", "Hindi", "Tamil"],
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}/#website`,
                  url: siteUrl,
                  name: "HealthGhuru",
                  description:
                    "Science-backed wellness platform covering Nutrition, Sleep, Fitness and Mental Health.",
                  publisher: {
                    "@id": `${siteUrl}/#organization`,
                  },
                  inLanguage: "en-US",
                  potentialAction: [
                    {
                      "@type": "SearchAction",
                      target: {
                        "@type": "EntryPoint",
                        urlTemplate: `${siteUrl}/news?q={search_term_string}`,
                      },
                      "query-input": "required name=search_term_string",
                    },
                  ],
                },
              ],
            }),
          }}
        />
      </head>
      <body suppressHydrationWarning className="antialiased min-h-screen flex flex-col font-body">
        <GoogleAnalyticsRouteChange gaId={gaMeasurementId} />
        <AuthProvider>
          <AuthModalProvider>
            <ToastProvider>
              <DialogProvider>
                <SmoothScroll>
                  <ConditionalLayout navbar={<Navbar />} footer={<Footer />}>
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
