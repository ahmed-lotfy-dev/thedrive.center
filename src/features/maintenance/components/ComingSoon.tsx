"use client";

import Image from "next/image";
import { Sparkles, Construction, Facebook, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ComingSoon() {
  return (
    <div dir="rtl" className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-slate-950 text-white">
      {/* Background Hero Image with heavy overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/active-hero-image.jpg"
          alt="مركز خدمة The Drive"
          fill
          priority
          className="object-cover opacity-30 grayscale-[0.5]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/80 via-slate-950/40 to-slate-950" />
      </div>

      {/* Animated Orbs */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse delay-700" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 backdrop-blur-xl mb-8">
          <Construction className="w-5 h-5" />
          <span className="text-sm font-black tracking-widest uppercase">الموقع تحت الإنشاء</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter">
          قريباً <br />
          <span className="text-transparent bg-clip-text bg-linear-to-l from-emerald-400 via-emerald-500 to-cyan-400">
            The Drive
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium mb-12">
          نحن موجودون بالفعل لخدمتكم، ولكننا نعمل حالياً على إطلاق منصتنا الرقمية لنقدم لكم تجربة حجز ومتابعة أسهل وأذكى. ترقبوا انطلاق موقعنا الرسمي قريباً.
        </p>

        {/* Social Links / Call to Action */}
        <div className="flex flex-wrap justify-center gap-6">
          <Button asChild size="lg" className="h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white px-8 text-lg font-bold shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95">
            <a href="https://wa.me/201017131414" target="_blank" rel="noopener noreferrer">
              <MessageSquare className="ml-2 w-5 h-5 font-bold" />
              تواصل معنا واتساب
            </a>
          </Button>
          
          <div className="flex items-center gap-4">
             <Button variant="outline" size="icon" className="w-16 h-16 rounded-2xl border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white transition-all hover:-translate-y-1">
               <a href={process.env.NEXT_PUBLIC_FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
                 <Facebook className="w-7 h-7" />
               </a>
             </Button>
             <Button variant="outline" size="icon" className="w-16 h-16 rounded-2xl border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white transition-all hover:-translate-y-1">
               <a href={process.env.NEXT_PUBLIC_TIKTOK_URL} target="_blank" rel="noopener noreferrer">
                 {/* Custom TikTok SVG for maximum accuracy */}
                 <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                   <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.27 1.76-.23.84-.04 1.77.47 2.45.47.66 1.25 1.05 2.04 1.13.73.07 1.48-.11 2.09-.52.66-.41 1.11-1.06 1.25-1.83.07-1.4.03-2.81.04-4.21V0l.02.02z"/>
                 </svg>
               </a>
             </Button>
          </div>
        </div>

        {/* Decorative footer element */}
        <div className="mt-20 flex items-center justify-center gap-3 text-slate-500 text-sm font-bold uppercase tracking-widest">
          <div className="w-12 h-px bg-slate-800" />
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span>The Drive Center</span>
          <div className="w-12 h-px bg-slate-800" />
        </div>
      </div>
    </div>
  );
}
