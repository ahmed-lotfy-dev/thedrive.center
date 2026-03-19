"use client";

import { Badge } from "@/components/ui/badge";
import { Camera, Sparkles } from "lucide-react";
import { PortfolioCar } from "@/types/portfolio";
import { FilterBar } from "@/components/shared/FilterBar";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { CarCard } from "./CarCard";
import { GlassSkeletonCollection } from "@/components/shared/GlassSkeleton";
import * as motion from "motion/react-client";
import type { Variants } from "motion/react";

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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export function CarsGalleryView({
  allCars,
  meta,
  search,
  serviceType,
  isLoading,
}: CarsGalleryViewProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Premium Background Decorations */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-150 h-150 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header Section */}
        <motion.div
          className="flex flex-col items-center text-center space-y-8 mb-16 md:mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Badge
              variant="outline"
              className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5 px-6 h-10 rounded-full font-black uppercase tracking-[0.2em] text-xs sm:text-sm shadow-sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              سجل التميز والأعمال
            </Badge>
          </motion.div>

          <div className="space-y-6 max-w-4xl">
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-zinc-900 dark:text-white leading-[1.1] text-balance"
            >
              سيارات تم{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-l from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-400 drop-shadow-sm">
                خدمتها
              </span>{" "}
              باحترافية
            </motion.h1>
          </div>
        </motion.div>

        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <FilterBar placeholder="ابحث بالمركبة أو الخدمة..." />
        </motion.div>

        {/* Grid Section */}
        {isLoading ? (
          <GlassSkeletonCollection count={6} />
        ) : allCars.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {allCars.map((car, index) => (
                <motion.div key={car.id} variants={itemVariants}>
                  <CarCard car={car} index={index} />
                </motion.div>
              ))}
            </div>

            <motion.div variants={itemVariants} className="mt-16">
              <PaginationControls
                currentPage={meta.page}
                totalPages={meta.totalPages}
                baseUrl="/cars"
                queryParams={{ search, serviceType }}
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-40 text-center bg-card/40 backdrop-blur-xl rounded-[3rem] border-2 border-dashed border-border/50 shadow-inner"
          >
            <div className="size-24 rounded-3xl bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center mb-8 border border-border/50 rotate-3">
              <Camera className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />
            </div>
            <h2 className="text-3xl font-black text-foreground tracking-tight">
              لا توجد أعمال تطابق بحثك
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-3 font-medium text-lg">
              جرب البحث بكلمات مختلفة أو تصفح كل الخدمات.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
