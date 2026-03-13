"use client";

import { Timer, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const steps = [
  "استقبال العربية وتسجيل بياناتها بدقة.",
  "فحص الزوايا والترصيص والبدء في الكشف الشامل.",
  "فحص هيكل السيارة بأحدث الأجهزة (UV والجهاز الرقمي).",
  "تسليم تقرير مفصل يوضح أي خبطات أو رش أو تصليحات سابقة بكل شفافية.",
];

const strengths = [
  "خبرة عملية في فحص وضبط السيارات بكل فئاتها.",
  "التزام بالمواعيد وسرعة تنفيذ بدون تنازل عن الجودة.",
  "معدات دقيقة ونتيجة تقدر تحس بيها في السواقة.",
  "تجربة عميل مريحة من أول استقبال لحد التسليم.",
];

export function Process() {
  return (
    <section className="container mx-auto px-4 py-12 md:py-20" data-animate>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* How we work */}
        <div className="relative group overflow-hidden p-8 md:p-12 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10">
          <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5 px-4 h-8 rounded-full font-bold mb-4">
            طريقة الشغل
          </Badge>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-8">فحص منظم خطوة بخطوة</h2>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={step} className={cn(
                "flex items-center gap-4 p-4 rounded-2xl bg-zinc-100/50 dark:bg-zinc-800/50 hover:bg-emerald-500/5 transition-colors border border-transparent hover:border-emerald-500/10",
                i === 0 ? "delay-100" : i === 1 ? "delay-200" : "delay-300"
              )}>
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20">
                  {i + 1}
                </div>
                <p className="text-sm md:text-base font-medium text-zinc-700 dark:text-zinc-300">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why us */}
        <div className="relative group overflow-hidden p-8 md:p-12 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white transition-all duration-500 shadow-xl dark:shadow-2xl">
          <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-400/20 bg-emerald-500/5 dark:bg-emerald-400/5 px-4 h-8 rounded-full font-bold mb-4">
            ليه تختارنا
          </Badge>
          <h2 className="text-3xl font-black mb-8">خدمة احترافية بتفاصيل تفرق</h2>
          <div className="space-y-4">
            {strengths.map((item, i) => (
              <div key={item} className={cn(
                "flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-white/5 hover:bg-emerald-500/5 transition-colors border border-transparent hover:border-emerald-500/20",
                i === 0 ? "delay-100" : i === 1 ? "delay-200" : "delay-300"
              )}>
                <CheckCircle2 className="size-6 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <p className="text-sm md:text-base font-medium text-zinc-700 dark:text-zinc-300">{item}</p>
              </div>
            ))}
          </div>
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
        </div>
      </div>
    </section>
  );
}
