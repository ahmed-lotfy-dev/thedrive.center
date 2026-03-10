import { Button } from "@/components/ui/button";
import { MercedesGClassScene } from "@/components/features/landing/MercedesGClassScene";
import { LocationSection } from "@/features/landing/components/LocationSection";
import { ScrollCarScene } from "@/features/landing/components/ScrollCarScene";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  Gauge,
  ShieldCheck,
  Sparkles,
  Timer,
  Wrench,
} from "lucide-react";

const services = [
  {
    title: "ضبط زوايا بالكمبيوتر",
    description: "قياس دقيق لزوايا العجل لتثبيت العربية وتقليل تآكل الإطارات.",
    icon: Gauge,
    tone: "from-[#0f766e]/15 to-transparent",
  },
  {
    title: "فحص شامل قبل البيع والشراء",
    description: "تقرير تفصيلي عن الحالة الفنية يساعدك تقرر بثقة.",
    icon: ClipboardCheck,
    tone: "from-[#1f2933]/12 to-transparent",
  },
  {
    title: "ترصيص واتزان احترافي",
    description: "تقليل الاهتزاز على السرعات العالية وتحسين نعومة القيادة.",
    icon: Wrench,
    tone: "from-[#0ea5a3]/15 to-transparent",
  },
  {
    title: "تقرير واضح وسريع",
    description: "نتيجة مفهومة باللغة البسيطة مع توصيات عملية مباشرة.",
    icon: ShieldCheck,
    tone: "from-[#334155]/14 to-transparent",
  },
];

const highlights = [
  "أجهزة حديثة ودقة تشخيص عالية",
  "فريق فني بخبرة كبيرة في المجال",
  "التزام بالمواعيد وسرعة في التنفيذ",
  "تجربة عميل محترمة من أول دقيقة",
];

export default function Home() {
  return (
    <main dir="rtl" className="overflow-x-hidden pb-8 pt-24 md:pt-28">
      <section className="relative pt-8 md:pt-10 pb-24 px-4 ambient-grid">
        <span className="glow-orb h-40 w-40 bg-[#0f766e]/40 top-14 right-12" data-parallax="26" />
        <span className="glow-orb h-52 w-52 bg-[#1f2933]/30 bottom-8 left-10 delay-2" data-parallax="-18" />

        <div className="container mx-auto">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-end">
            <div className="space-y-6" data-animate>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground">
                <Sparkles className="size-3.5 text-accent" />
                The Drive Center
              </span>

              <h1 className="max-w-3xl text-balance text-5xl md:text-6xl font-semibold leading-tight">
                مركز متخصص لضبط الزوايا والترصيص بمنهج فحص احترافي
              </h1>

              <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
                هدفنا إنك تخرج من المركز وعربيتك ثابتة، وتقريرك واضح، وقرارك مطمّن سواء هتبيع أو تشتري.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild size="lg" className="h-12 rounded-full px-7 shine">
                  <Link href="/book">
                    احجز ميعادك الآن
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 rounded-full px-7">
                  <Link href="#services">شوف الخدمات</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-4" data-animate>
              <MercedesGClassScene />
              <div className="grid gap-3 sm:grid-cols-3">
                <article className="surface p-4 float-y tilt-hover">
                  <p className="text-xs text-muted-foreground">دقة التشخيص</p>
                  <p className="mt-1 text-xl font-bold">99.1%</p>
                </article>
                <article className="surface p-4 float-y delay-1 tilt-hover">
                  <p className="text-xs text-muted-foreground">عملاء تم خدمتهم</p>
                  <p className="mt-1 text-xl font-bold">10K+</p>
                </article>
                <article className="surface p-4 float-y delay-2 tilt-hover">
                  <p className="text-xs text-muted-foreground">المواعيد</p>
                  <p className="mt-1 text-base font-semibold">9 ص - 10 م</p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="container mx-auto px-4 py-24" data-animate>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-accent">الخدمات الأساسية</p>
            <h2 className="mt-2 text-4xl md:text-5xl font-semibold text-balance">
              كل اللي عربيتك محتاجاه في مكان واحد
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground leading-relaxed">
            بنمشي بخطة فحص واضحة، ونقدم نتيجة دقيقة وسريعة بطريقة مفهومة.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {services.map(({ title, description, icon: Icon, tone }, i) => (
            <article
              key={title}
              className={`surface relative p-6 transition-all tilt-hover reveal ${
                i % 3 === 0 ? "delay-1" : i % 3 === 1 ? "delay-2" : "delay-3"
              }`}
            >
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tone} rounded-2xl`} />
              <div className="relative">
                <div className="mb-4 inline-flex rounded-xl bg-muted p-3 text-accent">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-2xl font-semibold">{title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-10" data-animate>
        <div className="surface-soft p-8 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-accent">ليه تختارنا</p>
              <h2 className="mt-2 text-3xl md:text-4xl font-semibold">خدمة احترافية بتفاصيل تفرق</h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
              <Timer className="size-3.5 text-accent" />
              سرعة + دقة + وضوح
            </span>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {highlights.map((item, i) => (
              <p
                key={item}
                className={`surface p-3 inline-flex items-center gap-2 text-sm md:text-base reveal ${
                  i % 3 === 0 ? "delay-1" : i % 3 === 1 ? "delay-2" : "delay-3"
                }`}
              >
                <CheckCircle2 className="size-4 text-accent" />
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      <ScrollCarScene />
      <LocationSection />
    </main>
  );
}



