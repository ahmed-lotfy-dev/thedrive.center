"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";
import { BUSINESS_PHONE } from "@/lib/google-business";
import * as motion from "motion/react-client";
import { Card, CardContent } from "@/components/ui/card";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const faqs = [
  {
    question: "إيه الفرق بين فحص القلم والجهاز الرقمي والـ UV؟",
    answer: "القلم بيكشف المعجون السميك فقط، الجهاز الرقمي بيقيس سمك البوية بدقة الميكرون، أما الـ UV فهو الأدق عالمياً وبيكشف أي ترميم أو رش تجميلي مخفي تماماً مبيبانش بالأجهزة التانية."
  },
  {
    question: "هل التقرير اللي باخده معتمد؟",
    answer: "التقرير فني تفصيلي بيوضح حالة العربية بالكامل بأمانة وشفافية مطلقة، وهو المرجع الأساسي ليك قبل ما تدفع أي مبلغ في العربية."
  },
  {
    question: "الفحص بياخد وقت قد إيه؟",
    answer: "الفحص الشامل الدقيق بياخد من ٤٥ لـ ٦٠ دقيقة، عشان بنفحص كل مسمار في العربية ونطلع لك تقرير وافي."
  },
  {
    question: "لو العربية فيها رشة 'حزام' أو تجميلي بيبان؟",
    answer: "أكيد، أجهزة الفحص عندنا وخاصة الـ UV مصممة مخصوص عشان تفرق بين الرش التجميلي الخفيف وبين رش الحوادث أو تغيير قطع الغيار."
  },
  {
    question: "هل بتحتاج أحجز موعد مسبق؟",
    answer: "يفضل جداً الحجز لضمان عدم الانتظار وتوافر الفنيين المتخصصين في وقتك، تقدر تحجز بسهولة من خلال الموقع هنا."
  }
];

export function FAQ() {
  return (
    <motion.section 
      id="faq" 
      className="container mx-auto px-4 py-20 md:py-32"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants as any}
    >
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <motion.div className="space-y-6" variants={itemVariants as any}>
          <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5 px-4 h-8 rounded-full font-bold">
            أسئلة شائعة
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white leading-tight">
            كل اللي <span className="text-emerald-500">محتاج تعرفه</span> <br />عن خدماتنا
          </h2>
          <p className="text-lg text-muted-foreground font-medium max-w-md">
            جمعنا لك أكتر الأسئلة اللي بتشغل بال عملائنا قبل البيع والشراء، لو عندك سؤال تاني متترددش تكلمنا.
          </p>
          
          <Card className="bg-card/40 backdrop-blur-md border border-border/50 relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/5 py-8">
            <CardContent className="relative z-10">
              <HelpCircle className="w-12 h-12 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-white">لسه عندك استفسار؟</h3>
              <p className="text-zinc-500 dark:text-zinc-400 mb-4 font-medium text-sm">
                فريقنا الفني جاهز للرد على كل تساؤلاتك بخصوص حالة عربيتك.
              </p>
              <a href={`tel:+2${BUSINESS_PHONE}`} className="text-emerald-600 dark:text-emerald-400 font-black hover:underline underline-offset-4">
                كلمنا دلوقتي: {BUSINESS_PHONE}
              </a>
            </CardContent>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
          </Card>
        </motion.div>

        <motion.div variants={itemVariants as any}>
          <Card className="bg-card/40 backdrop-blur-md p-6 md:p-10 rounded-4xl md:rounded-[3rem] border border-border/50 shadow-xl py-10">
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, idx) => (
                  <AccordionItem 
                    key={idx} 
                    value={`faq-${idx}`} 
                    className="border-b border-border/50 last:border-0"
                  >
                    <AccordionTrigger className="text-right font-black text-base md:text-lg py-6 hover:text-emerald-500 hover:no-underline transition-colors leading-relaxed">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-right text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-loose font-medium pb-6">
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
  );
}
