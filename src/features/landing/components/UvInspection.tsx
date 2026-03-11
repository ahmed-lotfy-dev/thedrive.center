"use client";

import Link from "next/link";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UvInspection() {
  return (
    <section className="container mx-auto px-4 pb-24" data-animate>
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 text-white">
        <div className="grid lg:grid-cols-2">
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center relative z-10">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-medium text-cyan-400 text-sm mb-6">
              <Sparkles className="size-4" />
              خدمة حصرية
            </span>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              كشف احترافي بأشعة <span className="text-cyan-400">الـ UV</span>
            </h2>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8 max-w-md">
              وداعاً للغش في البيع والشراء. بنستخدم أحدث تقنيات الأشعة فوق البنفسجية لكشف أي رش أو معجون مخفي في هيكل العربية بدقة ١٠٠٪.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-500/20 p-1">
                  <CheckCircle2 className="size-5 text-emerald-400" />
                </div>
                <span className="text-slate-200">كشف الدهان الخفي بدقة عالية</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-500/20 p-1">
                  <CheckCircle2 className="size-5 text-emerald-400" />
                </div>
                <span className="text-slate-200">الأشعة تظهر العيوب التي لا تراها العين المغردة</span>
              </li>
            </ul>
            <div>
              <Button asChild size="lg" className="h-12 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white border-0 px-8">
                <Link href="/book">احجز فحص عربيتك الآن</Link>
              </Button>
            </div>
          </div>
          
          <div className="relative min-h-[400px] lg:min-h-full h-full border-t lg:border-t-0 lg:border-r border-slate-800/50">
             {/* Decorative UV Gradient Overlay */}
             <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/40 to-violet-900/40 mix-blend-overlay z-10" />
             <div className="absolute inset-0 bg-gradient-to-l from-slate-900 via-transparent to-transparent z-10" />
             
             <div 
               className="absolute inset-0 bg-cover bg-center transition-transform hover:scale-105 duration-1000 z-0"
               style={{ 
                 backgroundImage: `url('https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1000&auto=format&fit=crop')`,
                 filter: 'contrast(1.2)'
               }}
             />

             {/* A scanner mock line animation */}
             <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_3px_#22d3ee] z-20 animate-scan pointer-events-none opacity-60" />

          </div>
        </div>
      </div>
    </section>
  );
}
