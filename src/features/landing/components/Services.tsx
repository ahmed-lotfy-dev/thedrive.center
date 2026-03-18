"use client";

import { Gauge, Sparkles, Wrench, Search, CheckCircle2, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as motion from "motion/react-client";
import { Card, CardContent } from "@/components/ui/card";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const inspectionTools = [
  {
    title: "قلم فحص البوية",
    description: "الأداة الأساسية للكشف السريع عن وجود معجون أو رش في الأماكن الظاهرة.",
    image: "/services/paint-pen.png",
    level: "أساسي"
  },
  {
    title: "جهاز قياس سمك الدهان",
    description: "جهاز رقمي احترافي يقيس بالـ ميكرون لكشف أدق تفاصيل الرش وإعادة الدهان.",
    image: "/services/paint-gauge.png",
    level: "احترافي"
  },
  {
    title: "ماسح الأشعة (UV)",
    description: "أعلى تكنولوجيا فحص في العالم؛ تظهر العيوب والترميمات المخفية تماماً.",
    image: "/services/uv-scanner.png",
    level: "حصري"
  }
];

const secondaryServices = [
  {
    title: "ضبط زوايا كمبيوتر",
    description: "قياس دقيق لنقاط الزوايا عشان ثبات أعلى واستهلاك أقل.",
    icon: Gauge,
  },
  {
    title: "ترصيص واتزان",
    description: "حل مشكلة الرعشة والاهتزاز على السرعات المختلفة.",
    icon: Wrench,
  },
  {
    title: "تكويد الباور ستيرنج",
    description: "برمجة وتكويد إلكتروني لضمان أداء سلس وأمان كامل.",
    icon: Sparkles,
  }
];

export function Services() {
  return (
    <div className="space-y-12 md:space-y-20">
      {/* SECTION 1: COMPREHENSIVE INSPECTION HIGHLIGHT */}
      <motion.section 
        id="services" 
        className="container mx-auto px-4 md:px-6 pt-12 scroll-mt-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={sectionVariants as any}
      >
        <Card className="relative overflow-hidden rounded-4xl md:rounded-[4rem] bg-card/40 backdrop-blur-3xl border border-border/50 shadow-2xl transition-colors duration-500 py-12 md:py-20 lg:py-24">
          <CardContent className="p-0">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-emerald-500/5 pointer-events-none opacity-50 dark:opacity-100" />
            
            <div className="grid lg:grid-cols-12 gap-12 px-8 relative z-10">
              {/* Text Side */}
              <motion.div className="lg:col-span-5 space-y-8" variants={itemVariants as any}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 backdrop-blur-md">
                  <Search className="w-4 h-4" />
                  <span className="text-sm font-black tracking-widest uppercase">الخدمة الأقوى لدينا</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white leading-[1.1]">
                  الفحص <span className="text-emerald-500">الشامل</span> <br />قبل البيع والشراء
                </h2>
                
                <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                  بنقدم لك أدق تقرير فني في مصر لحالة الهيكل (البوية) والميكانيكا والعفشة، عشان تشتري وأنت مطمن ١٠٠٪.
                </p>
                
                <div className="space-y-4">
                   {[
                     "كشف كامل على دواخل وخوارج السيارة",
                     "تحديد أماكن الرش والمعجون وتصليحات الحوادث",
                     "تقرير مفصل يوضح حالة كل جزء بدقة",
                     "فحص بالكمبيوتر لجميع أنظمة السيارة"
                   ].map((item) => (
                     <div key={item} className="flex items-center gap-3 text-zinc-800 dark:text-zinc-200">
                       <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                       <span className="font-bold">{item}</span>
                     </div>
                   ))}
                </div>

                <div className="pt-6">
                  <Button asChild size="lg" className="h-16 rounded-3xl px-10 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg shadow-xl shadow-emerald-500/20 group">
                     <Link href="/book">
                       احجز فحص عربيتك دلوقتي
                       <ChevronLeft className="mr-2 w-5 h-5 transition-transform group-hover:-translate-x-1" />
                     </Link>
                  </Button>
                </div>
              </motion.div>

              {/* Visual/Tools Side */}
              <div className="lg:col-span-7 grid md:grid-cols-3 gap-4 lg:gap-6">
                 {inspectionTools.map((tool, idx) => (
                   <motion.div 
                     key={idx} 
                     variants={itemVariants as any}
                     className={cn(
                       "relative h-[300px] md:h-[400px] lg:h-[450px] rounded-3xl overflow-hidden group border border-border/50 shadow-lg",
                       idx === 1 ? "md:-translate-y-8" : ""
                     )}
                   >
                     <Image 
                       src={tool.image} 
                       alt={tool.title} 
                       fill 
                       className="object-cover transition-transform duration-700 group-hover:scale-110" 
                       sizes="(max-width: 768px) 100vw, 33vw"
                     />
                     <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
                     <div className="absolute inset-0 border-2 border-transparent group-hover:border-emerald-500/50 transition-colors rounded-3xl" />
                     
                     <div className="absolute bottom-6 left-4 right-4 text-right">
                       <Badge className="bg-emerald-500/20 border-emerald-500/50 text-emerald-400 mb-2 font-black text-[10px] uppercase">
                          {tool.level}
                       </Badge>
                       <h3 className="text-lg font-black text-white mb-1">{tool.title}</h3>
                       <p className="text-[11px] text-zinc-400 font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity">
                          {tool.description}
                       </p>
                     </div>
                   </motion.div>
                 ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* SECTION 2: MAINTENANCE SERVICES */}
      <motion.section 
        id="maintenance-services" 
        className="container mx-auto px-4 py-12 md:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={sectionVariants as any}
      >
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 px-4">
          <motion.div className="space-y-4" variants={itemVariants as any}>
            <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5 px-4 h-8 rounded-full font-bold">
              صيانة ودقة
            </Badge>
            <h2 className="text-balance text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-zinc-900 dark:text-white">
              خدمات <span className="text-emerald-500">الصيانة</span> المتخصصة
            </h2>
          </motion.div>
          <motion.div variants={itemVariants as any}>
            <p 
              className="max-w-md text-base sm:text-lg leading-relaxed text-muted-foreground font-medium border-r-4 border-emerald-500/20 pr-6"
            >
              بجانب الفحص، نقدم خدمات الضبط الدقيق بأحدث الأجهزة المتطورة لضمان أقصى درجات الثبات.
            </p>
          </motion.div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {secondaryServices.map(({ title, description, icon: Icon }, i) => (
            <motion.div key={title} variants={itemVariants as any}>
              <Card className="relative group overflow-hidden p-8 rounded-4xl border border-border/50 bg-card/40 backdrop-blur-md transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2 py-10">
                <CardContent>
                  <div className="mb-6 inline-flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-3 group-hover:text-emerald-500 transition-colors">{title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 font-medium">{description}</p>
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-l from-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
