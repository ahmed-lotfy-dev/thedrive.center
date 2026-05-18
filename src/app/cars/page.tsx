import { Suspense } from "react";
import { getShowcaseCars } from "@/lib/api/showcase";
import { CarsGalleryView } from "@/features/cars/components/CarsGalleryView";
import { seoKeywords } from "@/lib/seo-keywords";
import { GOOGLE_BUSINESS_NAME } from "@/lib/google-business";
import type { ShowcaseCar } from "@/types/showcase";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سجل التميز - أعمال فحص وضبط السيارات",
  description:
    "استعرض أعمال مركز The Drive Center في فحص السيارات الشامل، ومركز ضبط و ظبط الزوايا، ومركز الترصيص. شاهد نتائج دقيقة لسيارات عملائنا في المحلة الكبرى.",
  keywords: seoKeywords,
  alternates: {
    canonical: "/cars",
  },
  openGraph: {
    title: "سجل التميز - The Drive Center",
    description:
      "استعرض أعمال مركز The Drive Center في فحص السيارات الشامل، ومركز ضبط و ظبط الزوايا، ومركز الترصيص.",
    url: "/cars",
    siteName: GOOGLE_BUSINESS_NAME,
    locale: "ar_EG",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "سجل التميز - The Drive Center" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "سجل التميز - The Drive Center",
    description:
      "استعرض أعمال مركز The Drive Center في فحص السيارات الشامل، ومركز ضبط و ظبط الزوايا، ومركز الترصيص.",
    images: ["/og-image.png"],
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

  let allCars: ShowcaseCar[] = [];
  let meta = { total: 0, page: 1, limit: 9, totalPages: 0, hasNextPage: false, hasPreviousPage: false };
  try {
    const result = await getShowcaseCars({
      page,
      limit: 9,
      search,
      serviceType,
    });
    allCars = result.data;
    meta = result.meta;
  } catch {
    // Use defaults
  }

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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://thedrive.center" },
      { "@type": "ListItem", position: 2, name: "سجل التميز", item: "https://thedrive.center/cars" },
    ],
  };

  return (
    <main dir="rtl" className="min-h-screen bg-background pt-24 md:pt-32 pb-20">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
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
