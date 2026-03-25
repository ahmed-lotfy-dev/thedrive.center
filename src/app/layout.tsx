import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {
  BUSINESS_ADDRESS,
  BUSINESS_CITY,
  BUSINESS_PHONE,
  BUSINESS_REGION,
  GOOGLE_BUSINESS_NAME,
  GOOGLE_MAPS_COORDS,
  GOOGLE_PLACE_URL,
  FACEBOOK_URL,
  TIKTOK_URL,
  INSTAGRAM_URL,
} from "@/lib/google-business";
import { seoKeywords } from "@/lib/seo-keywords";
import { getSafeSiteUrl } from "@/lib/site-url";

const cairo = localFont({
  src: [
    {
      path: "./fonts/Cairo-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Cairo-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Cairo-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Cairo-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-cairo",
  display: "swap",
});

const siteUrl = getSafeSiteUrl(process.env.NEXT_PUBLIC_APP_URL);
const [latitude, longitude] = GOOGLE_MAPS_COORDS.split(",").map((value) => Number(value.trim()));

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${GOOGLE_BUSINESS_NAME} | مركز متخصص في ضبط الزوايا والترصيص`,
    template: `%s | ${GOOGLE_BUSINESS_NAME}`,
  },
  description:
    "مركز The Drive في المحلة الكبرى لخدمات ضبط الزوايا والترصيص والفحص الشامل قبل البيع والشراء بأحدث الأجهزة.",
  keywords: seoKeywords,
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: siteUrl,
    siteName: GOOGLE_BUSINESS_NAME,
    title: `${GOOGLE_BUSINESS_NAME} | مركز متخصص في ضبط الزوايا والترصيص`,
    description: "خدمة احترافية لضبط الزوايا والترصيص وفحص السيارات قبل الشراء أو البيع داخل المحلة الكبرى.",
    images: [
      {
        url: "/active-hero-image.webp",
        width: 1200,
        height: 630,
        alt: GOOGLE_BUSINESS_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${GOOGLE_BUSINESS_NAME} | مركز متخصص في ضبط الزوايا والترصيص`,
    description: "مركز The Drive في المحلة الكبرى - تشخيص دقيق وخدمة سريعة.",
    images: ["/active-hero-image.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { isSiteStateScreenEnabled } from "@/lib/site-state";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: GOOGLE_BUSINESS_NAME,
    description: "مركز متخصص في خدمات ضبط الزوايا والترصيص والفحص الشامل للسيارات في المحلة الكبرى.",
    image: `${siteUrl}/active-hero-image.webp`,
    priceRange: "ج.م",
    openingHours: "Mo-Su 09:00-22:00",
    areaServed: BUSINESS_CITY,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS_ADDRESS,
      addressLocality: BUSINESS_CITY,
      addressRegion: BUSINESS_REGION,
      postalCode: "31951",
      addressCountry: "EG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude,
      longitude,
    },
    sameAs: [
      GOOGLE_PLACE_URL,
      FACEBOOK_URL,
      TIKTOK_URL,
      INSTAGRAM_URL
    ].filter(Boolean),
    url: siteUrl,
    telephone: `+2${BUSINESS_PHONE}`,
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: GOOGLE_BUSINESS_NAME,
    url: siteUrl,
    logo: `${siteUrl}/icon.png`,
    description: "مركز The Drive Center لصيانة وفحص السيارات في المحلة الكبرى.",
    telephone: `+2${BUSINESS_PHONE}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS_ADDRESS,
      addressLocality: BUSINESS_CITY,
      addressRegion: BUSINESS_REGION,
      addressCountry: "EG",
    },
    sameAs: [
      FACEBOOK_URL,
      TIKTOK_URL,
      INSTAGRAM_URL
    ].filter(Boolean)
  };

  const isSiteStateScreenMode = isSiteStateScreenEnabled();

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
          {!isSiteStateScreenMode && <Navbar />}
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
          />
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
          />
          {children}
          {!isSiteStateScreenMode && <Footer />}
          <Toaster dir="rtl" position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
