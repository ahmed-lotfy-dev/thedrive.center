import { getPortfolio } from "@/lib/api/portfolio";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Camera, ArrowLeft } from "lucide-react";
import { PortfolioCar } from "@/types/portfolio";
import { FilterBar } from "@/components/shared/FilterBar";
import { PaginationControls } from "@/components/shared/PaginationControls";

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
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="flex flex-col items-start text-start space-y-6 mb-16 md:mb-20">
          <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5 px-6 h-9 rounded-full font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2 duration-500">
            سجل التميز
          </Badge>
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
              سيارات تم <span className="text-emerald-500">خدمتها</span> باحترافية
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
              ثقة عملائنا هي سر نجاحنا. هنا نوثق بعض الأعمال التي قمنا بها لضمان أعلى مستويات الدقة والأمان على الطريق باستخدام أحدث تقنيات ضبط الزوايا.
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <FilterBar placeholder="ابحث بالمركبة أو الخدمة..." />

        {/* Grid Section */}
        {allCars.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allCars.map((car) => (
                <Link key={car.id} href={`/cars/${car.slug}`} className="group block">
                  <Card className="overflow-hidden border border-zinc-200 dark:border-zinc-800/60 bg-card shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 rounded-4xl group-hover:-translate-y-2">
                    <div className="relative aspect-16/10 overflow-hidden">
                      <Image
                        src={car.coverImageUrl}
                        alt={car.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={allCars.indexOf(car) === 0}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity dark:from-zinc-950/80 from-zinc-800/70" />
                      
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/10 backdrop-blur-md border-white/20 text-white font-bold h-9 px-4 rounded-2xl">
                          {car.serviceType === 'alignment_balancing' ? 'ضبط زوايا وترصيص' : 
                           car.serviceType === 'inspection' ? 'فحص شامل' : 
                           car.serviceType === 'steering_coding' ? 'تكويد طارة' : car.serviceType}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-2 group-hover:text-emerald-500 transition-colors">
                        {car.title}
                      </h2>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed font-medium">
                        {car.description}
                      </p>
                    </CardContent>
                    
                    <CardFooter className="p-6 pt-0 flex items-center justify-between text-sm">
                      <span className="text-zinc-400 font-bold">
                        {new Date(car.createdAt!).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })}
                      </span>
                      <div className="flex items-center gap-1 text-emerald-500 font-black group-hover:gap-2 transition-all">
                        <span>عرض التفاصيل</span>
                        <ArrowLeft className="w-4 h-4" />
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>

            <PaginationControls
              currentPage={meta.page}
              totalPages={meta.totalPages}
              baseUrl="/cars"
              queryParams={{ search, serviceType }}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-zinc-50 dark:bg-zinc-800/20 rounded-5xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
            <Camera className="w-20 h-20 text-zinc-300 mb-6" />
            <h2 className="text-2xl font-bold text-zinc-400">لا توجد أعمال تطابق بحثك</h2>
            <p className="text-zinc-500 mt-2">جرب البحث بكلمات مختلفة أو تصفح كل الخدمات.</p>
          </div>
        )}
      </div>
    </main>
  );
}
