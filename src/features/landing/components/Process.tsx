"use client";

import { Timer, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
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
  return (
    <motion.section 
      className="container mx-auto px-4 py-12 md:py-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants as any}
    >
      <div className="grid gap-8 lg:grid-cols-2">
        {/* How we work */}
        <motion.div variants={cardVariants as any}>
          <Card className="relative group overflow-hidden p-8 md:p-12 rounded-4xl border border-border/50 bg-card/40 backdrop-blur-md transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 py-12">
            <CardContent>
              <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5 px-4 h-8 rounded-full font-bold mb-4">
                طريقة الشغل
              </Badge>
              <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-8">فحص منظم خطوة بخطوة</h2>
              <div className="space-y-4">
                {steps.map((step, i) => (
                  <div key={step} className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-100/30 dark:bg-zinc-800/30 hover:bg-emerald-500/5 transition-colors border border-transparent hover:border-emerald-500/10">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20">
                      {i + 1}
                    </div>
                    <p className="text-sm md:text-base font-medium text-zinc-700 dark:text-zinc-300">{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Why us */}
        <motion.div variants={cardVariants as any}>
          <Card className="relative group overflow-hidden p-8 md:p-12 rounded-4xl border border-border/50 bg-card/40 backdrop-blur-md transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 py-12">
            <CardContent>
              <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-400/20 bg-emerald-500/5 dark:bg-emerald-400/5 px-4 h-8 rounded-full font-bold mb-4">
                ليه تختارنا
              </Badge>
              <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-8">خدمة احترافية بتفاصيل تفرق</h2>
              <div className="space-y-4">
                {strengths.map((item, i) => (
                  <div key={item} className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-100/30 dark:bg-zinc-800/30 hover:bg-emerald-500/5 transition-colors border border-transparent hover:border-emerald-500/20">
                    <CheckCircle2 className="size-6 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    <p className="text-sm md:text-base font-medium text-zinc-700 dark:text-zinc-300">{item}</p>
                  </div>
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
