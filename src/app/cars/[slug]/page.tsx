import { db } from "@/db";
import { cars } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PortfolioCar, PortfolioCarWithMedia } from "@/types/portfolio";
import { CarDetailsView } from "@/features/cars/components/CarDetailsView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car = (await db.query.cars.findFirst({
    where: eq(cars.slug, slug),
  })) as PortfolioCar | undefined;

  if (!car) return { title: "غير موجود" };

  return {
    title: `${car.title} | The Drive Center`,
    description:
      car.description?.substring(0, 160) ||
      `تم ضبط زوايا وترصيص ${car.title} بأعلى جودة.`,
    alternates: {
      canonical: `/cars/${slug}`,
    },
    openGraph: {
      images: [car.coverImageUrl],
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
  })) as PortfolioCarWithMedia | undefined;

  if (!car) notFound();

  return (
    <main dir="rtl" className="min-h-screen bg-background">
      <CarDetailsView car={car} />
    </main>
  );
}
