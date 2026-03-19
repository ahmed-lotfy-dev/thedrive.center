"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addServiceRecordAction } from "../../actions";
import { toast } from "sonner";
import {
  Loader2,
  Wrench,
  Calendar,
  Gauge,
  CreditCard,
  FileText,
  CarFront,
} from "lucide-react";
import { ServiceSelect } from "@/components/shared/ServiceSelect";
import type { CarDetailsRecord } from "./CarDetailView";
import { formatLicensePlate } from "@/lib/utils";

interface AddServiceRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: CarDetailsRecord;
  onSuccess?: (record: {
    id: string;
    serviceDate: string | Date;
    serviceType: string;
    description?: string | null;
    odometer?: number | null;
    cost?: string | number | null;
  }) => void;
}

export function AddServiceRecordModal({ isOpen, onClose, car, onSuccess }: AddServiceRecordModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    carId: car?.id,
    serviceType: "",
    serviceDate: new Date().toISOString().split('T')[0],
    description: "",
    odometer: "",
    cost: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const odometer = formData.odometer.trim() === "" ? undefined : Number(formData.odometer);
    const cost = formData.cost.trim() === "" ? undefined : Number(formData.cost);

    const result = await addServiceRecordAction({
      carId: car.id,
      serviceType: formData.serviceType,
      serviceDate: formData.serviceDate,
      description: formData.description,
      odometer,
      cost,
    });
    
    setLoading(false);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      if (result.data) {
        onSuccess?.(result.data);
      }
      toast.success("تم تسجيل الخدمة بنجاح");
      onClose();
      // Optionally reset form
      setFormData({
        carId: car?.id,
        serviceType: "",
        serviceDate: new Date().toISOString().split('T')[0],
        description: "",
        odometer: "",
        cost: "",
      });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[640px] overflow-hidden rounded-4xl border border-white/10 bg-zinc-950/92 p-0 shadow-[0_35px_100px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-transparent" />

          <DialogHeader className="relative p-7 pb-0 text-right sm:p-8 sm:pb-0">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter flex items-center justify-end gap-3">
                  <span className="text-emerald-400">خدمة جديدة</span>
                  <span>تسجيل</span>
                </DialogTitle>
                <p className="text-zinc-500 font-bold text-sm">
                  إضافة تفاصيل الصيانة لسيارة: {car.make} {car.model}
                </p>
              </div>

              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 shadow-inner">
                <CarFront className="size-6 text-emerald-400" />
              </div>
            </div>

            <div className="mt-5 inline-flex items-center gap-3 rounded-3xl border border-white/10 bg-black/25 px-5 py-3 text-sm font-bold text-zinc-200">
              <span className="text-zinc-500">لوحة</span>
              <span className="font-black tracking-widest">{formatLicensePlate(car.plateNumber)}</span>
            </div>
          </DialogHeader>

          <div className="px-7 pt-7 sm:px-8 sm:pt-8">
            <div className="h-px w-full bg-white/8" />
          </div>

        <form onSubmit={handleSubmit} className="p-7 pt-6 space-y-6 text-right sm:p-8 sm:pt-7">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-3 text-right">
                <Label htmlFor="serviceType" className="flex items-center justify-end gap-2 text-zinc-400 font-bold text-xs uppercase tracking-widest">
                  <span>نوع الخدمة *</span>
                  <Wrench className="size-3.5 text-emerald-500" />
                </Label>
                <ServiceSelect 
                  value={formData.serviceType}
                  onValueChange={(value) => setFormData({...formData, serviceType: value})}
                  className="!h-14 !rounded-2xl !border-white/10 !bg-white/5 !px-5 text-sm focus:border-emerald-500/50 transition-all font-bold"
                />
              </div>

              <div className="space-y-3 text-right">
                <Label htmlFor="serviceDate" className="flex items-center justify-end gap-2 text-zinc-400 font-bold text-xs uppercase tracking-widest">
                  <span>تاريخ الخدمة *</span>
                  <Calendar className="size-3.5 text-emerald-500" />
                </Label>
                <Input 
                  id="serviceDate"
                  type="date"
                  required
                  value={formData.serviceDate}
                  onChange={(e) => setFormData({...formData, serviceDate: e.target.value})}
                  className="bg-white/5 border-white/10 rounded-2xl h-14 px-5 focus:border-emerald-500/50 transition-all font-bold"
                />
              </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-3 text-right">
                <Label htmlFor="odometer" className="flex items-center justify-end gap-2 text-zinc-400 font-bold text-xs uppercase tracking-widest">
                  <span>عداد العربية (كم)</span>
                  <Gauge className="size-3.5 text-emerald-500" />
                </Label>
                <Input 
                  id="odometer"
                  type="number"
                  placeholder="مثال: 120000"
                  value={formData.odometer}
                  onChange={(e) => setFormData({...formData, odometer: e.target.value})}
                  className="bg-white/5 border-white/10 rounded-2xl h-14 px-5 focus:border-emerald-500/50 transition-all font-bold placeholder:text-zinc-700"
                />
              </div>

              <div className="space-y-3 text-right">
                <Label htmlFor="cost" className="flex items-center justify-end gap-2 text-zinc-400 font-bold text-xs uppercase tracking-widest">
                  <span>التكلفة (ج.م)</span>
                  <CreditCard className="size-3.5 text-emerald-500" />
                </Label>
                <Input 
                  id="cost"
                  type="number"
                  placeholder="500"
                  value={formData.cost}
                  onChange={(e) => setFormData({...formData, cost: e.target.value})}
                  className="bg-white/5 border-white/10 rounded-2xl h-14 px-5 focus:border-emerald-500/50 transition-all font-bold placeholder:text-zinc-700"
                />
              </div>
          </div>

          <div className="space-y-3 text-right">
              <Label htmlFor="description" className="flex items-center justify-end gap-2 text-zinc-400 font-bold text-xs uppercase tracking-widest">
                <span>وصف الخدمة بالتفصيل</span>
                <FileText className="size-3.5 text-emerald-500" />
              </Label>
              <Textarea 
                id="description"
                placeholder="اكتب هنا ما تم القيام به في السيارة..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="bg-white/5 border-white/10 rounded-3xl min-h-[140px] p-5 focus:border-emerald-500/50 transition-all font-medium text-sm leading-relaxed"
              />
          </div>

          <DialogFooter className="flex flex-col gap-3 pt-4 p-0 sm:flex-row">
             <Button 
               type="submit" 
               disabled={loading} 
               className="order-1 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-2xl h-14 px-10 font-black text-lg gap-3 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex-1 sm:order-2"
             >
               {loading ? <Loader2 className="animate-spin size-6" /> : "حفظ السجل"}
             </Button>
             <Button 
               type="button" 
               variant="ghost" 
               onClick={onClose} 
               className="order-2 rounded-2xl h-14 px-8 font-bold text-zinc-400 hover:text-white hover:bg-white/5 sm:order-1"
             >
               إلغاء
             </Button>
          </DialogFooter>
        </form>
        <div className="px-7 pb-7 sm:px-8 sm:pb-8">
          <div className="h-px w-full bg-white/6" />
        </div>
      </div>
      </DialogContent>
    </Dialog>
  );
}
