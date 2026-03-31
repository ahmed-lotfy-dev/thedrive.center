"use client";

import { Gauge, Sparkles, Wrench, Search, CheckCircle2, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as motion from "motion/react-client";
import type { Variants } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Card, CardContent } from "@/components/ui/card";

const sectionVariants: Variants = {
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
    image: "/services/paint-gauge-v1.png",
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
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className="space-y-12 md:space-y-20">
      {/* SECTION 1: COMPREHENSIVE INSPECTION HIGHLIGHT */}
      <motion.section
        id="services"
        className="container mx-auto px-4 md:px-6 pt-12 scroll-mt-24"
        initial={prefersReducedMotion ? undefined : "hidden"}
        whileInView={prefersReducedMotion ? undefined : "visible"}
        viewport={prefersReducedMotion ? undefined : { once: true, margin: "-50px" }}
        variants={sectionVariants}
      >
        <Card className="relative overflow-hidden rounded-4xl md:rounded-[4rem] bg-card/40 backdrop-blur-3xl border border-emerald-500/20 shadow-2xl shadow-emerald-500/5 transition-all duration-500 hover:border-emerald-500/40 hover:shadow-emerald-500/10">
          {/* Animated glow border */}
          <div className="absolute inset-0 rounded-4xl md:rounded-[4rem] pointer-events-none">
            <div className="absolute inset-0 bg-linear-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 animate-pulse" />
          </div>
          <CardContent className="p-0">
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-emerald-500/5 pointer-events-none opacity-50 dark:opacity-100" />

            <div className="grid lg:grid-cols-12 gap-12 px-8 relative z-10">
              {/* Text Side */}
              <motion.div className="lg:col-span-5 space-y-8">
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 backdrop-blur-md"
                  initial={prefersReducedMotion ? undefined : { scale: 0.8, opacity: 0 }}
                  whileInView={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Search className="w-4 h-4" />
                  </motion.div>
                  <span className="text-sm font-black tracking-widest uppercase">الميزة الأهم والحصرية لدينا</span>
                </motion.div>

                <motion.h2
                  className="text-[clamp(2.25rem,5vw,3.75rem)] font-black text-zinc-900 dark:text-white leading-[1.1]"
                  initial={prefersReducedMotion ? undefined : { x: 30, opacity: 0 }}
                  whileInView={prefersReducedMotion ? undefined : { x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                >
                  الفحص <span className="text-emerald-500">الشامل</span> <br />قبل البيع والشراء
                </motion.h2>

                <motion.p
                  className="text-[clamp(1.125rem,1.5vw,1.25rem)] text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium"
                  initial={prefersReducedMotion ? undefined : { x: 30, opacity: 0 }}
                  whileInView={prefersReducedMotion ? undefined : { x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                >
                  بنقدم لك أدق تقرير فني في مصر لحالة الهيكل (البوية) والميكانيكا والعفشة، عشان تشتري وأنت مطمن ١٠٠٪.
                </motion.p>

                <div className="space-y-4">
                  {[
                    "كشف كامل على دواخل وخوارج السيارة",
                    "تحديد أماكن الرش والمعجون وتصليحات الحوادث",
                    "تقرير مفصل يوضح حالة كل جزء بدقة",
                    "فحص بالكمبيوتر لجميع أنظمة السيارة"
                  ].map((item, i) => (
                    <motion.div
                      key={item}
                      className="flex items-center gap-3 text-zinc-800 dark:text-zinc-200"
                      initial={prefersReducedMotion ? undefined : { x: 30, opacity: 0 }}
                      whileInView={prefersReducedMotion ? undefined : { x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.35 + i * 0.1 }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 + i * 0.5 }}
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      </motion.div>
                      <span className="font-bold">{item}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="pt-6"
                  initial={prefersReducedMotion ? undefined : { y: 20, opacity: 0 }}
                  whileInView={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
                >
                  <Button asChild size="lg" className="group h-16 rounded-3xl px-10 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:-translate-y-1">
                    <Link href="/book">
                      احجز فحص عربيتك دلوقتي
                      <motion.span
                        className="inline-block mr-2"
                        animate={{ x: [0, -5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </motion.span>
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Visual/Tools Side */}
              <div className="lg:col-span-7 grid md:grid-cols-3 gap-4 lg:gap-6">
                {inspectionTools.map((tool, idx) => (
                  <motion.div
                    key={tool.title}
                    initial={prefersReducedMotion ? undefined : { y: 40, opacity: 0, scale: 0.95 }}
                    whileInView={prefersReducedMotion ? undefined : { y: 0, opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.3 + idx * 0.15 }}
                    className={cn(
                      "relative h-75 md:h-100 lg:h-112.5 rounded-3xl overflow-hidden group border border-border/50 shadow-lg",
                      idx === 1 ? "" : "md:translate-y-6 lg:translate-y-10"
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

      {/* SECTION 1.5: OBD COMPUTER DIAGNOSTICS */}
      <motion.section
        className="container mx-auto px-4 md:px-6 py-8 md:py-12"
        initial={prefersReducedMotion ? undefined : "hidden"}
        whileInView={prefersReducedMotion ? undefined : "visible"}
        viewport={prefersReducedMotion ? undefined : { once: true, margin: "-50px" }}
        variants={prefersReducedMotion ? undefined : sectionVariants}
      >
        <Card className="relative overflow-hidden rounded-4xl md:rounded-[4rem] bg-card/40 backdrop-blur-3xl border border-emerald-500/20 shadow-2xl shadow-emerald-500/5 transition-all duration-500 hover:border-emerald-500/40 hover:shadow-emerald-500/10">
          {/* Animated glow border */}
          <div className="absolute inset-0 rounded-4xl md:rounded-[4rem] pointer-events-none">
            <div className="absolute inset-0 bg-linear-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 animate-pulse" />
          </div>

          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row">
              {/* Text Side */}
              <div className="flex-1 p-8 md:p-10 lg:p-12 flex flex-col justify-center space-y-6 order-2 lg:order-1 relative z-10 w-full lg:max-w-[55%]">

                <motion.h3
                  className="text-balance text-[clamp(2rem,3vw,2.5rem)] font-black text-zinc-900 dark:text-white leading-[1.2]"
                  initial={prefersReducedMotion ? undefined : { x: 30, opacity: 0 }}
                  whileInView={prefersReducedMotion ? undefined : { x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                >
                  جهاز فحص الأعطال <br/><span className="text-emerald-500">بالكمبيوتر (OBD)</span>
                </motion.h3>

                <motion.p
                  className="text-[clamp(1rem,1.5vw,1.125rem)] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-lg"
                  initial={prefersReducedMotion ? undefined : { x: 30, opacity: 0 }}
                  whileInView={prefersReducedMotion ? undefined : { x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                >
                  لم نكتفِ بالفحص الظاهري والميكانيكي. بل نوفر فحصاً إلكترونياً متكاملاً عبر أنظمة كشف الأعطال المتطورة للوصول الاستباقي لسجلات كمبيوتر السيارة (المحرك، الفتيس، ABS، الإيرباج). لضمان خلوها من أي أخطاء برمجية خفية وحمايتك من مخاطر الشراء.
                </motion.p>

                {/* Diagnostic modules */}
                <motion.div
                  className="flex flex-wrap gap-2"
                  initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                  whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  {["المحرك", "الفتيس", "ABS", "الإيرباج"].map((mod, i) => (
                    <motion.span
                      key={mod}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold"
                      initial={prefersReducedMotion ? undefined : { scale: 0, opacity: 0 }}
                      whileInView={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 + i * 0.1 }}
                    >
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      />
                      {mod}
                    </motion.span>
                  ))}
                </motion.div>
              </div>

              {/* Image Side */}
              <div className="relative flex-1 min-h-[300px] lg:min-h-[350px] overflow-hidden order-1 lg:order-2 group">
                <motion.div
                  initial={prefersReducedMotion ? undefined : { scale: 1.1, opacity: 0 }}
                  whileInView={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                  className="absolute inset-0"
                >
                  <Image
                    src="/services/obd-scanner-v3.png"
                    alt="جهاز فحص الأعطال بالكمبيوتر"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
                {/* Scanning line animation */}
                {!prefersReducedMotion && (
                  <motion.div
                    className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent z-20 pointer-events-none"
                    animate={{ top: ["0%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    style={{ boxShadow: "0 0 20px 4px rgba(16, 185, 129, 0.3)" }}
                  />
                )}
                {/* Desktop subtle blend fade */}
                <div className="absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-card to-transparent hidden lg:block pointer-events-none z-10" />
                {/* Mobile top/bottom blend fade */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-card to-transparent lg:hidden pointer-events-none z-10" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* SECTION 2: MAINTENANCE SERVICES */}
      <motion.section
        id="maintenance-services"
        className="container mx-auto px-4 py-6 md:py-12 pt-10"
        initial={prefersReducedMotion ? undefined : "hidden"}
        whileInView={prefersReducedMotion ? undefined : "visible"}
        viewport={prefersReducedMotion ? undefined : { once: true, margin: "-50px" }}
      >
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 px-4 py-10">
          <motion.div
            className="space-y-4"
            initial={prefersReducedMotion ? undefined : { y: 15, opacity: 0 }}
            whileInView={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <motion.div
              initial={prefersReducedMotion ? undefined : { scale: 0.9, opacity: 0 }}
              whileInView={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.15 }}
            >
              <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5 px-4 h-8 rounded-full font-bold">
                صيانة ودقة
              </Badge>
            </motion.div>
            <h2 className="text-balance text-[clamp(1.875rem,4vw,3rem)] font-black tracking-tight leading-tight text-zinc-900 dark:text-white">
              خدمات <span className="text-emerald-500">الصيانة</span> المتخصصة
            </h2>
          </motion.div>
          <motion.div
            initial={prefersReducedMotion ? undefined : { y: 15, opacity: 0 }}
            whileInView={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <p
              className="max-w-md text-[clamp(1rem,1.5vw,1.125rem)] leading-relaxed text-muted-foreground font-medium border-r-4 border-emerald-500/20 pr-6"
            >
              بجانب الفحص، نقدم خدمات الضبط الدقيق بأحدث الأجهزة المتطورة لضمان أقصى درجات الثبات.
            </p>
          </motion.div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {secondaryServices.map(({ title, description, icon: Icon }, idx) => (
            <motion.div
              key={title}
              initial={prefersReducedMotion ? undefined : { y: 20, opacity: 0 }}
              whileInView={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.15 + idx * 0.08 }}
            >
              <Card className="relative group overflow-hidden p-8 rounded-4xl border border-emerald-500/10 bg-card/40 backdrop-blur-md transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2 py-10 hover:border-emerald-500/30">
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
