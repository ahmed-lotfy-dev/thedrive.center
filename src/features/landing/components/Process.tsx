"use client";

import { Timer, CheckCircle2 } from "lucide-react";

const steps = [
  "استقبال العربية وتسجيل بياناتها بدقة.",
  "فحص الزوايا والترصيص بأجهزة معايرة حديثة.",
  "تسليم تقرير واضح مع توصيات عملية.",
];

const strengths = [
  "خبرة عملية في فحص وضبط السيارات بكل فئاتها.",
  "التزام بالمواعيد وسرعة تنفيذ بدون تنازل عن الجودة.",
  "معدات دقيقة ونتيجة تقدر تحس بيها في السواقة.",
  "تجربة عميل مريحة من أول استقبال لحد التسليم.",
];

export function Process() {
  return (
    <section className="container mx-auto px-4 pb-8" data-animate>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="surface-soft p-8 md:p-10">
          <p className="text-sm font-semibold text-accent">طريقة الشغل</p>
          <h2 className="mt-2 text-3xl font-semibold md:text-4xl">فحص منظم خطوة بخطوة</h2>
          <div className="mt-6 space-y-3">
            {steps.map((step, i) => (
              <p key={step} className={`surface reveal inline-flex w-full items-center gap-2 p-3 text-sm md:text-base ${i === 0 ? "delay-1" : i === 1 ? "delay-2" : "delay-3"}`}>
                <Timer className="size-4 text-accent" />
                {step}
              </p>
            ))}
          </div>
        </div>

        <div className="surface p-8 md:p-10">
          <p className="text-sm font-semibold text-accent">ليه تختارنا</p>
          <h2 className="mt-2 text-3xl font-semibold md:text-4xl">خدمة احترافية بتفاصيل تفرق</h2>
          <div className="mt-6 space-y-3">
            {strengths.map((item, i) => (
              <p key={item} className={`reveal inline-flex items-center gap-2 text-sm text-muted-foreground md:text-base ${i === 0 ? "delay-1" : i === 1 ? "delay-2" : "delay-3"}`}>
                <CheckCircle2 className="size-4 text-accent" />
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
