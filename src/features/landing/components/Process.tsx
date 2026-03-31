"use client";

import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion, type Variants } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

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
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.section
      className="container mx-auto px-4 py-12 md:py-20"
      initial={prefersReducedMotion ? undefined : "hidden"}
      whileInView={prefersReducedMotion ? undefined : "visible"}
      viewport={prefersReducedMotion ? undefined : { once: true, margin: "-50px" }}
      variants={prefersReducedMotion ? undefined : sectionVariants}
    >
      <div className="grid gap-8 lg:grid-cols-2">
        {/* How we work */}
        <motion.div
          initial={prefersReducedMotion ? undefined : { y: 30, opacity: 0 }}
          whileInView={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <Card className="relative group overflow-hidden p-8 md:p-12 rounded-4xl border border-emerald-500/20 bg-card/40 backdrop-blur-md transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 py-12 hover:border-emerald-500/40">
            <CardContent>
              <motion.div
                initial={prefersReducedMotion ? undefined : { scale: 0.9, opacity: 0 }}
                whileInView={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              >
                <Badge
                  variant="outline"
                  className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5 px-4 h-8 rounded-full font-bold mb-4"
                >
                  طريقة الشغل
                </Badge>
              </motion.div>
              <motion.h2
                className="text-3xl font-black text-zinc-900 dark:text-white mb-8"
                initial={prefersReducedMotion ? undefined : { x: 20, opacity: 0 }}
                whileInView={prefersReducedMotion ? undefined : { x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
              >
                فحص منظم خطوة بخطوة
              </motion.h2>
              <div className="space-y-4">
                {steps.map((step, i) => (
                  <motion.div
                    key={step}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-100/30 dark:bg-zinc-800/30 hover:bg-emerald-500/5 transition-colors border border-transparent hover:border-emerald-500/10"
                    initial={prefersReducedMotion ? undefined : { x: 20, opacity: 0 }}
                    whileInView={prefersReducedMotion ? undefined : { x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 + i * 0.08 }}
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20">
                      {i + 1}
                    </div>
                    <p className="text-sm md:text-base font-medium text-zinc-700 dark:text-zinc-300">
                      {step}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Why us */}
        <motion.div
          initial={prefersReducedMotion ? undefined : { y: 30, opacity: 0 }}
          whileInView={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <Card className="relative group overflow-hidden p-8 md:p-12 rounded-4xl border border-emerald-500/20 bg-card/40 backdrop-blur-md transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 py-12 hover:border-emerald-500/40">
            <CardContent>
              <motion.div
                initial={prefersReducedMotion ? undefined : { scale: 0.9, opacity: 0 }}
                whileInView={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
              >
                <Badge
                  variant="outline"
                  className="text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-400/20 bg-emerald-500/5 dark:bg-emerald-400/5 px-4 h-8 rounded-full font-bold mb-4"
                >
                  ليه تختارنا
                </Badge>
              </motion.div>
              <motion.h2
                className="text-3xl font-black text-zinc-900 dark:text-white mb-8"
                initial={prefersReducedMotion ? undefined : { x: 20, opacity: 0 }}
                whileInView={prefersReducedMotion ? undefined : { x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
              >
                خدمة احترافية بتفاصيل تفرق
              </motion.h2>
              <div className="space-y-4">
                {strengths.map((item, i) => (
                  <motion.div
                    key={item}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-100/30 dark:bg-zinc-800/30 hover:bg-emerald-500/5 transition-colors border border-transparent hover:border-emerald-500/20"
                    initial={prefersReducedMotion ? undefined : { x: 20, opacity: 0 }}
                    whileInView={prefersReducedMotion ? undefined : { x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.4 + i * 0.08 }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 + i * 0.5 }}
                    >
                      <CheckCircle2 className="size-6 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    </motion.div>
                    <p className="text-sm md:text-base font-medium text-zinc-700 dark:text-zinc-300">
                      {item}
                    </p>
                  </motion.div>
                ))}
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
}
