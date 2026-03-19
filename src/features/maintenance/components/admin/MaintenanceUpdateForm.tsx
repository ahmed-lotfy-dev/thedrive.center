"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateMaintenanceTrackingAction } from "../../actions";
import { toast } from "sonner";
import { Calendar, Gauge, Save, Loader2 } from "lucide-react";
import type { CarDetailsRecord } from "./CarDetailView";

interface MaintenanceUpdateFormProps {
  car: CarDetailsRecord;
  onUpdate: (updatedCar: CarDetailsRecord) => void;
}

export function MaintenanceUpdateForm({ car, onUpdate }: MaintenanceUpdateFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nextServiceDate: car.nextServiceDate ? new Date(car.nextServiceDate).toISOString().split('T')[0] : "",
    nextServiceOdometer: car.nextServiceOdometer || "",
    nextAlignmentDate: car.nextAlignmentDate ? new Date(car.nextAlignmentDate).toISOString().split('T')[0] : "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const nextServiceOdometer =
      String(formData.nextServiceOdometer).trim() === ""
        ? undefined
        : Number(formData.nextServiceOdometer);

    const result = await updateMaintenanceTrackingAction(car.id, {
      nextServiceDate: formData.nextServiceDate,
      nextServiceOdometer,
      nextAlignmentDate: formData.nextAlignmentDate,
    });
    setLoading(false);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("تم تحديث مواعيد الصيانة بنجاح");
      onUpdate({
        ...car,
        nextServiceDate: formData.nextServiceDate,
        nextServiceOdometer: nextServiceOdometer ?? null,
        nextAlignmentDate: formData.nextAlignmentDate,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-4xl border border-white/6 bg-black/35 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-8">
      <div className="flex items-center justify-between gap-3 rounded-3xl border border-white/6 bg-white/[0.03] px-4 py-4">
        <div className="text-right">
          <p className="text-sm font-black text-white">الجدول القادم</p>
          <p className="text-xs font-medium text-zinc-500">حدّث ميعاد الصيانة وضبط الزوايا والعداد المتوقع</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-[11px] font-black tracking-[0.18em] text-emerald-300">
          متابعة الصيانة
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-3 text-right">
          <Label htmlFor="nextServiceDate" className="flex items-center justify-end gap-2 text-[11px] font-black tracking-[0.16em] text-zinc-400">
            <span>تاريخ الصيانة القادم</span>
            <Calendar className="size-3.5 text-emerald-500" />
          </Label>
          <Input 
            id="nextServiceDate"
            type="date"
            value={formData.nextServiceDate}
            onChange={(e) => setFormData({...formData, nextServiceDate: e.target.value})}
            className="h-14 rounded-2xl border-white/10 bg-white/[0.04] px-5 font-bold transition-all focus:border-emerald-500/40 focus:ring-emerald-500/10"
          />
        </div>

        <div className="space-y-3 text-right">
          <Label htmlFor="nextServiceOdometer" className="flex items-center justify-end gap-2 text-[11px] font-black tracking-[0.16em] text-zinc-400">
            <span>العداد القادم (كم)</span>
            <Gauge className="size-3.5 text-emerald-500" />
          </Label>
          <Input 
            id="nextServiceOdometer"
            type="number"
            placeholder="مثال: 125000"
            value={formData.nextServiceOdometer}
            onChange={(e) => setFormData({...formData, nextServiceOdometer: e.target.value})}
            className="h-14 rounded-2xl border-white/10 bg-white/[0.04] px-5 font-bold placeholder:text-zinc-600 transition-all focus:border-emerald-500/40 focus:ring-emerald-500/10"
          />
        </div>

        <div className="space-y-3 text-right sm:col-span-2">
          <Label htmlFor="nextAlignmentDate" className="flex items-center justify-end gap-2 text-[11px] font-black tracking-[0.16em] text-zinc-400">
            <span>تاريخ ضبط الزوايا القادم</span>
            <Calendar className="size-3.5 text-emerald-500" />
          </Label>
          <Input 
            id="nextAlignmentDate"
            type="date"
            value={formData.nextAlignmentDate}
            onChange={(e) => setFormData({...formData, nextAlignmentDate: e.target.value})}
            className="h-14 rounded-2xl border-white/10 bg-white/[0.04] px-5 font-bold transition-all focus:border-emerald-500/40 focus:ring-emerald-500/10"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        className="mt-2 h-14 w-full rounded-2xl bg-emerald-500 text-lg font-black text-zinc-950 shadow-[0_12px_30px_rgba(16,185,129,0.18)] transition-all hover:bg-emerald-400 hover:shadow-[0_16px_34px_rgba(16,185,129,0.24)] active:scale-[0.99]"
      >
        {loading ? <Loader2 className="animate-spin size-5" /> : <Save className="size-5" />}
        حفظ التغييرات
      </Button>
    </form>
  );
}
