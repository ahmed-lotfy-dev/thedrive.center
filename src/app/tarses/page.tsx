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
import { CheckCircle2, ChevronLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "مركز ترصيص عجلات واتزان في المحلة الكبرى",
  description:
    "مركز ترصيص عجلات واتزان في المحلة الكبرى. حل مشكلة الرعشة والاهتزاز على السرعات العالية. أجهزة حديثة.",
  keywords: seoKeywords,
  alternates: {
    canonical: "/tarses",
  },
  openGraph: {
    title: "مركز ترصيص عجلات واتزان | The Drive Center",
    description:
      "مركز ترصيص عجلات واتزان في المحلة الكبرى. حل مشكلة الرعشة والاهتزاز.",
    url: "/tarses",
    siteName: GOOGLE_BUSINESS_NAME,
    locale: "ar_EG",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "مركز ترصيص عجلات - The Drive Center" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "مركز ترصيص عجلات واتزان | The Drive Center",
    description:
      "مركز ترصيص عجلات واتزان في المحلة الكبرى. حل مشكلة الرعشة والاهتزاز.",
    images: ["/og-image.png"],
  },
};

export default async function Tarse2Page() {
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
        name: "مركز ترصيص",
        value: "مركز ترصيص عجلات واتزان في المحلة الكبرى"
      }
    ]
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "ترصيص عجلات واتزان", item: `${siteUrl}/tarses` },
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
                  إيه هو الترصيص ومتى تحتاجه؟
                </h2>
                <p className="mb-6 text-lg leading-9 text-zinc-600 dark:text-zinc-300">
                  الترصيص هو ضبط اتزان العجل عشان وزن الإطار والجنط يبقى موزع بشكل صحيح أثناء الدوران. لما الاتزان يكون غير مضبوط، بتظهر رعشة في الدركسيون أو جسم العربية خصوصا على السرعات العالية. الخدمة بتساعد على راحة القيادة وحماية الإطارات والعفشة.
                </p>
                <ul className="space-y-4">
                  {[
                    "رعشة في عجلة القيادة على السرعات العالية",
                    "اهتزاز في جسم السيارة",
                    "استهلاك غير منتظم للإطارات",
                    "ضوضاء غير طبيعية من العجلات",
                    "عدم ثبات السيارة على الطريق"
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

      <section className="container mx-auto px-4 pb-8">
        <Card className="border-emerald-500/20 bg-card/40">
          <CardContent className="p-8 md:p-10">
            <h2 className="mb-6 text-2xl font-black text-zinc-900 dark:text-white">
              خطوات ترصيص العجل في The Drive Center
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-xl font-bold text-emerald-500">متى تعمل ترصيص؟</h3>
                <div className="space-y-3">
                  {[
                    "بعد تركيب كاوتش جديد أو إصلاح إطار",
                    "عند ظهور رعشة على سرعات متوسطة أو عالية",
                    "بعد خبطة قوية في حفرة أو رصيف",
                    "لو لاحظت تآكل غير منتظم في الإطارات",
                    "قبل السفر لمسافة طويلة للاطمئنان على اتزان العجل",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <ChevronLeft className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                      <span className="leading-8 text-zinc-700 dark:text-zinc-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-4 text-xl font-bold text-emerald-500">ماذا تتوقع من الخدمة؟</h3>
                <div className="space-y-3">
                  {[
                    "فحص العجلة على جهاز الترصيص وتحديد مكان عدم الاتزان",
                    "تركيب الأوزان المناسبة بدقة حسب قراءة الجهاز",
                    "إعادة القياس للتأكد من اختفاء فرق الاتزان",
                    "تنبيهك لو فيه مشكلة في الجنط أو الإطار تحتاج إصلاح",
                    "خدمة مناسبة للسيارات الملاكي المستخدمة يوميا داخل المدينة أو السفر",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                      <span className="leading-8 text-zinc-700 dark:text-zinc-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="container mx-auto px-4 pb-6">
        <Card className="border-emerald-500/20 bg-card/40">
          <CardContent className="p-6 md:p-8 text-center">
            <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              The Drive Center كمان بتقدم <Link href="/fahs" className="text-emerald-500 hover:text-emerald-400 font-bold underline underline-offset-4">فحص شامل للسيارة قبل البيع والشراء</Link> و <Link href="/zawaiya" className="text-emerald-500 hover:text-emerald-400 font-bold underline underline-offset-4">ضبط زوايا بالكمبيوتر</Link>. كل الخدمات في مكان واحد — <Link href="/book" className="text-emerald-500 hover:text-emerald-400 font-bold underline underline-offset-4">احجز موعدك</Link>.
            </p>
          </CardContent>
        </Card>
      </section>

      <CTA />
      <LocationSection />
    </main>
  );
}
