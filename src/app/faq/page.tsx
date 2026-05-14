import { seoKeywords } from "@/lib/seo-keywords";
import { FAQContent } from "./FAQContent";
import { faqs } from "./faq-data";

export const metadata = {
  title: "أسئلة شائعة عن فحص السيارات وضبط الزوايا",
  description:
    "إجابات على أهم أسئلة فحص السيارات قبل الشراء، ضبط الزوايا، والترصيص في المحلة الكبرى. اعرف خطوات الفحص ومتى تحتاج كل خدمة.",
  keywords: seoKeywords,
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "أسئلة شائعة عن فحص السيارات وضبط الزوايا | The Drive Center",
    description:
      "إجابات على أهم أسئلة فحص السيارات قبل الشراء، ضبط الزوايا، والترصيص في المحلة الكبرى.",
    url: "/faq",
    siteName: "The Drive Center",
    locale: "ar_EG",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "أسئلة شائعة - The Drive Center" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "أسئلة شائعة عن فحص السيارات وضبط الزوايا | The Drive Center",
    description:
      "إجابات على أهم أسئلة فحص السيارات قبل الشراء، ضبط الزوايا، والترصيص في المحلة الكبرى.",
    images: ["/og-image.png"],
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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://thedrive.center" },
      { "@type": "ListItem", position: 2, name: "أسئلة شائعة", item: "https://thedrive.center/faq" },
    ],
  };

  return (
    <main dir="rtl" className="overflow-x-hidden pt-24 md:pt-32 pb-10">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <FAQContent />
    </main>
  );
}
