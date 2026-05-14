import { Process } from "@/features/landing/components/Process";
import { FAQ } from "@/features/landing/components/FAQ";
import { CTA } from "@/features/landing/components/CTA";
import { LocationSection } from "@/features/landing/components/LocationSection";

import { seoKeywords } from "@/lib/seo-keywords";
import { getSafeSiteUrl } from "@/lib/site-url";
import type { Metadata } from "next";
import {
  BUSINESS_ADDRESS,
  BUSINESS_CITY,
  BUSINESS_PHONE,
  GOOGLE_BUSINESS_NAME,
} from "@/lib/google-business";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ClipboardList, SearchCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "فحص شامل للسيارات قبل البيع والشراء مع كمبيوتر",
  description:
    "مركز فحص شامل للسيارات في المحلة الكبرى. فحص كمبيوتر، كشف حادث، فحص بوية، فحص ميكانيكا وعفشة مع تقرير مفصل قبل شراء أو بيع سيارة.",
  keywords: seoKeywords,
  alternates: {
    canonical: "/fahs",
  },
  openGraph: {
    title: "فحص شامل للسيارات قبل البيع والشراء | The Drive Center",
    description:
      "مركز فحص شامل للسيارات قبل البيع والشراء بأحدث الأجهزة. فحص كمبيوتر، كشف حادث وفحص بوية دقيق.",
    url: "/fahs",
    siteName: GOOGLE_BUSINESS_NAME,
    locale: "ar_EG",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "فحص شامل للسيارات - The Drive Center" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "فحص شامل للسيارات قبل البيع والشراء | The Drive Center",
    description:
      "مركز فحص شامل للسيارات قبل البيع والشراء بأحدث الأجهزة. فحص كمبيوتر، كشف حادث وفحص بوية دقيق.",
    images: ["/og-image.png"],
  },
};

export default async function FaresPage() {
  const siteUrl = getSafeSiteUrl(process.env.NEXT_PUBLIC_APP_URL || "https://thedrive.center");

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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "فحص شامل للسيارات", item: `${siteUrl}/fahs` },
    ],
  };

  return (
    <main dir="rtl" className="overflow-x-hidden pt-24 md:pt-32 pb-10">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white md:text-5xl">
            فحص شامل قبل ما تدفع في عربية مستعملة
          </h2>
          <p className="mt-6 text-lg leading-9 text-zinc-600 dark:text-zinc-300">
            خدمة الفحص الشامل في The Drive Center مصممة عشان تعرف حالة السيارة الحقيقية قبل قرار الشراء أو البيع. بنراجع الهيكل والبوية والميكانيكا والعفشة والشاسيه والكمبيوتر، ونوضح لك الملاحظات المهمة بلغة واضحة تساعدك تفاوض بثقة وتتفادى مصاريف مفاجئة بعد الشراء.
          </p>
          <p className="mt-4 text-lg leading-9 text-zinc-600 dark:text-zinc-300">
            الفحص مناسب لأي عميل في المحلة الكبرى أو المناطق القريبة بيدور على مركز فحص سيارات قبل الشراء، كشف حادث، فحص بوية، أو تقرير فني سريع ومنظم قبل إنهاء البيع.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "فحص الهيكل والبوية",
              text: "قياس سمك الدهان، البحث عن الرش والمعجون، ومراجعة الفواصل والدواخل لاكتشاف آثار الحوادث أو الإصلاحات السابقة.",
              icon: SearchCheck,
            },
            {
              title: "فحص ميكانيكا وعفشة",
              text: "مراجعة حالة المحرك، التسريب، الأصوات، العفشة، الشاسيه، ونقاط الأمان الأساسية قبل الاعتماد على السيارة.",
              icon: ShieldCheck,
            },
            {
              title: "تقرير واضح",
              text: "ملخص منظم بالملاحظات المهمة، يساعدك تعرف هل السعر مناسب وهل العربية محتاجة مصاريف قريبة.",
              icon: ClipboardList,
            },
          ].map(({ title, text, icon: Icon }) => (
            <Card key={title} className="border-emerald-500/20 bg-card/40">
              <CardContent className="p-6">
                <Icon className="mb-4 h-9 w-9 text-emerald-500" />
                <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-white">{title}</h3>
                <p className="leading-8 text-zinc-600 dark:text-zinc-300">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-10 border-emerald-500/20 bg-card/40">
          <CardContent className="p-8 md:p-10">
            <h2 className="mb-6 text-2xl font-black text-zinc-900 dark:text-white">
              إيه اللي تستلمه بعد الفحص؟
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                "تقييم واضح لحالة البوية والهيكل والدواخل",
                "ملاحظات عن المحرك والعفشة والشاسيه",
                "نتيجة فحص الكمبيوتر وأكواد الأعطال إن وجدت",
                "نقاط القوة والضعف التي تؤثر على سعر العربية",
                "توصية فنية تساعدك تقرر تكمل الشراء أو تعيد التفاوض",
                "شرح مباشر من الفني قبل مغادرة المركز",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                  <span className="leading-8 text-zinc-700 dark:text-zinc-300">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
      <section className="container mx-auto px-4 pb-6">
        <Card className="border-emerald-500/20 bg-card/40">
          <CardContent className="p-6 md:p-8 text-center">
            <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              تقدم The Drive Center كمان خدمات <Link href="/zawaiya" className="text-emerald-500 hover:text-emerald-400 font-bold underline underline-offset-4">ضبط زوايا بالكمبيوتر</Link> و <Link href="/tarses" className="text-emerald-500 hover:text-emerald-400 font-bold underline underline-offset-4">ترصيص واتزان</Link> و <Link href="/book" className="text-emerald-500 hover:text-emerald-400 font-bold underline underline-offset-4">تكويد باور ستيرنج</Link> — كلها في مكان واحد.
            </p>
          </CardContent>
        </Card>
      </section>
      <Process />
      <FAQ />
      <CTA />
      <LocationSection />
    </main>
  );
}
