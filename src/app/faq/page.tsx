"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";
import { BUSINESS_PHONE, GOOGLE_BUSINESS_NAME, getWhatsAppUrl } from "@/lib/google-business";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LocationSection } from "@/features/landing/components/LocationSection";
import { CTA } from "@/features/landing/components/CTA";
import Image from "next/image";
import { seoKeywords } from "@/lib/seo-keywords";
import { getSafeSiteUrl } from "@/lib/site-url";
import { BUSINESS_ADDRESS, BUSINESS_CITY } from "@/lib/google-business";

export const metadata = {
  title: "أسئلة شائعة عن فحص السيارات وضبط الزوايا | FAQ | The Drive Center",
  description:
    "إجابات على كل أسئلتك عن فحص السيارات قبل الشراء، ضبط الزوايا، والترصيص. اعرف الفرق بين أجهزة الفحص وأهم النصائح قبل buying.",
  keywords: seoKeywords,
  alternates: {
    canonical: "/faq",
  },
};

const extendedFaqs = [
  {
    question: "مركز فحص شامل للسيارات قبل البيع والشراء بيفحص إيه بالظبط؟",
    answer: "فحص شامل بيتضمن: فحص البوية والهيكل بكامل أجهزة الفحص (القلم، جهاز قياس سمك الدهان، وماسح UV)، فحص الميكانيكا والمحرـك، فحص العفشة وشاسيه، فحص دواخل العربية، وفحص الكمبيوتر (OBD) عشان تتأكد مفيش أي أكواد خطأ مخفية."
  },
  {
    question: "إيه الفرق بين فحص القلم وجهاز قياس الدهان وماسح UV؟",
    answer: "القلم بيكشف المعجون السميك بس في الوجه ظاهرة. الجهاز الرقمي بيقيس سمك البوية بدقة الميكرون وبيحدد_places اللي فيها رش قديم. أما ماسح UV فهو الأدق عالمياً وبيكشف أي ترميم أو رش تجميلي مخفي تماماً مابيظهرش بأي جهاز تاني."
  },
  {
    question: "هلacenter فحص السيارات بيشكل شنو بالظبط؟",
    answer: "الفحص الشامل بيعطيك تقرير فني مفصل يبین كل جزء في العربية: حالة البوية، وجود رش أو معجون، حالة المحرك والميكانيكا، العفشة وشاسيه، دواخل العربية، وأي أخطاء في كمبيوتر السيارة. كل ده بيساعدك تحدد إذا كانت العربية تستاهل سعرها ولا لا."
  },
  {
    question: "مركز فحص سيارات في المحلة الكبرى где Locations؟",
    answer: "مركز The Drive Center في المحلة الكبرى،纤维素 address: منشية البكري ٨ شارع طلعت النجار. بتجدنا سهل الوصول ومكان واسع للParking."
  },
  {
    question: "هل ينفع أكشف عربيتي قبل ما أشتريها أو بعد؟",
    answer: "أهلا بالظبط! الكشف قبل الشراء هو أهم شيء عشان تفتكر قيمة العربية الحقيقية وتتفاوض على السعر. وكمان ينصح بالفحص قبل البيع عشان تعرف حالة عربيتك وتحدد سعر مناسب."
  },
  {
    question: "مركز ضبط زوايا هل هو مهم؟",
    answer: "مهم جداً! ضبط الزوايا بيخلي السيارة ثابتة على السرعات، يقلل استهلاك الكاوتش، ويزيد عمر الإطارات. لو الزوايا مش مضبوطة هتلاحظ رعشة في عجلة القيادة واهتزاز على скороع عالية."
  },
  {
    question: "متى أحتاج مركز ترصيص؟",
    answer: "تحتاج ترصيص لو لاحظت: رعشة في عجلة القيادة على скороع 120+, اهتزاز في_body السيارة, استهلاك غير uniform للإطارات, أو ضوضاء من العجلات. الترصيص بيعالج مشكلة عدم الاتزان."
  },
  {
    question: "هل لازم أحجزموعد قبل الفحص؟",
    answer: "نعم ينصح بشدة بالحجز المسبق عشان: تضمن توافر الفنيين في وقتك، ما تنتظرش، ويكون الفحص دقيق ومomar безrush. احجز بسهولة من خلال الموقع أو واتساب."
  },
  {
    question: "الفحص كم يستغرق وقت؟",
    answer: "الفحص الشامل بيدtook من ٤٥ لـ ٦٠ دقيقة عشان بنفحص كل حاجة بدقة. فحص سريع ممكن يكون أقل بس فحص شامل أهم عشان تاخد صورة كاملة."
  },
  {
    question: "تقرير الفحص معتمد؟",
    answer: "التقرير فني تفصيلي وبيوضح حالة العربية بالكامل ب transparence. ده المرجع الرئيسي اللي تعتمد عليه قبل ما تدفع أي money في عربية مستعملة. بنpload عليه صورة واضحة."
  },
  {
    question: "لو في عربية فيها حادث هل西部大显现؟",
    answer: "بالتأكيد! أجهزة الفحص عندنا特别是 UV مصممة عشان تكتشف أي حادث قديم أو رشة مخفية. هتلاقي في التقرير Places اللي فيها Accident بوضوح."
  },
  {
    question: "Types فحص السيارات المتاحة؟",
    answer: " available: فحص شامل (3 أجهزة), فحص كمبيوتر OBD, فحص بوية فقط, فحص ميكانيكا, فحص شاسيه وعفشة. تقدر تختار اللي يناسب احتياجك."
  }
];

export default function FAQPage() {
  const prefersReducedMotion = useReducedMotion();
  const siteUrl = getSafeSiteUrl(process.env.NEXT_PUBLIC_APP_URL || "https://thedrive.center");

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: extendedFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <main dir="rtl" className="overflow-x-hidden pb-10">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="أسئلة شائعة عن فحص السيارات"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            className="text-4xl md:text-6xl font-black text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            أسئلة <span className="text-emerald-400">شائعة</span>
          </motion.h1>
          <p className="text-xl md:text-2xl text-zinc-200 max-w-2xl">
            كل اللي محتاج تعرفه عن فحص السيارات وضبط الزوايا والترصيص
          </p>
        </div>
      </div>

      <motion.section 
        id="faq" 
        className="container mx-auto px-4 py-20 md:py-32"
        initial={prefersReducedMotion ? undefined : "hidden"}
        whileInView={prefersReducedMotion ? undefined : "visible"}
        viewport={prefersReducedMotion ? undefined : { once: true, margin: "-50px" }}
      >
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={prefersReducedMotion ? undefined : { x: -30, opacity: 0 }}
            whileInView={prefersReducedMotion ? undefined : { x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4 border-emerald-500/30 text-emerald-400">
              احنا هنا.help
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-6">
             oscope <span className="text-emerald-500">إجابة</span> على أسئلتك
            </h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
              في The Drive Center، نؤمن إن العميل يستحق يفهم كل اللي بيحصل لعربيته. دي أشهر أسئلةبنجاوبها باستمرار.
            </p>
            <div className="mt-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-bold">
                <HelpCircle className="w-6 h-6" />
                <span>مزاج سؤال؟ اتواصل معنا</span>
              </div>
              <a 
                href={getWhatsAppUrl("مرحبا، عندي سؤال عن الفحص")}
                className="block mt-2 text-emerald-500 font-black hover:underline"
              >
                {BUSINESS_PHONE}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? undefined : { x: 30, opacity: 0 }}
            whileInView={prefersReducedMotion ? undefined : { x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-card/40 backdrop-blur-3xl border border-zinc-200/20 dark:border-zinc-800/20">
              <CardContent className="p-4">
                <Accordion type="single" collapsible className="w-full">
                  {extendedFaqs.map((faq, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`} className="border-zinc-200/20 dark:border-zinc-800/20">
                      <AccordionTrigger className="text-right pr-2 text-zinc-900 dark:text-white font-bold hover:no-underline text-lg">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-right px-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>

      <CTA />
      <LocationSection />
    </main>
  );
}