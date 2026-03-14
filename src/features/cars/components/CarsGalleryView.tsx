"use client";

import { Badge } from "@/components/ui/badge";
import { Camera } from "lucide-react";
import { PortfolioCar } from "@/types/portfolio";
import { FilterBar } from "@/components/shared/FilterBar";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { CarCard } from "./CarCard";
import { GlassSkeletonCollection } from "@/components/shared/GlassSkeleton";

interface CarsGalleryViewProps {
  allCars: PortfolioCar[];
  meta: {
    page: number;
    totalPages: number;
  };
  search: string;
  serviceType: string;
  isLoading?: boolean;
}

export function CarsGalleryView({ allCars, meta, search, serviceType, isLoading }: CarsGalleryViewProps) {
  return (
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
      {isLoading ? (
        <GlassSkeletonCollection count={6} />
      ) : allCars.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allCars.map((car, index) => (
              <CarCard key={car.id} car={car} index={index} />
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
  );
}
