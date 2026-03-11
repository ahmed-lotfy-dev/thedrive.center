"use client";

import { Gauge, Sparkles, Wrench, ClipboardCheck, ShieldCheck } from "lucide-react";

const services = [
  {
    title: "ضبط زوايا كمبيوتر",
    description: "قياس دقيق لنقاط الزوايا عشان ثبات أعلى واستهلاك إطارات أقل.",
    icon: Gauge,
  },
  {
    title: "تكويد الباور ستيرنج",
    description: "برمجة وتكويد إلكتروني لضمان أداء سلس وأمان كامل لنظام التوجيه.",
    icon: Sparkles,
  },
  {
    title: "ترصيص واتزان",
    description: "حل مشكلة الرعشة والاهتزاز على السرعات المختلفة بنتيجة واضحة.",
    icon: Wrench,
  },
  {
    title: "فحص شامل بأحدث الأجهزة",
    description: "تشخيص كامل بالكمبيوتر والفحص الدقيق بأشعة UV للكشف عن رش الدهان.",
    icon: ClipboardCheck,
  },
  {
    title: "تقرير فني مفهوم",
    description: "بنشرح الحالة ببساطة ونقدم توصيات مباشرة بدون تعقيد.",
    icon: ShieldCheck,
  },
];

export function Services() {
  return (
    <section id="services" className="container mx-auto px-4 py-24" data-animate>
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-sm font-semibold text-accent">الخدمات الأساسية</p>
          <h2 className="mt-2 text-balance text-4xl font-semibold md:text-5xl">كل اللي عربيتك محتاجاه في مكان واحد</h2>
        </div>
        <p className="max-w-md leading-relaxed text-muted-foreground">
          بنشتغل بمنهج واضح من الاستقبال للتقرير النهائي، عشان تبقى عارف حالة عربيتك بكل شفافية.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map(({ title, description, icon: Icon }, i) => (
          <article key={title} className={`surface reveal p-6 transition-all tilt-hover ${i % 2 === 0 ? "delay-1" : "delay-2"}`}>
            <div className="mb-4 inline-flex rounded-xl bg-muted p-3 text-accent">
              <Icon className="size-5" />
            </div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
