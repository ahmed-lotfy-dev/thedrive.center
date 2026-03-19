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
import { Loader2, Wrench, Calendar, Gauge, CreditCard, FileText, Sparkles } from "lucide-react";
import { ServiceSelect } from "@/components/shared/ServiceSelect";
import type { CarDetailsRecord } from "./CarDetailView";

interface AddServiceRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: CarDetailsRecord;
}

export function AddServiceRecordModal({ isOpen, onClose, car }: AddServiceRecordModalProps) {
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
    
    const result = await addServiceRecordAction({
      ...formData,
      carId: car.id,
    });
    
    setLoading(false);
    
    if (result.error) {
      toast.error(result.error);
    } else {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-950/90 backdrop-blur-2xl border-white/10 rounded-4xl p-0 overflow-hidden shadow-3xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Sparkles className="size-24 text-emerald-500" />
        </div>

        <DialogHeader className="p-8 pb-0 text-right">
          <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter flex items-center justify-end gap-3">
             <span className="text-emerald-500">خدمة جديدة</span>
             <span>تسجيل</span>
          </DialogTitle>
          <p className="text-zinc-500 font-bold text-sm mt-2">
            إضافة تفاصيل الصيانة لسيارة: {car.make} {car.model}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3 text-right">
              <Label htmlFor="serviceType" className="flex items-center justify-end gap-2 text-zinc-400 font-bold text-xs uppercase tracking-widest">
                <span>نوع الخدمة *</span>
                <Wrench className="size-3.5 text-emerald-500" />
              </Label>
              <ServiceSelect 
                value={formData.serviceType}
                onValueChange={(value) => setFormData({...formData, serviceType: value})}
                className="h-14 bg-white/5 border-white/10 rounded-2xl focus:border-emerald-500/50 transition-all font-bold"
              />
            </div>
            
            <div className="space-y-3 text-right">
              <Label htmlFor="serviceDate" className="flex items-center justify-end gap-2 text-zinc-400 font-bold text-xs uppercase tracking-widest">
                <span>تاريخ الخدمة</span>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                className="bg-white/5 border-white/10 rounded-2xl h-14 px-5 focus:border-emerald-500/50 transition-all font-bold placeholder:text-zinc-800"
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
                className="bg-white/5 border-white/10 rounded-2xl h-14 px-5 focus:border-emerald-500/50 transition-all font-bold placeholder:text-zinc-800"
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
              className="bg-white/5 border-white/10 rounded-3xl min-h-[120px] p-5 focus:border-emerald-500/50 transition-all font-medium text-sm leading-relaxed"
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row-reverse gap-3 pt-4 p-8 bg-white/5">
             <Button 
               type="submit" 
               disabled={loading} 
               className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-2xl h-14 px-10 font-black text-lg gap-3 shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex-1"
             >
               {loading ? <Loader2 className="animate-spin size-6" /> : "حفظ السجل"}
             </Button>
             <Button 
               type="button" 
               variant="ghost" 
               onClick={onClose} 
               className="rounded-2xl h-14 px-8 font-bold text-zinc-400 hover:text-white hover:bg-white/5"
             >
               إلغاء
             </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
