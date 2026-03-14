"use client";

import { useState } from "react";
import { linkCarByPlate } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Search, Hash } from "lucide-react";

import { LicensePlateInput } from "@/components/shared/LicensePlateInput";

interface LinkCarFormProps {
  onSuccess?: () => void;
}

export function LinkCarForm({ onSuccess }: LinkCarFormProps) {
  const [plateNumber, setPlateNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateNumber) return;

    setLoading(true);
    const result = await linkCarByPlate(plateNumber);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("تم ربط السيارة بنجاح!");
      setPlateNumber("");
      router.refresh();
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6 flex flex-col items-center">
        <div className="flex items-center gap-2.5 px-1 py-1 bg-emerald-500/5 rounded-full border border-emerald-500/10 mb-2">
          <Hash className="size-3.5 text-emerald-500" />
          <Label htmlFor="plateNumber" className="text-zinc-400 font-bold uppercase text-[10px] tracking-[0.2em] font-sans">أدخل رقم اللوحة للبحث</Label>
        </div>
        <LicensePlateInput 
          value={plateNumber}
          onChange={setPlateNumber}
          disabled={loading}
        />
      </div>
      <Button 
        type="submit" 
        disabled={loading || !plateNumber}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl h-16 gap-3.5 shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all hover:scale-[1.01] active:scale-[0.98] uppercase tracking-widest text-sm"
      >
        {loading ? <Loader2 className="size-6 animate-spin" /> : (
          <>
            <Search className="size-5" />
            بحث وربط السيارة
          </>
        )}
      </Button>
      <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest leading-relaxed">
        * سيتم ربط السيارة وقائمة سجل الصيانة الخاص بها بحسابك تلقائياً بعد التحقق من رقم اللوحة.
      </p>
    </form>
  );
}
