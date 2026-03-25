import { Suspense } from "react";
import type { Metadata } from "next";
import { AppointmentForm } from "@/features/appointments/components/AppointmentForm";
import { seoKeywords } from "@/lib/seo-keywords";
import { GOOGLE_BUSINESS_NAME } from "@/lib/google-business";

export const metadata: Metadata = {
  title: "مركز فحص سيارات قبل البيع والشراء | مركز ضبط زوايا | مركز ظبط زوايا | مركز ترصيص | احجز ميعادك",
  description:
    "احجز ميعادك الآن في مركز The Drive Center: أفضل مركز فحص سيارات شامل قبل البيع والشراء، مركز ضبط و ظبط زوايا بالكمبيوتر، ومركز ترصيص عجلات.",
  keywords: seoKeywords,
  alternates: {
    canonical: "/book",
  },
  openGraph: {
    title: "مركز فحص سيارات | مركز ضبط زوايا | مركز ظبط زوايا | مركز ترصيص | الحجز أونلاين",
    description:
      "احجز ميعاد فحص شامل بـ ٣ أجهزة، أو مركز ضبط وزوايا (ضبط و ظبط) وترصيص في The Drive Center.",
    url: "/book",
    images: ["/active-hero-image.webp"],
  },
  twitter: {
    title: "مركز فحص سيارات | مركز ضبط زوايا | مركز ظبط زوايا | مركز ترصيص | الحجز أونلاين",
    description:
      "احجز ميعاد فحص شامل بـ ٣ أجهزة، أو مركز ضبط وزوايا (ضبط و ظبط) وترصيص.",
    images: ["/active-hero-image.webp"],
  },
};

export default function BookPage() {
  const bookPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `حجز خدمات ${GOOGLE_BUSINESS_NAME}`,
    serviceType: [
      "فحص سيارات شامل قبل البيع والشراء بـ ٣ أجهزة",
      "ضبط زوايا كمبيوتر",
      "ترصيص واتزان",
      "تكويد باور ستيرنج",
    ],
    description: "احجز أفضل خدمة فحص سيارات قبل البيع والشراء في المحلة الكبرى باستخدام أحدث أجهزة كشف البوية والـ UV.",
    areaServed: "المحلة الكبرى",
    url: "/book",
  };

  return (
    <main className="min-h-screen pt-28 pb-16">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookPageJsonLd) }}
      />
      <section className="container mx-auto px-4" data-animate>
        <div className="surface-soft p-8 md:p-10 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold text-balance">احجز ميعادك في أقل من دقيقة</h1>
          <p className="mt-4 text-muted-foreground text-lg">
            اختار نوع الخدمة والميعاد المناسب، وفريقنا هيتواصل معاك لتأكيد الحجز.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 mt-10" data-animate>
        <div className="max-w-3xl mx-auto">
          <Suspense fallback={<div className="text-center py-20 text-muted-foreground font-black animate-pulse uppercase tracking-[0.2em] text-[10px]">جاري تحميل البيانات...</div>}>
            <AppointmentForm />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
