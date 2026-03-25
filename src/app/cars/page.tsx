import { Suspense } from "react";
import { getShowcaseCars } from "@/lib/api/showcase";
import { CarsGalleryView } from "@/features/cars/components/CarsGalleryView";
import { seoKeywords } from "@/lib/seo-keywords";
import { GOOGLE_BUSINESS_NAME } from "@/lib/google-business";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مركز أعمالنا | مركز فحص سيارات | مركز ضبط زوايا | مركز ترصيص | The Drive Center",
  description:
    "استعرض أعمال مركز The Drive Center في فحص السيارات الشامل، ومركز ضبط و ظبط الزوايا، ومركز الترصيص. شاهد نتائج دقيقة لسيارات عملائنا في المحلة الكبرى.",
  keywords: seoKeywords,
  alternates: {
    canonical: "/cars",
  },
  openGraph: {
    title: "مركز أعمالنا | مركز فحص سيارات | مركز ضبط زوايا | مركز ترصيص | The Drive Center",
    description:
      "استعرض أعمال مركز The Drive Center في فحص السيارات الشامل، ومركز ضبط و ظبط الزوايا، ومركز الترصيص.",
    url: "/cars",
    images: ["/active-hero-image.webp"],
  },
  twitter: {
    title: "مركز أعمالنا | مركز فحص سيارات | مركز ضبط زوايا | مركز ترصيص | The Drive Center",
    description:
      "استعرض أعمال مركز The Drive Center في فحص السيارات الشامل، ومركز ضبط و ظبط الزوايا، ومركز الترصيص.",
    images: ["/active-hero-image.webp"],
  },
};

interface CarsGalleryProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    serviceType?: string;
  }>;
}

export default async function CarsGalleryPage({ searchParams }: CarsGalleryProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";
  const serviceType = params.serviceType || "";

  const { data: allCars, meta } = await getShowcaseCars({
    page,
    limit: 9,
    search,
    serviceType,
  });

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `أعمال ${GOOGLE_BUSINESS_NAME}`,
    description:
      "أرشيف أعمال ضبط الزوايا والترصيص والفحص الشامل للسيارات في المحلة الكبرى.",
    url: "/cars",
    about: [
      "ضبط زوايا",
      "ترصيص واتزان",
      "فحص شامل قبل البيع والشراء",
      "تكويد باور ستيرنج",
    ],
  };

  return (
    <main dir="rtl" className="min-h-screen bg-background pt-24 md:pt-32 pb-20">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <Suspense fallback={<div className="container mx-auto px-4 py-20 text-center text-muted-foreground animate-pulse font-black uppercase tracking-widest text-[10px]">جاري تحميل الأعمال...</div>}>
        <CarsGalleryView 
          allCars={allCars} 
          meta={meta} 
          search={search} 
          serviceType={serviceType} 
        />
      </Suspense>
    </main>
  );
}
