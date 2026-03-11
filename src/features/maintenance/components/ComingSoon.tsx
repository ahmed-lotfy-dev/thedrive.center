"use client";

import Image from "next/image";
import { Sparkles, Construction, Instagram, Facebook, Phone } from "lucide-react";
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
          نحن نعمل باجتهاد لنقدم لكم تجربة فريدة في عالم ضبط الزوايا والترصيص بأحدث التكنولوجيا العالمية. انتظرونا قريباً في المحلة الكبرى.
        </p>

        {/* Social Links / Call to Action */}
        <div className="flex flex-wrap justify-center gap-6">
          <Button asChild size="lg" className="h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white px-8 text-lg font-bold shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95">
            <a href="tel:+201228093434">
              <Phone className="ml-2 w-5 h-5 font-bold" />
              اتصل بنا الآن
            </a>
          </Button>
          
          <div className="flex items-center gap-4">
             <Button variant="outline" size="icon" className="w-14 h-14 rounded-2xl border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white transition-all hover:-translate-y-1">
               <a href="https://www.facebook.com/ThE.DRivE.CeNTeR/" target="_blank"><Facebook className="w-6 h-6" /></a>
             </Button>
             <Button variant="outline" size="icon" className="w-14 h-14 rounded-2xl border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white transition-all hover:-translate-y-1">
               <a href="https://www.tiktok.com/@thedrive.center" target="_blank"><Instagram className="w-6 h-6" /></a>
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
