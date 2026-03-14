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
import { Loader2 } from "lucide-react";
import { ServiceSelect } from "@/components/shared/ServiceSelect";

interface AddServiceRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: any;
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
      <DialogContent className="sm:max-w-[500px] bg-background border-border/50 rounded-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black italic uppercase">
            تسجيل <span className="text-emerald-500">خدمة جديدة</span>
          </DialogTitle>
          <p className="text-zinc-500 text-sm">أضف تفاصيل الخدمة التي تمت للسيارة: {car.make} {car.model}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
            <div className="space-y-2">
              <Label htmlFor="serviceType" className="font-bold text-xs uppercase tracking-wider">نوع الخدمة *</Label>
              <ServiceSelect 
                value={formData.serviceType}
                onValueChange={(value) => setFormData({...formData, serviceType: value})}
                className="h-12 bg-zinc-900 border-white/5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceDate">تاريخ الخدمة</Label>
              <Input 
                id="serviceDate"
                type="date"
                required
                value={formData.serviceDate}
                onChange={(e) => setFormData({...formData, serviceDate: e.target.value})}
                className="bg-zinc-900 border-white/5 rounded-xl h-12"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-right">
            <div className="space-y-2">
              <Label htmlFor="odometer">قراءة العداد (كم)</Label>
              <Input 
                id="odometer"
                type="number"
                placeholder="120000"
                value={formData.odometer}
                onChange={(e) => setFormData({...formData, odometer: e.target.value})}
                className="bg-zinc-900 border-white/5 rounded-xl h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">التكلفة (ج.م)</Label>
              <Input 
                id="cost"
                type="number"
                placeholder="500"
                value={formData.cost}
                onChange={(e) => setFormData({...formData, cost: e.target.value})}
                className="bg-zinc-900 border-white/5 rounded-xl h-12"
              />
            </div>
          </div>

          <div className="space-y-2 text-right">
            <Label htmlFor="description">وصف الخدمة</Label>
            <Textarea 
              id="description"
              placeholder="تفاصيل إضافية حول ما تم القيام به..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="bg-zinc-900 border-white/5 rounded-2xl min-h-[100px]"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
             <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl font-bold">إلغاء</Button>
             <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold h-12 px-8">
               {loading ? <Loader2 className="animate-spin" /> : "حفظ السجل"}
             </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
