import { seoKeywords } from "@/lib/seo-keywords";
import { FAQContent } from "./FAQContent";
import { faqs } from "./faq-data";

export const metadata = {
  title: "أسئلة شائعة عن فحص السيارات وضبط الزوايا | FAQ | The Drive Center",
  description:
    "إجابات على أهم أسئلة فحص السيارات قبل الشراء، ضبط الزوايا، والترصيص في المحلة الكبرى. اعرف خطوات الفحص ومتى تحتاج كل خدمة.",
  keywords: seoKeywords,
  alternates: {
    canonical: "/faq",
  },
};

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
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
      <FAQContent />
    </main>
  );
}
