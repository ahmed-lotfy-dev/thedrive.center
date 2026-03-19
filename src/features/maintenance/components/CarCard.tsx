"use client";

import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { ar } from "date-fns/locale";
import { 
  Car as CarIcon, 
  Settings, 
  ChevronRight, 
  Wrench,
  PlusCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn, formatLicensePlate } from "@/lib/utils";
import { ServiceHistoryTimeline } from "@/features/maintenance/components/ServiceHistoryTimeline";

type CarServiceRecord = {
  id: string;
  serviceDate: string | Date;
  serviceType: string;
  description?: string | null;
  odometer?: number | null;
  cost?: string | number | null;
};

export type GarageCar = {
  id: string;
  make: string;
  model: string;
  plateNumber: string;
  year?: number | null;
  nextServiceDate?: string | Date | null;
  nextAlignmentDate?: string | Date | null;
  serviceRecords?: CarServiceRecord[] | null;
};

interface CarCardProps {
  car: GarageCar;
}

export function CarCard({ car }: CarCardProps) {
  const [showHistory, setShowHistory] = useState(false);

  const daysToService = car.nextServiceDate 
    ? differenceInDays(new Date(car.nextServiceDate), new Date()) 
    : null;
    
  const daysToAlignment = car.nextAlignmentDate 
    ? differenceInDays(new Date(car.nextAlignmentDate), new Date()) 
    : null;

  return (
    <div className="bg-card/40 border border-border/50 rounded-4xl overflow-hidden hover:border-emerald-500/20 transition-all duration-500 group shadow-lg">
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="size-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
              <CarIcon className="size-7 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-xl font-black italic uppercase tracking-tight">
                {car.make} <span className="text-emerald-500">{car.model}</span>
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-muted text-[10px] font-bold px-2 py-0.5 rounded text-muted-foreground uppercase tracking-widest border border-border/50">
                  {formatLicensePlate(car.plateNumber)}
                </span>
                {car.year && (
                  <span className="text-muted-foreground/60 text-xs font-bold">{car.year}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className={cn(
            "p-4 rounded-3xl border transition-all",
            daysToService !== null && daysToService < 7 
              ? "bg-red-500/5 border-red-500/20" 
              : "bg-muted/30 border-border/50"
          )}>
            <div className="flex items-center gap-2 text-muted-foreground/60 mb-1">
              <Wrench className="size-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">الصيانة القادمة</span>
            </div>
            <div className="text-sm font-black">
              {car.nextServiceDate ? (
                <div className="flex flex-col">
                  <span>{format(new Date(car.nextServiceDate), "d MMMM", { locale: ar })}</span>
                  <span className={cn(
                    "text-[10px] uppercase font-bold",
                    daysToService !== null && daysToService < 7 ? "text-red-400" : "text-emerald-500"
                  )}>
                    {daysToService !== null ? (
                      daysToService <= 0 ? "متأخرة!" : `خلال ${daysToService} يوم`
                    ) : ""}
                  </span>
                </div>
              ) : (
                <span className="text-zinc-600">غير محدد</span>
              )}
            </div>
          </div>

          <div className={cn(
             "p-4 rounded-3xl border transition-all",
             daysToAlignment !== null && daysToAlignment < 7 
               ? "bg-amber-500/5 border-amber-500/20" 
               : "bg-zinc-800/30 border-white/5"
          )}>
            <div className="flex items-center gap-2 text-muted-foreground/60 mb-1">
              <Settings className="size-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">ضبط الزوايا</span>
            </div>
            <div className="text-sm font-black">
            {car.nextAlignmentDate ? (
                <div className="flex flex-col">
                   <span>{format(new Date(car.nextAlignmentDate), "d MMMM", { locale: ar })}</span>
                   <span className="text-[10px] text-amber-500 uppercase font-bold">
                     {daysToAlignment !== null ? (
                       daysToAlignment <= 0 ? "مطلوب الآن" : `خلال ${daysToAlignment} يوم`
                     ) : ""}
                   </span>
                </div>
              ) : (
                <span className="text-muted-foreground/40">غير محدد</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}
            className="rounded-2xl border-border/50 bg-muted/30 hover:bg-muted font-bold group/btn py-6 px-4"
          >
            <span className="flex-1 text-right">سجل الخدمات</span>
            <ChevronRight className={cn(
              "size-5 transition-transform duration-300",
              showHistory ? "rotate-90" : "group-hover:translate-x-1"
            )} />
          </Button>

          <Button 
            asChild
            className="rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black py-6 px-4 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Link href={`/book?plate=${car.plateNumber}&make=${car.make}`}>
              <PlusCircle className="size-5 ml-2" />
              احجز الآن
            </Link>
          </Button>
        </div>

        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-white/5 mt-4">
                <ServiceHistoryTimeline records={car.serviceRecords || []} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
