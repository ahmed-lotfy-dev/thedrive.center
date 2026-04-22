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
import { CTA } from "@/features/landing/components/CTA";
import { LocationSection } from "@/features/landing/components/LocationSection";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Gauge, CheckCircle2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import * as motion from "motion/react-client";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "مركز ضبط زوايا بالكمpartement | مركز ظبط زوايا | ترصيص عجلات في المحلة الكبرى",
  description:
    "مركز ضبط زوايا专业的 بالكمبيوتر في المحلة الكبرى. ضبط زوايا دقيق لثبات العربية وتقليل استهلاك الكاوتش. أجهزة عالمية.",
  keywords: seoKeywords,
  alternates: {
    canonical: "/zawaiya",
  },
  openGraph: {
    title: "مركز ضبط زوايا بالكمبيوتر | مركز ظبط زوايا | The Drive Center",
    description:
      "مركز ضبط زوايا专业的 بالكمبيوتر في المحلة الكبرى. ضبط زوايا دقيق لثبات السيارة.",
    url: "/zawaiya",
  },
};

export default async function ZawaiyaPage() {
  const siteUrl = getSafeSiteUrl(process.env.NEXT_PUBLIC_APP_URL || "https://thedrive.center");
  const heroImageUrl = await siteSettingQueries.get("hero_image_url");

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
        name: "مركز ضبط زوايا",
        value: "مركز ضبط زوايا بالكمبيوتر في المحلة الكبرى"
      },
      {
        "@type": "PropertyValue",
        name: "مركز ترصيص",
        value: "مركز ترصيص عجلات في المحلة الكبرى"
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
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <Image
          src={heroImageUrl || "/hero.jpg"}
          alt="مركز ضبط زوايا بالكمبيوتر"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            className="text-4xl md:text-6xl font-black text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            مركز ضبط زوايا <span className="text-emerald-400">بالكمبيوتر</span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-zinc-200 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            ضبط و ظبط زوايا دقيق لثبات العربية وتقليل استهلاك الكاوتش
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <Card className="bg-card/40 backdrop-blur-3xl border border-emerald-500/20">
          <CardContent className="p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-6">
                  لماذا ضبط الزوايا مهم؟
                </h2>
                <ul className="space-y-4">
                  {[
                    "ثبات السيارة على السرعات العالية",
                    "تقليل استهلاك الكاوتش بشكل ملحوظ",
                    "إطالة عمر الإطارات",
                    "تحكم أفضل في العربي",
                    "راحة وأمان في القيادة"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      <span className="font-bold">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative h-80 rounded-3xl overflow-hidden">
                <Image
                  src="/services/paint-gauge-v1.png"
                  alt="ضبط زوايا كمبيوتر"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <CTA />
      <LocationSection />
    </main>
  );
}