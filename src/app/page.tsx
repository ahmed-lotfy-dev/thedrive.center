import { Hero } from "@/features/landing/components/Hero";
import { Services } from "@/features/landing/components/Services";
import { Process } from "@/features/landing/components/Process";
import { FAQ } from "@/features/landing/components/FAQ";
import { CTA } from "@/features/landing/components/CTA";
import { LocationSection } from "@/features/landing/components/LocationSection";
import { ComingSoon } from "@/features/maintenance/components/ComingSoon";
import { MaintenanceMode } from "@/features/maintenance/components/MaintenanceMode";

import { siteSettingQueries } from "@/db/queries/site-settings";
import { getRandomAdvice } from "@/app/admin/advices/actions";
import { AdvicePopup } from "@/components/shared/AdvicePopup";
import { isComingSoonModeEnabled, isMaintenanceModeEnabled } from "@/lib/site-state";
import type { Metadata } from "next";
import {
  BUSINESS_ADDRESS,
  BUSINESS_CITY,
  BUSINESS_PHONE,
  GOOGLE_BUSINESS_NAME,
} from "@/lib/google-business";
import { seoKeywords } from "@/lib/seo-keywords";

export const metadata: Metadata = {
  title: "مركز فحص سيارات قبل البيع والشراء | مركز ضبط زوايا | مركز ظبط زوايا | مركز ترصيص | The Drive Center",
  description:
    "The Drive Center: أفضل مركز فحص سيارات شامل قبل البيع والشراء، مركز ضبط زوايا بالكمبيوتر، ومركز ترصيص عجلات. ندعم أدق تقنيات ضبط و ظبط الزوايا لضمان الثبات.",
  keywords: seoKeywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "مركز فحص سيارات | مركز ضبط زوايا | مركز ظبط زوايا | مركز ترصيص | The Drive Center",
    description:
      "مركز متخصص في فحص السيارات، ضبط وزوايا (ضبط و ظبط)، وترصيص العجلات بأحدث الأجهزة العالمية في المحلة الكبرى.",
    url: "/",
  },
  twitter: {
    title: "مركز فحص سيارات | مركز ضبط زوايا | مركز ظبط زوايا | مركز ترصيص | The Drive Center",
    description:
      "مركز متخصص في فحص السيارات، ضبط وزوايا (ضبط و ظبط)، وترصيص العجلات في المحلة الكبرى.",
  },
};

export default async function Home() {
  const isMaintenanceMode = isMaintenanceModeEnabled();
  const isComingSoonMode = isComingSoonModeEnabled();

  if (isMaintenanceMode) {
    return <MaintenanceMode />;
  }

  if (isComingSoonMode) {
    return <ComingSoon />;
  }

  const [heroImageUrl, randomAdvice] = await Promise.all([
    siteSettingQueries.get("hero_image_url"),
    getRandomAdvice()
  ]);

  const homeFaqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "إيه الفرق بين فحص القلم والجهاز الرقمي والـ UV؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "القلم يكشف المعجون السميك فقط، والجهاز الرقمي يقيس سمك البوية بدقة، أما الـ UV فيكشف الترميمات والرش التجميلي المخفي بدقة أعلى.",
        },
      },
      {
        "@type": "Question",
        name: "هل بتحتاج أحجز موعد مسبق؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "يفضل الحجز المسبق لضمان عدم الانتظار وتوافر الفنيين المتخصصين في الوقت المناسب.",
        },
      },
      {
        "@type": "Question",
        name: "الفحص بياخد وقت قد إيه؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "الفحص الشامل الدقيق يستغرق غالبًا من ٤٥ إلى ٦٠ دقيقة حسب حالة السيارة ونطاق الفحص المطلوب.",
        },
      },
    ],
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Car Inspection, Wheel Alignment, Tire Balancing",
    name: `${GOOGLE_BUSINESS_NAME} - فحص شامل بـ ٣ أجهزة، ضبط زوايا وترصيص`,
    description: "فحص شامل للسيارات قبل البيع والشراء بأحدث ٣ أجهزة (قلم فحص البوية، جهاز قياس سمك الدهان، وماسح الأشعة UV) لضمان أعلى دقة في التقرير.",
    areaServed: BUSINESS_CITY,
    provider: {
      "@type": "AutoRepair",
      name: GOOGLE_BUSINESS_NAME,
      address: {
        "@type": "PostalAddress",
        streetAddress: BUSINESS_ADDRESS,
        addressLocality: BUSINESS_CITY,
        addressCountry: "EG",
      },
      telephone: `+2${BUSINESS_PHONE}`,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "خدمات The Drive Center",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "مركز فحص شامل قبل البيع والشراء",
            description: "كشف كامل على الهيكل والميكانيكا والعفشة بـ ٣ أجهزة متطورة."
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "مركز ضبط زوايا (ظبط زوايا)",
            description: "ضبط و ظبط زوايا دقيق لثبات السيارة وتقليل استهلاك الكاوتش."
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "مركز ترصيص واتزان",
            description: "حل مشاكل الاهتزاز والرعشة على السرعات العالية."
          }
        }
      ]
    }
  };

  return (
    <main dir="rtl" className="overflow-x-hidden pb-10">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqJsonLd) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <Hero imageUrl={heroImageUrl} />
      <Services />
      <Process />
      <FAQ />
      <CTA />
      <LocationSection />
      
      {/* Dynamic Car Tips / Advice Pop-up */}
      <AdvicePopup advice={randomAdvice} delaySeconds={30} />
    </main>
  );
}
