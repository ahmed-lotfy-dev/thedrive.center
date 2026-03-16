"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, type Variants } from "motion/react";
import { Card } from "@/components/ui/card";
import { Magnetic } from "@/components/shared/Magnetic";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

interface HeroProps {
  imageUrl?: string | null;
}

export function Hero({ imageUrl }: HeroProps) {
  const activeImage = imageUrl && imageUrl.trim() !== "" ? imageUrl : "/active-hero-image.webp";
  
  return (
    <section className="relative px-4 pb-20 pt-28 md:pt-40 overflow-hidden min-h-screen flex items-center border-b border-border/40">
      <div className="absolute inset-0 bg-background -z-20" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[32px_32px] -z-20" />
      <div className="absolute top-1/4 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto relative z-10 w-full mb-8">
        <motion.div 
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="w-full lg:w-1/2 space-y-8 relative z-20 text-right md:text-right"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 backdrop-blur-md shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-bold tracking-wide">المركز الأول في المـحـلـة الكـبـرى</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-[4rem] font-extrabold text-foreground leading-[1.15] tracking-tight text-balance">
              مركز <span className="text-transparent bg-clip-text bg-linear-to-l from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-400 drop-shadow-sm">The Drive Center</span><br />
              لضبط الزوايا والترصيص
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground/90 max-w-[90%] md:ml-auto leading-relaxed font-medium">
              فحص آلي حديث بأعلى دقة، ترصيص متطور، وتكويد باور ستيرنج لضمان ثبات تام وأداء مثالي لعربيتك على الطريق.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-start md:justify-start gap-4 pt-4">
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

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 rounded-2xl border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-bold px-8 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all cursor-pointer active:scale-95 hover:-translate-y-1"
              >
                <Link href="/cars" className="flex items-center gap-2">
                  عرض أعمالنا
                  <ArrowRight className="w-5 h-5 opacity-50 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 pt-8">
              {[
                { val: "99%", label: "دقة الفحص" },
                { val: "100+", label: "عميل راضي" },
                { val: "أحدث", label: "الأجهزة المتطورة" }
              ].map((stat, i) => (
                <Card key={i} className="flex flex-col p-4 rounded-2xl bg-card border border-border/50 shadow-sm min-w-[120px] py-4">
                  <div className="text-2xl md:text-3xl font-black text-foreground drop-shadow-sm">
                    {stat.val.replace(/[%+]/g, '')}
                    <span className="text-emerald-500">{stat.val.match(/[%+]/)?.[0]}</span>
                  </div>
                  <div className="text-[10px] md:text-xs font-black uppercase tracking-wider text-muted-foreground mt-1">{stat.label}</div>
                </Card>
              ))}
            </motion.div>
          </div>

          <motion.div 
            className="w-full lg:w-1/2 relative lg:h-[600px] flex items-center justify-center p-4 lg:p-0"
            variants={imageVariants}
          >
            <div className="w-full relative">
              <div className="absolute inset-0 -m-6 bg-linear-to-tr from-emerald-500/20 to-emerald-500/20 rounded-[3rem] blur-2xl -z-10 opacity-60" />
              <div className="relative w-full aspect-4/3 lg:aspect-square max-h-[500px] rounded-4xl overflow-hidden shadow-2xl border-4 border-white/50 dark:border-white/10 bg-black/5 group">
                <Image
                  src={activeImage}
                  alt="مركز خدمة The Drive Center"
                  fill
                  priority
                  className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
