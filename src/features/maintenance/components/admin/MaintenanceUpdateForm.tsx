"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateMaintenanceTrackingAction } from "../../actions";
import { toast } from "sonner";
import { Calendar, Gauge, Save, Loader2, Sparkles } from "lucide-react";
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
    <form onSubmit={handleSubmit} className="p-8 bg-black/40 backdrop-blur-md rounded-4xl border border-white/5 space-y-6 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Sparkles className="size-12 text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3 text-right">
          <Label htmlFor="nextServiceDate" className="flex items-center justify-end gap-2 text-zinc-400 font-bold text-xs uppercase tracking-widest">
            <span>تاريخ الصيانة القادم</span>
            <Calendar className="size-3.5 text-emerald-500" />
          </Label>
          <Input 
            id="nextServiceDate"
            type="date"
            value={formData.nextServiceDate}
            onChange={(e) => setFormData({...formData, nextServiceDate: e.target.value})}
            className="bg-white/5 border-white/10 rounded-2xl h-14 px-5 focus:border-emerald-500/50 focus:ring-emerald-500/10 transition-all font-bold"
          />
        </div>

        <div className="space-y-3 text-right">
          <Label htmlFor="nextServiceOdometer" className="flex items-center justify-end gap-2 text-zinc-400 font-bold text-xs uppercase tracking-widest">
            <span>العداد القادم (كم)</span>
            <Gauge className="size-3.5 text-emerald-500" />
          </Label>
          <Input 
            id="nextServiceOdometer"
            type="number"
            placeholder="مثال: 125000"
            value={formData.nextServiceOdometer}
            onChange={(e) => setFormData({...formData, nextServiceOdometer: e.target.value})}
            className="bg-white/5 border-white/10 rounded-2xl h-14 px-5 focus:border-emerald-500/50 focus:ring-emerald-500/10 transition-all font-bold placeholder:text-zinc-700"
          />
        </div>

        <div className="space-y-3 text-right sm:col-span-2">
          <Label htmlFor="nextAlignmentDate" className="flex items-center justify-end gap-2 text-zinc-400 font-bold text-xs uppercase tracking-widest">
            <span>تاريخ ضبط الزوايا القادم</span>
            <Calendar className="size-3.5 text-emerald-500" />
          </Label>
          <Input 
            id="nextAlignmentDate"
            type="date"
            value={formData.nextAlignmentDate}
            onChange={(e) => setFormData({...formData, nextAlignmentDate: e.target.value})}
            className="bg-white/5 border-white/10 rounded-2xl h-14 px-5 focus:border-emerald-500/50 focus:ring-emerald-500/10 transition-all font-bold"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-2xl h-14 font-black text-lg gap-3 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all mt-4"
      >
        {loading ? <Loader2 className="animate-spin size-5" /> : <Save className="size-5" />}
        حفظ التغييرات
      </Button>
    </form>
  );
}
