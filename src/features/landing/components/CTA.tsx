"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { getWhatsAppUrl } from "@/lib/google-business";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function CTA() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.section 
      className="container mx-auto px-4 py-18"
      initial={prefersReducedMotion ? undefined : "hidden"}
      whileInView={prefersReducedMotion ? undefined : "visible"}
      viewport={prefersReducedMotion ? undefined : { once: true, margin: "-50px" }}
    >
      <div className="relative overflow-hidden rounded-4xl border border-emerald-500/20 bg-zinc-900 dark:bg-zinc-950 px-6 py-12 text-white md:px-16 md:py-16 shadow-2xl shadow-emerald-500/5 hover:border-emerald-500/40 hover:shadow-emerald-500/10 transition-all duration-500">
        <div className="pointer-events-none absolute -top-20 -left-14 h-96 w-96 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-[100px]" />
        
        <div className="relative z-10 max-w-3xl">
          <motion.p
            className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-4"
            initial={prefersReducedMotion ? undefined : { y: 15, opacity: 0 }}
            whileInView={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            جاهز لضبط العربية؟
          </motion.p>
          <motion.h2
            className="text-3xl md:text-5xl font-black leading-tight mb-8"
            initial={prefersReducedMotion ? undefined : { y: 15, opacity: 0 }}
            whileInView={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            احجز ميعادك في <span className="text-emerald-400">The Drive</span> وخليك مطمّن على ثبات وأداء عربيتك
          </motion.h2>
          <motion.div
            className="flex flex-wrap gap-4"
            initial={prefersReducedMotion ? undefined : { y: 15, opacity: 0 }}
            whileInView={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
              <Button
                asChild
                size="lg"
                className="group relative h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black px-8 shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all cursor-pointer overflow-hidden border-none active:scale-95 hover:-translate-y-1"
              >
                <Link href="/book">
                  <span className="relative z-10 flex items-center gap-2">
                    احجز موعدك الآن
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  </span>
                </Link>
              </Button>
            <Button asChild variant="outline" size="lg" className="h-14 rounded-2xl px-8 text-lg font-black border-white/10 bg-white/5 hover:bg-white/10 text-white active:scale-95 hover:-translate-y-1 transition-all">
              <a href={getWhatsAppUrl("مرحباً، أريد حجز موعد في The Drive Center")} target="_blank" rel="noopener noreferrer">كلمنا واتساب</a>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
