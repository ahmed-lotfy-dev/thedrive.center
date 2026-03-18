import { Suspense } from "react";
import { getPortfolio } from "@/lib/api/portfolio";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Plus, LayoutGrid, Eye } from "lucide-react";
import Image from "next/image";
import { FilterBar } from "@/components/shared/FilterBar";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { Badge } from "@/components/ui/badge";

interface AdminCarsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    serviceType?: string;
  }>;
}

export default async function AdminCarsPage({ searchParams }: AdminCarsPageProps) {
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
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-8">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-foreground flex items-center gap-3">
            <LayoutGrid className="w-8 h-8 text-emerald-500" />
            معرض الأعمال
          </h1>
          <p className="text-muted-foreground/60 font-bold mt-1 text-sm tracking-wide">إدارة سجل السيارات التي تظهر للزوار في المحفظة</p>
        </div>
        <Link
          href="/admin/cars/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 h-12 px-8 text-sm font-black text-zinc-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all active:scale-95 whitespace-nowrap"
        >
          <Plus className="size-5" />
          إضافة سيارة جديدة
        </Link>
      </div>

      <Suspense fallback={<div className="h-12 bg-muted/20 animate-pulse rounded-2xl w-full" />}>
        <FilterBar placeholder="بحث بالعنوان أو الوصف..." />
      </Suspense>

      {allCars.length === 0 ? (
        <div className="rounded-[2.5rem] border-2 border-dashed border-border/50 p-24 text-center bg-card/30 backdrop-blur-xl">
          <div className="size-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
             <LayoutGrid className="size-10 text-muted-foreground/40" />
          </div>
          <h3 className="text-xl font-black text-foreground mb-2">لا يوجد سيارات مضافة حالياً</h3>
          <p className="text-muted-foreground/60 font-bold max-w-sm mx-auto">أضف بعض الأعمال ليراها الزوار في الصفحة العامة للمركز.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allCars.map((car) => (
              <div
                key={car.id}
                className="group relative overflow-hidden rounded-4xl border border-border/50 bg-card/40 backdrop-blur-md transition-all hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/20"
              >
                <div className="relative aspect-video bg-muted overflow-hidden">
                  {car.coverImageUrl ? (
                    <Image
                      src={car.coverImageUrl}
                      alt={car.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      بدون صورة
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <Badge className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 text-emerald-500 font-black px-3 py-1 rounded-xl shadow-lg">
                      {car.serviceType === "alignment_balancing" ? "ضبط زوايا" : 
                       car.serviceType === "inspection" ? "فحص" : 
                       car.serviceType === "steering_coding" ? "تكويد" : car.serviceType}
                    </Badge>
                  </div>

                  <Link 
                    href={`/cars/${car.slug}`}
                    target="_blank"
                    className="absolute bottom-3 left-3 size-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center text-white hover:bg-emerald-500 hover:text-zinc-950 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                  >
                    <Eye className="size-5" />
                  </Link>
                </div>
                
                <div className="p-5">
                  <h3 className="font-black text-lg text-foreground line-clamp-1 group-hover:text-emerald-500 transition-colors uppercase tracking-tight">
                    {car.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground font-bold leading-relaxed">
                    {car.description || "لا يوجد وصف لهذه السيارة حالياً."}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <PaginationControls
              currentPage={meta.page}
              totalPages={meta.totalPages}
              baseUrl="/admin/cars"
              queryParams={{ search, serviceType }}
            />
          </div>
        </>
      )}
    </div>
  );
}
