"use client";

import { useActionState, useState } from "react";
import { submitOnboarding } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Sparkles, AlertCircle, Fingerprint } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp"

export function OnboardingForm() {
  const [state, formAction, isPending] = useActionState(submitOnboarding, null);
  const [plateLetters, setPlateLetters] = useState("");
  const [plateNumbers, setPlateNumbers] = useState("");

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
          <Label htmlFor="make" className="text-base font-bold text-slate-700 dark:text-slate-300">ماركة السيارة</Label>
          <Input 
            id="make" 
            name="make" 
            placeholder="مثل: Toyota" 
            required 
            className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-emerald-500 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model" className="text-base font-bold text-slate-700 dark:text-slate-300">الموديل</Label>
          <Input 
            id="model" 
            name="model" 
            placeholder="مثل: Corolla" 
            required 
            className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-emerald-500 rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="year" className="text-base font-bold text-slate-700 dark:text-slate-300">سنة الصنع</Label>
          <Input 
            id="year" 
            name="year" 
            type="number" 
            placeholder="2024" 
            className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-emerald-500 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color" className="text-base font-bold text-slate-700 dark:text-slate-300">اللون</Label>
          <Input 
            id="color" 
            name="color" 
            placeholder="أسود، فضي..." 
            className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-emerald-500 rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label htmlFor="plateNumber" className="text-base font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Fingerprint className="w-5 h-5 text-emerald-500" />
          رقم اللوحة (مصري)
        </Label>
        
        <div className="flex flex-col items-center gap-4 p-8 bg-slate-50/50 dark:bg-slate-800/20 backdrop-blur-sm rounded-4xl border border-slate-200/60 dark:border-slate-800/60 transition-all shadow-inner relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
          <div className="flex items-center gap-2 group" dir="rtl">
            {/* Letters Portion - Should be on the RIGHT in RTL flow */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-black text-center">الحروف</p>
              <InputOTP
                maxLength={3}
                value={plateLetters}
                onChange={setPlateLetters}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="font-bold text-xl bg-white dark:bg-slate-900" />
                  <InputOTPSlot index={1} className="font-bold text-xl bg-white dark:bg-slate-900" />
                  <InputOTPSlot index={2} className="font-bold text-xl bg-white dark:bg-slate-900" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="mt-6 flex items-center justify-center w-6">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />
            </div>

            {/* Numbers Portion - Should be on the LEFT in RTL flow */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-black text-center">الأرقام</p>
              <InputOTP
                maxLength={4}
                value={plateNumbers}
                onChange={setPlateNumbers}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="font-bold text-xl bg-white dark:bg-slate-900" />
                  <InputOTPSlot index={1} className="font-bold text-xl bg-white dark:bg-slate-900" />
                  <InputOTPSlot index={2} className="font-bold text-xl bg-white dark:bg-slate-900" />
                  <InputOTPSlot index={3} className="font-bold text-xl bg-white dark:bg-slate-900" />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
          
          <input 
            type="hidden" 
            name="plateNumber" 
            value={`${plateLetters}-${plateNumbers}`} 
            required
          />
          
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            يرجى إدخال الحروف بالترتيب (مثال: ع م ب) ثم الأرقام.
          </p>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.25rem] text-xl font-bold shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
        >
          {isPending ? "جاري الحفظ..." : "تأكيد البيانات والمتابعة"}
          {!isPending && <Sparkles className="mr-3 w-6 h-6 animate-pulse" />}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-sm italic">
        <ShieldCheck className="w-4 h-4" />
        <span>بياناتك محمية ومشفرة وفق أعلى المعايير.</span>
      </div>
    </form>
  );
}
