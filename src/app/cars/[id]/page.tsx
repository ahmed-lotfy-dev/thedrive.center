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

export async function generateMetadata({ params }: { params: { id: string } }) {
  const car = await db.query.cars.findFirst({
    where: eq(cars.id, params.id),
  });

  if (!car) return { title: "غير موجود" };

  return {
    title: `${car.title} | The Drive Center`,
    description: car.description?.substring(0, 160) || `تم ضبط زوايا وترصيص ${car.title} بأعلى جودة.`,
    openGraph: {
      images: [car.coverImageUrl],
    },
  };
}

export default async function CarDetailPage({ params }: { params: { id: string } }) {
  const car = await db.query.cars.findFirst({
    where: eq(cars.id, params.id),
    with: {
      media: true,
    },
  });

  if (!car) notFound();

  return (
    <main dir="rtl" className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs / Back */}
        <Link 
          href="/cars" 
          className="inline-flex items-center gap-2 text-emerald-500 font-bold hover:gap-3 transition-all mb-8 group"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>العودة لسجل الخدمة</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Media */}
          <div className="lg:col-span-8 space-y-8">
            {/* Main Featured Image */}
            <div className="relative aspect-video w-full rounded-5xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
              <Image
                src={car.coverImageUrl}
                alt={car.title}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute top-6 right-6">
                <Badge className="bg-emerald-500 text-white font-bold h-10 px-6 rounded-2xl shadow-lg border-emerald-400">
                  {car.serviceType === 'alignment_balancing' ? 'ضبط زوايا وترصيص' : 
                   car.serviceType === 'inspection' ? 'فحص شامل' : 
                   car.serviceType === 'steering_coding' ? 'تكويد طارة' : car.serviceType}
                </Badge>
              </div>
            </div>

            {/* Video Section if available */}
            {car.videoUrl && (
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                   <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                   فيديو العمل بالمركز
                </h3>
                <VideoEmbed url={car.videoUrl} title={`فيديو ${car.title}`} />
              </div>
            )}

            {/* Gallery Section */}
            {car.media && car.media.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                   <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                   توثيق الصور (Gallery)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {car.media.map((item) => (
                    <div key={item.id} className="relative aspect-square rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:scale-105 transition-transform duration-500 cursor-zoom-in">
                       <Image
                         src={item.url}
                         alt="صورة العمل"
                         fill
                         className="object-cover"
                         sizes="(max-width: 768px) 50vw, 33vw"
                       />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-8 rounded-5xl sticky top-32">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
                {car.title}
              </h1>
              
              <div className="flex items-center gap-3 text-slate-500 mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(car.createdAt!).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest">
                    <Info className="w-4 h-4" />
                    تفاصيل الخدمة
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                    {car.description}
                  </p>
                </div>

                <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
                   <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">مشاركة الصفحة</h4>
                   <div className="flex gap-4">
                      <Button variant="outline" size="icon" className="w-12 h-12 rounded-2xl">
                         <Facebook className="w-5 h-5" />
                      </Button>
                      <Button variant="outline" size="icon" className="w-12 h-12 rounded-2xl">
                         <Instagram className="w-5 h-5" />
                      </Button>
                      <Button variant="outline" size="icon" className="w-12 h-12 rounded-2xl border-emerald-500/20 text-emerald-500">
                         <Share2 className="w-5 h-5" />
                      </Button>
                   </div>
                </div>

                <Button asChild className="w-full h-16 rounded-3xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg mt-4 shadow-xl shadow-emerald-500/10">
                   <Link href="/book">احجز موعداً لسيارتك</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
