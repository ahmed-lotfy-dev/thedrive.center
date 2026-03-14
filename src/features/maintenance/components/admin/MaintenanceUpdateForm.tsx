"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateMaintenanceTrackingAction } from "../../actions";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

interface MaintenanceUpdateFormProps {
  car: any;
  onUpdate: (updatedCar: any) => void;
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
    
    const result = await updateMaintenanceTrackingAction(car.id, formData);
    setLoading(false);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("تم تحديث مواعيد الصيانة");
      onUpdate({
        ...car,
        nextServiceDate: formData.nextServiceDate,
        nextServiceOdometer: formData.nextServiceOdometer,
        nextAlignmentDate: formData.nextAlignmentDate,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-zinc-900/50 rounded-3xl border border-white/5 space-y-4">
      <div className="space-y-2 text-right">
        <Label htmlFor="nextServiceDate">تاريخ الصيانة القادم</Label>
        <Input 
          id="nextServiceDate"
          type="date"
          value={formData.nextServiceDate}
          onChange={(e) => setFormData({...formData, nextServiceDate: e.target.value})}
          className="bg-black/20 border-white/10 rounded-xl h-11"
        />
      </div>

      <div className="space-y-2 text-right">
        <Label htmlFor="nextServiceOdometer">العداد القادم (كم)</Label>
        <Input 
          id="nextServiceOdometer"
          type="number"
          placeholder="مثال: 125000"
          value={formData.nextServiceOdometer}
          onChange={(e) => setFormData({...formData, nextServiceOdometer: e.target.value})}
          className="bg-black/20 border-white/10 rounded-xl h-11"
        />
      </div>

      <div className="space-y-2 text-right">
        <Label htmlFor="nextAlignmentDate">تاريخ ضبط الزوايا القادم</Label>
        <Input 
          id="nextAlignmentDate"
          type="date"
          value={formData.nextAlignmentDate}
          onChange={(e) => setFormData({...formData, nextAlignmentDate: e.target.value})}
          className="bg-black/20 border-white/10 rounded-xl h-11"
        />
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full bg-zinc-800 hover:bg-zinc-700 text-emerald-500 rounded-xl h-12 font-bold gap-2 mt-2"
      >
        {loading ? <Loader2 className="animate-spin size-4" /> : <Save className="size-4" />}
        حفظ التغييرات
      </Button>
    </form>
  );
}
