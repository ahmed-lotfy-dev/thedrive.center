import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, ClipboardCheck, Gauge, ShieldCheck, Sparkles, Timer, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocationSection } from "@/features/landing/components/LocationSection";

const services = [
  {
    title: "ضبط زوايا كمبيوتر",
    description: "قياس دقيق لنقاط الزوايا عشان ثبات أعلى واستهلاك إطارات أقل.",
    icon: Gauge,
  },
  {
    title: "ترصيص واتزان",
    description: "حل مشكلة الرعشة والاهتزاز على السرعات المختلفة بنتيجة واضحة.",
    icon: Wrench,
  },
  {
    title: "فحص شامل قبل البيع والشراء",
    description: "تشخيص كامل للحالة الفنية يساعدك تاخد قرارك بثقة.",
    icon: ClipboardCheck,
  },
  {
    title: "تقرير فني مفهوم",
    description: "بنشرح الحالة ببساطة ونقدم توصيات مباشرة بدون تعقيد.",
    icon: ShieldCheck,
  },
];

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

export default function Home() {
  return (
    <main dir="rtl" className="overflow-x-hidden pb-10">
      <section className="relative px-4 pb-20 pt-28 md:pt-36 ambient-grid">
        <span className="glow-orb h-56 w-56 bg-[#0f766e]/30 top-16 right-10" data-parallax="20" />
        <span className="glow-orb h-64 w-64 bg-[#111827]/25 bottom-12 left-10 delay-2" data-parallax="-16" />

        <div className="container mx-auto">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6" data-animate>
              <h1 className="max-w-3xl text-balance text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
                مركز احترافي لضبط الزوايا والترصيص وفحص العربية قبل البيع أو الشراء
              </h1>

              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                خدمة دقيقة وسريعة في المحلة الكبرى، بنتيجة واضحة وراحة في السواقة من أول مشوار.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild size="lg" className="h-12 rounded-full px-7 shine">
                  <Link href="/book">
                    احجز ميعادك دلوقتي
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 rounded-full px-7">
                  <Link href="#services">شوف الخدمات</Link>
                </Button>
              </div>

              <div className="grid max-w-2xl grid-cols-2 gap-3 pt-2 md:grid-cols-3">
                <article className="surface p-4">
                  <p className="text-xs text-muted-foreground">دقة الفحص</p>
                  <p className="mt-1 text-2xl font-bold">99%</p>
                </article>
                <article className="surface p-4">
                  <p className="text-xs text-muted-foreground">مواعيد العمل</p>
                  <p className="mt-1 text-base font-semibold">9 ص - 10 م</p>
                </article>
                <article className="surface col-span-2 p-4 md:col-span-1">
                  <p className="text-xs text-muted-foreground">مكاننا</p>
                  <p className="mt-1 text-base font-semibold">المحلة الكبرى</p>
                </article>
              </div>
            </div>

            <div className="reveal" data-animate>
              <article className="surface overflow-hidden p-3 shadow-[0_30px_80px_rgb(15_23_42/18%)]">
                <div className="relative h-[280px] overflow-hidden rounded-2xl md:h-[430px]">
                  <Image
                    src="/hero-car.jpg"
                    alt="سيارة حديثة تعبر عن جودة خدمة مركز ضبط الزوايا والترصيص"
                    fill
                    priority
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 right-4 left-4 rounded-xl border border-white/25 bg-black/35 p-4 backdrop-blur-sm">
                    <p className="text-sm font-semibold text-white">فحص متكامل بنتيجة دقيقة</p>
                    <p className="mt-1 text-xs text-white/85">ضبط زوايا + ترصيص + تقرير فني واضح قبل البيع والشراء.</p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

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

        <div className="grid gap-4 md:grid-cols-2">
          {services.map(({ title, description, icon: Icon }, i) => (
            <article key={title} className={`surface reveal p-6 transition-all tilt-hover ${i % 2 === 0 ? "delay-1" : "delay-2"}`}>
              <div className="mb-4 inline-flex rounded-xl bg-muted p-3 text-accent">
                <Icon className="size-5" />
              </div>
              <h3 className="text-2xl font-semibold">{title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </section>

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

      <section className="container mx-auto px-4 py-18" data-animate>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-[#0f172a] px-6 py-10 text-white md:px-10">
          <div className="pointer-events-none absolute -top-20 -left-14 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
          <p className="text-sm font-semibold text-cyan-200">جاهز لضبط العربية؟</p>
          <h2 className="mt-2 max-w-2xl text-3xl font-semibold md:text-4xl">
            احجز ميعادك في The Drive وخليك مطمّن على ثبات وأداء عربيتك
          </h2>
          <div className="mt-6">
            <Button asChild size="lg" className="h-12 rounded-full bg-white px-8 text-slate-900 hover:bg-white/90">
              <Link href="/book">احجز الآن</Link>
            </Button>
          </div>
        </div>
      </section>

      <LocationSection />
    </main>
  );
}
