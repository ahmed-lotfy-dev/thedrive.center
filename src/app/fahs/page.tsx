import { Hero } from "@/features/landing/components/Hero";
import { Services } from "@/features/landing/components/Services";
import { Process } from "@/features/landing/components/Process";
import { FAQ } from "@/features/landing/components/FAQ";
import { CTA } from "@/features/landing/components/CTA";
import { LocationSection } from "@/features/landing/components/LocationSection";

import { siteSettingQueries } from "@/db/queries/site-settings";
import { seoKeywords } from "@/lib/seo-keywords";
import { getSafeSiteUrl } from "@/lib/site-url";
import type { Metadata } from "next";
import {
  BUSINESS_ADDRESS,
  BUSINESS_CITY,
  BUSINESS_PHONE,
  GOOGLE_BUSINESS_NAME,
} from "@/lib/google-business";

export const metadata: Metadata = {
  title: "مركز فحص شامل للسيارات قبل البيع والشراء | فحص كمبيوتر ومعاينة دقيق | The Drive Center",
  description:
    "مركز فحص شامل للسيارات في المحلة الكبرى. فحص كمبيوتر، كشف حادث، فحص بوية، فحص ميكانيكا والعفشة.制止 مع تقرير مفصل قبل شراء أو بيع عربية.",
  keywords: seoKeywords,
  alternates: {
    canonical: "/fahs",
  },
  openGraph: {
    title: "مركز فحص شامل للسيارات | فحص كمبيوتر ومعاينة | The Drive Center",
    description:
      "مركز فحص شامل للسيارات قبل البيع والشراء بأحدث الأجهزة. فحص كمبيوتر، كشف حادث وفحص بوية دقيق.",
    url: "/fahs",
  },
};

export default async function FaresPage() {
  const siteUrl = getSafeSiteUrl(process.env.NEXT_PUBLIC_APP_URL || "https://thedrive.center");
  const heroImageUrl = await siteSettingQueries.get("hero_image_url");
  const mobileImageUrl = await siteSettingQueries.get("hero_image_mobile_url");

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRepairShop",
    name: GOOGLE_BUSINESS_NAME,
    image: `${siteUrl}/og-image.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS_ADDRESS,
      addressLocality: BUSINESS_CITY,
      addressRegion: "الغربية",
      postalCode: "31951",
      addressCountry: "EG"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "30.9472165",
      longitude: "31.155854"
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday", "Sunday"],
        opens: "09:00",
        closes: "20:00"
      }
    ],
    priceRange: "$$",
    currenciesAccepted: "EGP",
    telephone: `+2${BUSINESS_PHONE}`,
    url: siteUrl,
    identifier: [
      {
        "@type": "PropertyValue",
        name: "مركز فحص شامل",
        value: "مركز فحص شامل سيارات قبل البيع والشراء في المحلة الكبرى"
      }
    ]
  };

  return (
    <main dir="rtl" className="overflow-x-hidden pb-10">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <Hero imageUrl={heroImageUrl} mobileImageUrl={mobileImageUrl} />
      <Process />
      <FAQ />
      <CTA />
      <LocationSection />
    </main>
  );
}