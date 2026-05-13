"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";
import { BUSINESS_PHONE, getWhatsAppUrl } from "@/lib/google-business";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LocationSection } from "@/features/landing/components/LocationSection";
import { CTA } from "@/features/landing/components/CTA";
import Image from "next/image";
import { faqs } from "./faq-data";

export function FAQContent() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
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
              إجابات واضحة
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-6">
              أهم <span className="text-emerald-500">الإجابات</span> قبل زيارتك
            </h2>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
              في The Drive Center، نؤمن إن العميل يستحق يفهم كل اللي بيحصل لعربيته. دي أشهر أسئلة بنجاوبها باستمرار.
            </p>
            <div className="mt-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-bold">
                <HelpCircle className="w-6 h-6" />
                <span>عندك سؤال؟ تواصل معنا</span>
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
                  {faqs.map((faq, idx) => (
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
    </>
  );
}
