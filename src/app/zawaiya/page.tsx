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
import { Gauge, CheckCircle2, ChevronLeft } from "lucide-react";
import * as motion from "motion/react-client";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "مركز ضبط زوايا بالكمبيوتر في المحلة الكبرى",
  description:
    "مركز ضبط زوايا بالكمبيوتر في المحلة الكبرى. ضبط زوايا دقيق لثبات السيارة وتقليل استهلاك الكاوتش مع فحص العفشة والترصيص عند الحاجة.",
  keywords: seoKeywords,
  alternates: {
    canonical: "/zawaiya",
  },
  openGraph: {
    title: "مركز ضبط زوايا بالكمبيوتر في المحلة الكبرى | The Drive Center",
    description:
      "مركز ضبط زوايا بالكمبيوتر في المحلة الكبرى. ضبط دقيق لثبات السيارة وتقليل استهلاك الإطارات.",
    url: "/zawaiya",
    siteName: GOOGLE_BUSINESS_NAME,
    locale: "ar_EG",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "مركز ضبط زوايا بالكمبيوتر - The Drive Center" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "مركز ضبط زوايا بالكمبيوتر في المحلة الكبرى | The Drive Center",
    description:
      "مركز ضبط زوايا بالكمبيوتر في المحلة الكبرى. ضبط دقيق لثبات السيارة وتقليل استهلاك الإطارات.",
    images: ["/og-image.png"],
  },
};

export default async function ZawaiyaPage() {
  const siteUrl = getSafeSiteUrl(process.env.NEXT_PUBLIC_APP_URL || "https://thedrive.center");
  let heroImageUrl: string | null = null;
  try {
    heroImageUrl = await siteSettingQueries.get("hero_image_url");
  } catch {
    // Use default
  }

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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "ضبط زوايا بالكمبيوتر", item: `${siteUrl}/zawaiya` },
    ],
  };

  return (
    <main dir="rtl" className="overflow-x-hidden pb-10">
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
                <p className="mb-6 text-lg leading-9 text-zinc-600 dark:text-zinc-300">
                  ضبط الزوايا بيحافظ على اتجاه السيارة، يقلل استهلاك الكاوتش، ويخلي القيادة أهدأ وأكثر أمانا. في The Drive Center بنراجع وضع العجل ونقاط العفشة المؤثرة على الضبط قبل تنفيذ الخدمة، عشان النتيجة تكون مستقرة ومناسبة لحالة العربية.
                </p>
                <ul className="space-y-4">
                  {[
                    "ثبات السيارة على السرعات العالية",
                    "تقليل استهلاك الكاوتش بشكل ملحوظ",
                    "إطالة عمر الإطارات",
                    "تحكم أفضل في العربية",
                    "راحة وأمان في القيادة",
                    "تقليل انحراف السيارة يمين أو شمال"
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

      <section className="container mx-auto px-4 pb-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "قبل ضبط الزوايا",
              text: "بنسمع شكوى العميل ونراجع ضغط الكاوتش وحالة العفشة الظاهرة، لأن أي مشكلة ميكانيكية ممكن تأثر على نتيجة الضبط.",
            },
            {
              title: "أثناء الضبط",
              text: "بنستخدم جهاز ضبط زوايا بالكمبيوتر لقراءة اتجاه العجل ومقارنته بالقيم المناسبة للسيارة، ثم نضبط حسب الحالة الفنية.",
            },
            {
              title: "بعد الخدمة",
              text: "بنوضح لك سبب المشكلة، هل كانت من الزوايا فقط أو مرتبطة بإطار أو قطعة عفشة تحتاج متابعة.",
            },
          ].map((item) => (
            <Card key={item.title} className="border-emerald-500/20 bg-card/40">
              <CardContent className="p-6">
                <Gauge className="mb-4 h-9 w-9 text-emerald-500" />
                <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-white">{item.title}</h3>
                <p className="leading-8 text-zinc-600 dark:text-zinc-300">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 border-emerald-500/20 bg-card/40">
          <CardContent className="p-8 md:p-10">
            <h2 className="mb-6 text-2xl font-black text-zinc-900 dark:text-white">
              علامات إن عربيتك محتاجة ضبط زوايا
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                "العربية بتحدف يمين أو شمال والطريق مستقيم",
                "الدركسيون مش في المنتصف أثناء السير",
                "استهلاك الكاوتش من ناحية واحدة",
                "رعشة أو عدم ثبات بعد تغيير أجزاء في العفشة",
                "بعد خبطة قوية في حفرة أو رصيف",
                "بعد تركيب إطارات جديدة أو صيانة عفشة",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <ChevronLeft className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
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
              محتاج كمان <Link href="/fahs" className="text-emerald-500 hover:text-emerald-400 font-bold underline underline-offset-4">فحص شامل للسيارة قبل البيع أو الشراء</Link> أو <Link href="/tarses" className="text-emerald-500 hover:text-emerald-400 font-bold underline underline-offset-4">ترصيص واتزان</Link>؟ The Drive Center بتقدم كل الخدمات في مكان واحد — <Link href="/book" className="text-emerald-500 hover:text-emerald-400 font-bold underline underline-offset-4">احجز موعدك</Link>.
            </p>
          </CardContent>
        </Card>
      </section>

      <CTA />
      <LocationSection />
    </main>
  );
}
