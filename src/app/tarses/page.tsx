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
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "مركز ترصيص عجلات | اتزان كاوتش | ترصيص واتزان في المحلة الكبرى",
  description:
    "مركز ترصيص عجلات واتزان في المحلة الكبرى. حل مشكلة الرعشة والاهتزاز على السرعات العالية. أجهزة حديثة.",
  keywords: seoKeywords,
  alternates: {
    canonical: "/tarses",
  },
  openGraph: {
    title: "مركز ترصيص عجلات | اتزان كاوتش | The Drive Center",
    description:
      "مركز ترصيص عجلات واتزان في المحلة الكبرى. حل مشكلة الرعشة والاهتزاز.",
    url: "/tarses",
  },
};

export default async function Tarse2Page() {
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
        name: "مركز ترصيص",
        value: "مركز ترصيص عجلات واتزان في المحلة الكبرى"
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
          alt="مركز ترصيص عجلات"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            مركز <span className="text-emerald-400">ترصيص</span> عجلات
          </h1>
          <p className="text-xl md:text-2xl text-zinc-200 max-w-2xl">
            ترصيص واتزان لحل مشكلة الرعشة والاهتزاز على السرعات العالية
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <Card className="bg-card/40 backdrop-blur-3xl border border-emerald-500/20">
          <CardContent className="p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-6">
                  علامات你需要 ترصيص؟
                </h2>
                <ul className="space-y-4">
                  {[
                    "رعشة في عجلة القيادة على скорость 120+",
                    "اهتزاز في_body للسيارة",
                    "استهلاك غير.uniform للإطارات",
                    "ضوضاء غير طبيعية من العجلات",
                    "عدم ثبات السيارة على السرعات"
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
                  src="/services/obd-scanner-v3.png"
                  alt="ترصيص عجلات"
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