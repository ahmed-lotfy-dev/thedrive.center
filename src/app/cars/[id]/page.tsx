import { db } from "@/db";
import { cars, carMedia } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, PlayCircle } from "lucide-react";

export default async function CarDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const carId = (await params).id;

  const [car] = await db.select().from(cars).where(eq(cars.id, carId));

  if (!car) {
    notFound();
  }

  const gallery = await db
    .select()
    .from(carMedia)
    .where(eq(carMedia.carId, car.id))
    .orderBy(desc(carMedia.createdAt));

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 pb-20 pt-36">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link 
          href="/cars" 
          className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium mb-8 transition-colors"
        >
          <ChevronRight className="size-5" />
          الرجوع للمعرض
        </Link>

        {/* Hero Section of Car */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 mb-12">
           <div className="relative aspect-[21/9] w-full bg-slate-900">
             {car.coverImageUrl && (
                <Image
                  src={car.coverImageUrl}
                  alt={car.title}
                  fill
                  priority
                  className="object-cover opacity-90"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                />
              )}
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="text-white drop-shadow-md">
                  <h1 className="text-3xl md:text-5xl font-bold">{car.title}</h1>
                  {car.serviceType && (
                    <span className="inline-block mt-3 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium">
                      نوع الخدمة: {car.serviceType === "all" ? "شامل" : car.serviceType === "inspection" ? "فحص" : car.serviceType === "alignment" ? "زوايا" : "تكويد"}
                    </span>
                  )}
                </div>
              </div>
           </div>

           {car.description && (
             <div className="p-6 md:p-10">
               <h2 className="text-xl font-bold mb-4">تفاصيل الشغل الذي تم تنفيذه</h2>
               <p className="text-slate-600 leading-relaxed max-w-3xl whitespace-pre-wrap text-lg">
                 {car.description}
               </p>
             </div>
           )}
        </div>

        {/* Video Section */}
        {car.videoUrl && (
          <div className="mb-12">
             <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <PlayCircle className="size-6 text-emerald-600" />
                فيديو للسيارة (قبل وبعد)
             </h2>
             <div className="bg-black rounded-3xl overflow-hidden aspect-video relative shadow-lg">
               <video 
                  src={car.videoUrl} 
                  controls 
                  className="absolute inset-0 w-full h-full object-contain"
                  poster={car.coverImageUrl}
                />
             </div>
          </div>
        )}

        {/* Gallery Section */}
        {gallery.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">صور من العمل</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.map((media) => (
                <div key={media.id} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-white group cursor-zoom-in">
                  <Image
                    src={media.url}
                    alt={`صورة عمل ${car.title}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  {/* Setup a simple CSS hover overlay for aesthetics */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
