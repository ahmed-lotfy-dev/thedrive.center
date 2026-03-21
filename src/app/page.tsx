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
  title: "مركز ترصيص وضبط زوايا في المحلة الكبرى | The Drive Center",
  description:
    "The Drive Center مركز ترصيص وضبط زوايا في المحلة الكبرى يقدم ضبط زوايا كمبيوتر، ترصيص، فحص شامل قبل الشراء والبيع، وحجز سريع أونلاين.",
  keywords: seoKeywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "مركز ترصيص وضبط زوايا في المحلة الكبرى | The Drive Center",
    description:
      "مركز متخصص في ضبط الزوايا والترصيص والفحص الشامل قبل الشراء والبيع داخل المحلة الكبرى مع حجز سريع أونلاين.",
    url: "/",
  },
  twitter: {
    title: "مركز ترصيص وضبط زوايا في المحلة الكبرى | The Drive Center",
    description:
      "مركز متخصص في ضبط الزوايا والترصيص والفحص الشامل قبل الشراء والبيع داخل المحلة الكبرى.",
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
          text: "الفحص الشامل الدقيق يستغرق غالبًا من 45 إلى 60 دقيقة حسب حالة السيارة ونطاق الفحص المطلوب.",
        },
      },
    ],
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Wheel alignment, tire balancing, and pre-purchase inspection",
    name: `${GOOGLE_BUSINESS_NAME} - ضبط زوايا وترصيص وفحص شامل`,
    areaServed: BUSINESS_CITY,
    provider: {
      "@type": "AutoRepair",
      name: GOOGLE_BUSINESS_NAME,
      address: BUSINESS_ADDRESS,
      telephone: `+2${BUSINESS_PHONE}`,
    },
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
