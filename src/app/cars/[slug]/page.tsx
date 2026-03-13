import { db } from "@/db";
import { cars, carMedia } from "@/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VideoEmbed } from "@/components/shared/VideoEmbed";
import { ArrowLeft, Calendar, Info, Share2, Facebook, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

import { PortfolioCar, PortfolioCarWithMedia } from "@/types/portfolio";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const car = await db.query.cars.findFirst({
    where: eq(cars.slug, slug),
  }) as PortfolioCar | undefined;

  if (!car) return { title: "غير موجود" };

  return {
    title: `${car.title} | The Drive Center`,
    description: car.description?.substring(0, 160) || `تم ضبط زوايا وترصيص ${car.title} بأعلى جودة.`,
    openGraph: {
      images: [car.coverImageUrl],
    },
  };
}

export default async function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  console.log("DEBUG: CarDetailPage slug:", slug);
  const car = await db.query.cars.findFirst({
    where: eq(cars.slug, slug),
    with: {
      media: true,
    },
  }) as PortfolioCarWithMedia | undefined;
  console.log("DEBUG: Car found:", car ? car.title : "NOT FOUND");

  if (!car) notFound();

  return (
    <main dir="rtl" className="min-h-screen bg-background pt-24 md:pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Breadcrumbs / Back */}
        <Link 
          href="/cars" 
          className="inline-flex items-center gap-2 text-emerald-500 font-bold hover:gap-3 transition-all mb-6 md:mb-10 group bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">العودة لسجل الخدمة</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Left Column: Portrait Video (if available) */}
          {car.videoUrl && (
            <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
              <div className="space-y-4">
                <h3 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
                   <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                   فيديو العمل
                </h3>
                <VideoEmbed url={car.videoUrl} title={`فيديو ${car.title}`} />
              </div>
            </div>
          )}

          {/* Center/Right Column: Image & Info */}
          <div className={cn(
            "space-y-10",
            car.videoUrl ? "lg:col-span-8" : "lg:col-span-8 lg:col-start-3"
          )}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Reduced Main Image */}
              <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden shadow-xl border border-zinc-200 dark:border-zinc-800">
                <Image
                  src={car.coverImageUrl}
                  alt={car.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-emerald-500 text-white font-bold h-8 px-4 rounded-xl shadow-lg border-emerald-400 text-xs">
                    {car.serviceType === 'alignment_balancing' ? 'ضبط زوايا' : car.serviceType}
                  </Badge>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-lg h-fit">
                <h1 className="text-2xl font-black text-zinc-900 dark:text-white mb-2 leading-tight">
                  {car.title}
                </h1>
                <div className="flex items-center gap-2 text-zinc-500 text-xs mb-6">
                   <Calendar className="w-3.5 h-3.5" />
                   <span>{new Date(car.createdAt!).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="space-y-4">
                  <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-base line-clamp-4">
                    {car.description}
                  </p>
                  <Button asChild className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm">
                    <Link href="/book">احجز موعداً الآن</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            {car.media && car.media.length > 0 && (
              <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-800 pt-8">
                <h3 className="text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
                   <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                   معرض الصور
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {car.media.map((item) => (
                    <div key={item.id} className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:scale-105 transition-transform duration-500 cursor-zoom-in">
                       <Image
                         src={item.url}
                         alt="صورة العمل"
                         fill
                         className="object-cover"
                         sizes="(max-width: 768px) 50vw, 25vw"
                       />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Full Description & Share (Optional) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
               <div className="space-y-4">
                  <h4 className="flex items-center gap-2 text-sm font-black text-zinc-400 uppercase tracking-widest">
                    <Info className="w-4 h-4" />
                    عن الخدمة
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed italic">
                    {car.description}
                  </p>
               </div>
               <div className="space-y-4">
                  <h4 className="text-sm font-black text-zinc-400 uppercase tracking-widest">مشاركة التجربة</h4>
                  <div className="flex gap-3">
                     <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl">
                        <Facebook className="w-4 h-4" />
                     </Button>
                     <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl">
                        <Instagram className="w-4 h-4" />
                     </Button>
                     <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl text-emerald-500 border-emerald-500/10">
                        <Share2 className="w-4 h-4" />
                     </Button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
