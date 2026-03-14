"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as motion from "motion/react-client";

const sectionVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export function CTA() {
  return (
    <motion.section 
      className="container mx-auto px-4 py-18"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={sectionVariants as any}
    >
      <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-zinc-900 dark:bg-zinc-950 px-6 py-12 text-white md:px-16 md:py-16 shadow-2xl">
        <div className="pointer-events-none absolute -top-20 -left-14 h-96 w-96 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-[100px]" />
        
        <div className="relative z-10 max-w-3xl">
          <p className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-4">جاهز لضبط العربية؟</p>
          <h2 className="text-3xl md:text-5xl font-black leading-tight mb-8">
            احجز ميعادك في <span className="text-emerald-400">The Drive</span> وخليك مطمّن على ثبات وأداء عربيتك
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="h-16 rounded-3xl bg-emerald-500 hover:bg-emerald-400 text-zinc-900 px-10 text-lg font-black shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/40 hover:-translate-y-1 active:scale-95 leading-none">
              <Link href="/book">احجز ميعادك دلوقتي</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-16 rounded-3xl px-10 text-lg font-black border-white/10 bg-white/5 hover:bg-white/10 text-white">
              <a href="https://wa.me/201017131414" target="_blank" rel="noopener noreferrer">كلمنا واتساب</a>
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
