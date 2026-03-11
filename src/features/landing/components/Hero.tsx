"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative px-4 pb-20 pt-32 md:pt-40 overflow-hidden min-h-[92vh] flex items-center border-b border-border/40">
      {/* Advanced Ambient Background */}
      <div className="absolute inset-0 bg-background -z-20" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] -z-20" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none -z-10 translate-x-1/3 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none -z-10 -translate-x-1/4 translate-y-1/3" />

      <div className="container mx-auto relative z-10 w-full mb-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* TEXT SIDE */}
          <div className="w-full lg:w-1/2 space-y-8 relative z-20" data-animate>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 backdrop-blur-md mb-2 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-bold tracking-wide">المركز الأول في المـحـلـة الكـبـرى</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-extrabold text-foreground leading-[1.15] tracking-tight text-balance animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
              مركز <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 drop-shadow-sm">The Drive</span><br />
              لضبط الزوايا والترصيص
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground/90 max-w-[90%] leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              فحص آلي حديث بأعلى دقة، ترصيص متطور، وتكويد باور ستيرنج لضمان ثبات تام وأداء مثالي لعربيتك على الطريق.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
              <Button asChild size="lg" className="h-14 rounded-full bg-foreground hover:bg-foreground/90 text-background px-8 text-lg font-bold shadow-[0_8px_30px_-5px_rgba(0,0,0,0.3)] dark:shadow-[0_8px_30px_-5px_rgba(255,255,255,0.2)] transition-all hover:scale-[1.02] hover:-translate-y-1 group">
                <Link href="/book">
                  احجز ميعادك دلوقتي
                  <ArrowUpRight className="mr-2 w-5 h-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 rounded-full px-8 text-lg font-bold border-border/60 bg-background/50 backdrop-blur-md hover:bg-accent hover:text-accent-foreground transition-all hover:-translate-y-1 shadow-sm">
                <Link href="#services">اكتشف خدماتنا</Link>
              </Button>
            </div>

            {/* FLOATING STATS GRID */}
            <div className="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-border/50 animate-in fade-in duration-1000 delay-700">
              <div className="flex flex-col">
                <div className="text-3xl md:text-4xl font-black text-foreground drop-shadow-sm">99<span className="text-emerald-500">%</span></div>
                <div className="text-sm md:text-base font-bold text-muted-foreground mt-1">دقة الفحص</div>
              </div>
              <div className="flex flex-col">
                <div className="text-3xl md:text-4xl font-black text-foreground drop-shadow-sm">100<span className="text-emerald-500">+</span></div>
                <div className="text-sm md:text-base font-bold text-muted-foreground mt-1">عميل راضي</div>
              </div>
              <div className="flex flex-col">
                <div className="text-3xl md:text-4xl font-black text-foreground drop-shadow-sm">3D<span className="text-emerald-500"></span></div>
                <div className="text-sm md:text-base font-bold text-muted-foreground mt-1">أجهزة حديثة</div>
              </div>
            </div>
          </div>

          {/* IMAGE SIDE - "MACBOOK PRO" STYLE FLOATING CARD */}
          <div className="w-full lg:w-1/2 relative lg:h-[600px] flex items-center justify-center p-4 lg:p-0" data-animate>
            <div className="w-full relative animate-in fade-in zoom-in-[0.98] duration-1000 delay-300">
              {/* Decorative background shape behind the image */}
              <div className="absolute inset-0 -m-6 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 rounded-[3rem] blur-2xl -z-10 opacity-60 mix-blend-normal transition-opacity duration-1000" />
              <div className="absolute inset-0 -m-3 bg-gradient-to-tr from-emerald-500/30 via-transparent to-cyan-500/30 rounded-[2.5rem] blur-xl -z-10 opacity-40 mix-blend-overlay" />
              
              {/* Main Image Container */}
              <div className="relative w-full aspect-[4/3] lg:aspect-square max-h-[500px] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-4 border-white/50 dark:border-white/10 bg-black/5 group">
                <Image
                  src="/active-hero-image.jpg"
                  alt="مركز خدمة The Drive لضبط الزوايا والترصيص"
                  fill
                  priority
                  className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Internal Vignette and Gradients */}
                <div className="absolute inset-0 bg-black/10 ring-1 ring-inset ring-black/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                
                {/* FLOATING GLASS CARD OVERLAY ON IMAGE */}
                <div className="absolute bottom-6 left-6 right-6 lg:bottom-[-20px] lg:left-[-30px] lg:right-10 p-5 md:p-6 rounded-2xl bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/30 dark:border-white/20 shadow-2xl transition-all duration-700 ease-out lg:group-hover:-translate-y-4 rounded-tl-3xl rounded-br-3xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30 ring-1 ring-white/20">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-white mb-1 tracking-wide drop-shadow-md">فحص كامل بضمان التميز</h3>
                      <p className="text-sm md:text-base text-white/90 leading-relaxed drop-shadow-sm font-medium">
                        تقرير فني شامل لحالة العفشة وزوايا العجل قبل البيع والشراء.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
