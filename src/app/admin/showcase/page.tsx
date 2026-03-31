import { Suspense } from "react";
import { getShowcaseCars } from "@/lib/api/showcase";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, Edit3, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DeleteAction } from "./DeleteAction";
import { FilterBar } from "@/components/shared/FilterBar";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { getServiceTypeLabel } from "@/lib/constants";

interface ShowcaseDashboardProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    serviceType?: string;
  }>;
}

export default async function ShowcaseDashboardPage({ searchParams }: ShowcaseDashboardProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";
  const serviceType = params.serviceType || "";

  const { data: allCars, meta } = await getShowcaseCars({
    page,
    limit: 12,
    search,
    serviceType,
  });

  return (
    <div dir="rtl" className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-8">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-foreground flex items-center gap-3">
            <LayoutGrid className="w-8 h-8 text-emerald-500" />
            إدارة سجل التميز
          </h1>
          <p className="text-muted-foreground/60 font-bold mt-1 text-sm tracking-wide">إضافة وتعديل السيارات التي تظهر في معرض أعمال المركز (Showcase)</p>
        </div>
        <Button asChild className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl h-12 px-8 gap-3 font-black shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
          <Link href="/admin/showcase/new">
            <Plus className="w-6 h-6" />
            إضافة عمل جديد
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div className="h-12 bg-muted/20 animate-pulse rounded-2xl w-full" />}>
        <FilterBar />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {allCars.map((car) => (
          <Card key={car.id} className="group overflow-hidden gap-0 py-0 border-border/50 bg-card/40 backdrop-blur-md rounded-4xl hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:border-emerald-500/20">
            <div className="relative aspect-video">
              <Image
                src={car.coverImageUrl}
                alt={car.title}
                fill
                loading="lazy"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge className="bg-background/80 backdrop-blur-md border border-border/50 text-foreground font-black h-8 px-3 rounded-xl shadow-lg">
                  {getServiceTypeLabel(car.serviceType)}
                </Badge>
              </div>
            </div>

            <CardContent className="p-6">
              <h3 className="text-xl font-black text-foreground mb-2 line-clamp-1 group-hover:text-emerald-500 transition-colors tracking-tight">
                {car.title}
              </h3>
              <p className="text-sm text-muted-foreground font-bold line-clamp-2 min-h-10 leading-relaxed">
                {car.description}
              </p>
            </CardContent>

            <CardFooter className="p-6 pt-0 border-t border-border/50 mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/50 rounded-xl transition-all">
                  <Link href={`/admin/showcase/${car.slug}/edit`}>
                    <Edit3 className="w-5 h-5" />
                  </Link>
                </Button>
                <DeleteAction id={car.id} title={car.title} />
              </div>

              <Button asChild variant="outline" size="sm" className="rounded-xl border-border hover:bg-muted text-foreground hover:text-foreground/80 transition-all group/link font-black h-10 px-4">
                <Link href={`/cars/${car.slug}`} target="_blank" className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  <span>معاينة العرض</span>
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}

        {allCars.length === 0 && (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-border/50 rounded-4xl bg-muted/20">
            <LayoutGrid className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-xl font-black text-muted-foreground/60 tracking-tight">لا توجد أعمال تطابق بحثك</h3>
            <p className="text-muted-foreground/40 font-bold mt-2 mb-8">جرب كلمات بحث مختلفة أو قم بإضافة عمل جديد.</p>
            <Button asChild className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl h-12 px-8 font-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
              <Link href="/admin/showcase/new">إضافة عمل جديد</Link>
            </Button>
          </div>
        )}
      </div>

      <PaginationControls
        currentPage={meta.page}
        totalPages={meta.totalPages}
        baseUrl="/admin/showcase"
        queryParams={{ search, serviceType }}
      />
    </div >
  );
}
