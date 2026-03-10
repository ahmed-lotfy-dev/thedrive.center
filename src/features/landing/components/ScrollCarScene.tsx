"use client";

import { useEffect, useRef } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function ScrollCarScene() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const roadRef = useRef<HTMLDivElement | null>(null);
  const carRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const road = roadRef.current;
    const car = carRef.current;

    if (!section || !road || !car) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      const staticOffset = Math.max(0, (road.clientWidth - 130) * 0.15);
      car.style.setProperty("--car-x", `${staticOffset}px`);
      car.style.setProperty("--car-bob", "0px");
      car.style.setProperty("--wheel-rot", "0deg");
      return;
    }

    let frame: number | null = null;

    const update = () => {
      frame = null;
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const progress = clamp((viewportHeight - rect.top) / (rect.height + viewportHeight), 0, 1);
      const travel = Math.max(0, road.clientWidth - 130);

      car.style.setProperty("--car-x", `${travel * progress}px`);
      car.style.setProperty("--car-bob", `${Math.sin(progress * Math.PI * 8) * 2}px`);
      car.style.setProperty("--wheel-rot", `${progress * 1080}deg`);
    };

    const requestUpdate = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] py-6"
      aria-label="حركة السيارة أثناء التمرير"
      data-animate
    >
      <div className="sticky top-24">
        <div className="container mx-auto px-4">
          <div className="surface overflow-hidden p-8 lg:p-10">
            <div className="mb-8 max-w-2xl space-y-3">
              <p className="text-sm font-semibold text-accent">فحص خطوة بخطوة</p>
              <h2 className="text-balance text-3xl md:text-4xl font-semibold">
                عملية منظمة تضمنلك نتيجة دقيقة وواضحة
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                مع النزول في الصفحة، هتشوف مسار الخدمة من أول استقبال العربية لحد تسليم تقرير الفحص.
              </p>
            </div>

            <div ref={roadRef} className="relative mt-10 h-36 rounded-xl border border-border bg-muted/60 px-5">
              <div className="absolute inset-x-6 top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary/20" />
              <div className="absolute inset-x-8 top-1/2 h-0.5 -translate-y-1/2 border-t-2 border-dashed border-accent/70" />

              <div ref={carRef} className="scroll-car absolute left-0 top-1/2 w-[130px] -translate-y-[58%]">
                <div className="relative h-11 rounded-xl bg-gradient-to-r from-[#0f766e] to-[#14b8a6] shadow-md">
                  <div className="absolute -right-2 top-2 h-6 w-2 rounded-sm bg-[#5eead4]" />
                  <div className="absolute left-4 top-1 h-4 w-8 rounded-md bg-[#113336]/50" />
                </div>
                <div className="absolute -bottom-3 left-3 flex gap-12">
                  <span className="wheel h-6 w-6 rounded-full border-2 border-primary/60 bg-background" />
                  <span className="wheel h-6 w-6 rounded-full border-2 border-primary/60 bg-background" />
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
              <p className="surface-soft p-3">1) استقبال العربية وتسجيل البيانات</p>
              <p className="surface-soft p-3">2) فحص وضبط بالأجهزة الحديثة</p>
              <p className="surface-soft p-3">3) تسليم التقرير والتوصيات</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
