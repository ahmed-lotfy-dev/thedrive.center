import { Suspense } from "react";
import { getShowcaseCars } from "@/lib/api/showcase";
import { CarsGalleryView } from "@/features/cars/components/CarsGalleryView";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سجل التميز | The Drive Center",
  description: "استعرض سجل السيارات التي تم خدمتها في مركز ذا درايف، واطلع على تفاصيل ضبط الزوايا والترصيص والفحص الشامل.",
  alternates: {
    canonical: "/cars",
  },
  openGraph: {
    title: "سجل التميز | The Drive Center",
    description: "استعرض سجل السيارات التي تم خدمتها في مركز ذا درايف، واطلع على تفاصيل الأعمال المنفذة.",
    url: "/cars",
  },
  twitter: {
    title: "سجل التميز | The Drive Center",
    description: "استعرض سجل السيارات التي تم خدمتها في مركز ذا درايف، واطلع على تفاصيل الأعمال المنفذة.",
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

  return (
    <main dir="rtl" className="min-h-screen bg-background pt-24 md:pt-32 pb-20">
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
