import { getPortfolio } from "@/lib/api/portfolio";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, Edit3, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DeleteAction } from "./DeleteAction";
import { PortfolioCarWithMedia } from "@/types/portfolio";
import { FilterBar } from "@/components/shared/FilterBar";
import { PaginationControls } from "@/components/shared/PaginationControls";

interface PortfolioDashboardProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    serviceType?: string;
  }>;
}

export default async function PortfolioDashboardPage({ searchParams }: PortfolioDashboardProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";
  const serviceType = params.serviceType || "";

  const { data: allCars, meta } = await getPortfolio({
    page,
    limit: 12,
    search,
    serviceType,
  });

  return (
    <div dir="rtl" className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
            <LayoutGrid className="w-8 h-8 text-emerald-500" />
            إدارة سجل التميز
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">إضافة وتعديل السيارات التي تظهر في معرض أعمال المركز (Portfolio)</p>
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-12 px-6 gap-2">
          <Link href="/admin/portfolio/new">
            <Plus className="w-5 h-5" />
            إضافة عمل جديد
          </Link>
        </Button>
      </div>

      <FilterBar />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {allCars.map((car) => (
          <Card key={car.id} className="group overflow-hidden border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-4xl hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500">
            <div className="relative aspect-video">
              <Image
                src={car.coverImageUrl}
                alt={car.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge className="bg-zinc-900/60 backdrop-blur-md border-white/10 text-white font-bold h-8 px-3 rounded-xl">
                  {car.serviceType === 'alignment_balancing' ? 'ضبط زوايا' :
                    car.serviceType === 'inspection' ? 'فحص شامل' :
                      car.serviceType === 'steering_coding' ? 'تكويد طارة' : car.serviceType}
                </Badge>
              </div>
            </div>

            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 line-clamp-1 group-hover:text-emerald-500 transition-colors">
                {car.title}
              </h3>
              <p className="text-sm text-zinc-500 line-clamp-2 min-h-10">
                {car.description}
              </p>
            </CardContent>

            <CardFooter className="p-6 pt-0 border-t border-zinc-100/50 dark:border-zinc-800/50 mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="icon" className="h-10 w-10 text-zinc-500 hover:text-emerald-500 hover:bg-emerald-50/50 rounded-xl">
                  <Link href={`/admin/portfolio/${car.slug}/edit`}>
                    <Edit3 className="w-5 h-5" />
                  </Link>
                </Button>
                <DeleteAction id={car.id} title={car.title} />
              </div>

              <Button asChild variant="outline" size="sm" className="rounded-xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group/link">
                <Link href={`/cars/${car.slug}`} target="_blank" className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  <span>معاينة العرض</span>
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}

        {allCars.length === 0 && (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-4xl">
            <LayoutGrid className="w-16 h-16 text-zinc-200 dark:text-zinc-800 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-zinc-400">لا توجد أعمال تطابق بحثك</h3>
            <p className="text-zinc-500 mt-2 mb-8">جرب كلمات بحث مختلفة أو قم بإضافة عمل جديد.</p>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-12 px-8">
              <Link href="/admin/portfolio/new">إضافة عمل جديد</Link>
            </Button>
          </div>
        )}
      </div>

      <PaginationControls
        currentPage={meta.page}
        totalPages={meta.totalPages}
        baseUrl="/admin/portfolio"
        queryParams={{ search, serviceType }}
      />
    </div>
  );
}
