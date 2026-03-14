import { getPortfolio } from "@/lib/api/portfolio";
import { CarsGalleryView } from "@/features/cars/components/CarsGalleryView";

export const metadata = {
  title: "سجل التميز | The Drive Center",
  description: "استعرض سجل السيارات التي تم خدمتها في مركز ذا درايف، واطلع على تفاصيل ضبط الزوايا والترصيص والفحص الشامل.",
  alternates: {
    canonical: "/cars",
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

  const { data: allCars, meta } = await getPortfolio({
    page,
    limit: 9,
    search,
    serviceType,
  });

  return (
    <main dir="rtl" className="min-h-screen bg-background pt-24 md:pt-32 pb-20">
      <CarsGalleryView 
        allCars={allCars} 
        meta={meta} 
        search={search} 
        serviceType={serviceType} 
      />
    </main>
  );
}
