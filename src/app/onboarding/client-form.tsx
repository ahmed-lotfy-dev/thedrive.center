"use client";

import { useActionState, useState } from "react";
import { submitOnboarding } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Sparkles, AlertCircle, Fingerprint, Car, Phone } from "lucide-react";
import { LicensePlateInput } from "@/components/shared/LicensePlateInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CAR_MAKERS } from "@/lib/constants";

export function OnboardingForm() {
  const [state, formAction, isPending] = useActionState(submitOnboarding, null);
  const [plateNumber, setPlateNumber] = useState("");

  return (
    <form action={formAction} className="p-8 md:p-10 space-y-6">
      {state?.error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-start gap-3 border border-red-200 dark:border-red-800/50">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p className="text-sm font-medium">{state.error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="make" className="text-base font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
            <Car className="size-4 text-emerald-500" />
            ماركة السيارة
          </Label>
          <Select name="make" required>
            <SelectTrigger className="h-12 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 focus:ring-emerald-500 rounded-xl">
              <SelectValue placeholder="اختر ماركة السيارة" />
            </SelectTrigger>
            <SelectContent>
              {CAR_MAKERS.map((maker) => (
                <SelectItem key={maker.value} value={maker.value}>
                  {maker.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="model" className="text-base font-bold text-zinc-700 dark:text-zinc-300">الموديل</Label>
          <Input 
            id="model" 
            name="model" 
            placeholder="مثل: Corolla" 
            required 
            className="h-12 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 focus:ring-emerald-500 rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="year" className="text-base font-bold text-zinc-700 dark:text-zinc-300">سنة الصنع</Label>
          <Input 
            id="year" 
            name="year" 
            type="number" 
            placeholder="2024" 
            className="h-12 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 focus:ring-emerald-500 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color" className="text-base font-bold text-zinc-700 dark:text-zinc-300">اللون</Label>
          <Input 
            id="color" 
            name="color" 
            placeholder="أسود، فضي..." 
            className="h-12 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 focus:ring-emerald-500 rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-base font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
          <Phone className="size-4 text-emerald-500" />
          رقم الهاتف (واتساب)
        </Label>
        <Input 
          id="phone" 
          name="phone" 
          type="tel"
          placeholder="01xxxxxxxxx" 
          required 
          className="h-12 bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 focus:ring-emerald-500 rounded-xl"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          سنستخدم هذا الرقم لإرسال تنبيهات حالة السيارة والمواعيد عبر واتساب.
        </p>
      </div>

      <div className="space-y-4">
        <Label htmlFor="plateNumber" className="text-base font-black text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
          <Fingerprint className="w-5 h-5 text-emerald-500" />
          رقم اللوحة (مصري)
        </Label>
        
        <div className="flex flex-col items-center gap-4 p-8 bg-zinc-50/50 dark:bg-zinc-800/20 backdrop-blur-sm rounded-4xl border border-zinc-200/60 dark:border-zinc-800/60 transition-all shadow-inner relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
          
          <LicensePlateInput 
            value={plateNumber}
            onChange={setPlateNumber}
            disabled={isPending}
          />
          
          <input 
            type="hidden" 
            name="plateNumber" 
            value={plateNumber} 
            required
          />
          
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
            يرجى إدخال الأرقام أولاً ثم الحروف العربية بالترتيب.
          </p>
        </div>
      </div>

      <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-[1.25rem] text-xl font-black shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
        >
          {isPending ? "جاري الحفظ..." : "تأكيد البيانات والمتابعة"}
          {!isPending && <Sparkles className="mr-3 w-6 h-6 animate-pulse" />}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2 text-zinc-500 dark:text-zinc-400 text-sm italic">
        <ShieldCheck className="w-4 h-4" />
        <span>بياناتك محمية ومشفرة وفق أعلى المعايير.</span>
      </div>
    </form>
  );
}
