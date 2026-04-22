import { seoKeywords } from "@/lib/seo-keywords";
import { FAQContent } from "./FAQContent";
import { faqs } from "./faq-data";
import { getSafeSiteUrl } from "@/lib/site-url";

export const metadata = {
  title: "أسئلة شائعة عن فحص السيارات وضبط الزوايا | FAQ | The Drive Center",
  description:
    "إجابات على كل أسئلتك عن فحص السيارات قبل الشراء، ضبط الزوايا، والترصيص. اعرف الفرق بين أجهزة الفحص وأهم النصائح قبل buying.",
  keywords: seoKeywords,
  alternates: {
    canonical: "/faq",
  },
};

export default function FAQPage() {
  const siteUrl = getSafeSiteUrl(process.env.NEXT_PUBLIC_APP_URL || "https://thedrive.center");

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
