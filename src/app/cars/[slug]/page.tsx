import { db } from "@/db";
import { cars } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ShowcaseCar, ShowcaseCarWithMedia } from "@/types/showcase";
import { CarDetailsView } from "@/features/cars/components/CarDetailsView";
import type { Metadata } from "next";
import { seoKeywords } from "@/lib/seo-keywords";
import { GOOGLE_BUSINESS_NAME } from "@/lib/google-business";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

function getServiceSeoLabel(serviceType?: string) {
  if (serviceType === "alignment_balancing") return "مركز ضبط و ظبط زوايا وترصيص";
  if (serviceType === "inspection") return "مركز فحص سيارات شامل";
  if (serviceType === "steering_coding") return "مركز تكويد باور ستيرنج";
  return "مركز خدمات سيارات";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const car = (await db.query.cars.findFirst({
    where: eq(cars.slug, slug),
  })) as ShowcaseCar | undefined;

  if (!car) return { title: "غير موجود" };

  const serviceLabel = getServiceSeoLabel(car.serviceType);
  const fallbackDescription = `شاهد تفاصيل ${serviceLabel} لسيارة ${car.title} في The Drive Center بالمحلة الكبرى.`;

  return {
    title: car.title,
    description: car.description?.substring(0, 160) || fallbackDescription,
    keywords: seoKeywords,
    alternates: {
      canonical: `/cars/${slug}`,
    },
    openGraph: {
      title: car.title,
      description: car.description?.substring(0, 160) || fallbackDescription,
      url: `/cars/${slug}`,
      siteName: GOOGLE_BUSINESS_NAME,
      locale: "ar_EG",
      type: "website",
      images: car.coverImageUrl
        ? [{ url: car.coverImageUrl, width: 1200, height: 630, alt: car.title }]
        : [{ url: "/og-image.png", width: 1200, height: 630, alt: car.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: car.title,
      description: car.description?.substring(0, 160) || fallbackDescription,
      images: car.coverImageUrl ? [car.coverImageUrl] : ["/og-image.png"],
    },
  };
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car = (await db.query.cars.findFirst({
    where: eq(cars.slug, slug),
    with: {
      media: true,
    },
  })) as ShowcaseCarWithMedia | undefined;

  if (!car) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const isManagement = userRole === "admin" || userRole === "owner";

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${getServiceSeoLabel(car.serviceType)} - ${car.title}`,
    description: car.description || `تفاصيل خدمة ${getServiceSeoLabel(car.serviceType)} لهذه السيارة.`,
    url: `/cars/${car.slug}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://thedrive.center" },
      { "@type": "ListItem", position: 2, name: "سجل التميز", item: "https://thedrive.center/cars" },
      { "@type": "ListItem", position: 3, name: car.title, item: `https://thedrive.center/cars/${car.slug}` },
    ],
  };

  return (
    <div className="bg-background">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CarDetailsView car={car} isManagement={isManagement} />
    </div>
  );
}
