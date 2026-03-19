"use client";

import { useState } from "react";
import { 
  Car as CarIcon, 
  Plus, 
  History, 
  Clock,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddServiceRecordModal } from "@/features/maintenance/components/admin/AddServiceRecordModal";
import { MaintenanceUpdateForm } from "@/features/maintenance/components/admin/MaintenanceUpdateForm";
import { ServiceHistoryTimeline } from "@/features/maintenance/components/ServiceHistoryTimeline";
import Link from "next/link";
import { formatLicensePlate } from "@/lib/utils";

type CarDetailsServiceRecord = {
  id: string;
  serviceDate: string | Date;
  serviceType: string;
  description?: string | null;
  odometer?: number | null;
  cost?: string | number | null;
};

export type CarDetailsRecord = {
  id: string;
  make: string;
  model: string;
  plateNumber: string;
  nextServiceDate?: string | Date | null;
  nextServiceOdometer?: number | string | null;
  nextAlignmentDate?: string | Date | null;
  serviceRecords?: CarDetailsServiceRecord[] | null;
};

interface CarDetailViewProps {
  car: CarDetailsRecord;
}

export function CarDetailView({ car: initialCar }: CarDetailViewProps) {
  const [car, setCar] = useState(initialCar);
  const [showServiceModal, setShowServiceModal] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild className="rounded-xl h-10 w-10 p-0">
          <Link href="/admin/customer-cars">
            <ArrowRight className="size-5" />
          </Link>
        </Button>
        <span className="text-zinc-500 font-bold">العودة لقائمة السيارات</span>
      </div>

      <div className="bg-zinc-900/30 border border-white/10 rounded-4xl p-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-5">
            <div className="size-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-inner">
              <CarIcon className="size-8 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">
                {car.make} <span className="text-emerald-500">{car.model}</span>
              </h2>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-1">
                لوحة: {formatLicensePlate(car.plateNumber)}
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setShowServiceModal(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-2xl font-black h-12 px-6 gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Plus className="size-4" />
            تسجيل خدمة جديدة
          </Button>
        </div>
        {/* Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="flex flex-col space-y-4 h-full">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Clock className="text-emerald-500 size-5" />
              تحديث جدول الصيانة
            </h3>
            <MaintenanceUpdateForm car={car} onUpdate={(updatedCar) => {
              setCar(updatedCar);
            }} />
          </div>

          {/* Quick History Overview */}
          <div className="flex flex-col space-y-4 h-full">
             <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <History className="text-emerald-500 size-5" />
                نظرة سريعة على السجل
              </h3>
              {car.serviceRecords?.length > 4 && (
                <Button variant="link" className="text-emerald-500 text-[10px] font-black uppercase tracking-widest h-auto p-0 hover:no-underline opacity-70 hover:opacity-100">
                  عرض الكل
                </Button>
              )}
            </div>
            
            <div className="bg-black/20 rounded-4xl border border-white/5 p-6 flex-1 max-h-[450px] overflow-y-auto scrollbar-hide shadow-inner shadow-black/20">
              {car.serviceRecords && car.serviceRecords.length > 0 ? (
                <ServiceHistoryTimeline records={car.serviceRecords.slice(0, 4)} />
              ) : (
                <div className="flex flex-col justify-center items-center text-center py-12">
                  <p className="text-zinc-500 text-sm mb-4">لا يوجد سجل خدمات سابق لهذه السيارة بعد.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowServiceModal(true)}
                    className="rounded-xl border-white/10 text-[10px] font-black h-9 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/40 hover:text-emerald-400 transition-all font-cairo uppercase tracking-widest"
                  >
                    تسجيل أول صيانة
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <AddServiceRecordModal 
          isOpen={showServiceModal} 
          onClose={() => setShowServiceModal(false)} 
          car={car}
        />
      </div>
    </div>
  );
}
