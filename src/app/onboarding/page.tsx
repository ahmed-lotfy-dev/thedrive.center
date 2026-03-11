import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { submitOnboarding } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, ShieldCheck, Sparkles } from "lucide-react";

export default async function OnboardingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.onboarded) {
    redirect("/");
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 p-8 text-white text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md mb-4 shadow-xl">
              <Car className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold mb-2">أهلاً بك في The Drive</h1>
            <p className="text-emerald-50/90 text-lg">خطوة أخيرة لتخصيص تجربتك. برجاء إضافة بيانات سيارتك.</p>
          </div>

          <form action={submitOnboarding} className="p-8 md:p-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="make" className="text-base font-bold text-slate-700 dark:text-slate-300">ماركة السيارة</Label>
                <div className="relative">
                  <Input 
                    id="make" 
                    name="make" 
                    placeholder="مثل: Toyota" 
                    required 
                    className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-emerald-500 rounded-xl"
                  />
                </div>
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

            <div className="space-y-2">
              <Label htmlFor="plateNumber" className="text-base font-bold text-slate-700 dark:text-slate-300">رقم اللوحة (اختياري)</Label>
              <Input 
                id="plateNumber" 
                name="plateNumber" 
                placeholder="أ ب ج - 1 2 3" 
                className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-emerald-500 rounded-xl"
              />
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <Button type="submit" className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-lg font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-95">
                تأكيد البيانات والمتابعة
                <Sparkles className="mr-2 w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-sm italic">
              <ShieldCheck className="w-4 h-4" />
              <span>بياناتك محمية ومشفرة وفق أعلى المعايير.</span>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
