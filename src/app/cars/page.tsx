import { db } from "@/db";
import { cars } from "@/db/schema";
import { desc } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Camera, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "سجل التميز | The Drive Center",
  description: "استعرض سجل السيارات التي تم خدمتها في مركز ذا درايف، واطلع على تفاصيل ضبط الزوايا والترصيص والفحص الشامل.",
};

export default async function CarsGalleryPage() {
  const allCars = await db.query.cars.findMany({
    orderBy: [desc(cars.createdAt)],
  });

  return (
    <main dir="rtl" className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5 px-4 h-8 rounded-full font-bold">
              سجل التميز
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              سيارات تم <span className="text-emerald-500">خدمتها</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl">
              ثقة عملائنا هي سر نجاحنا. هنا نوثق بعض الأعمال التي قمنا بها لضمان أعلى مستويات الدقة والأمان على الطريق.
            </p>
          </div>
        </div>

        {/* Categories / Filter Mockup (Optional follow-up) */}
        {/* ... */}

        {/* Grid Section */}
        {allCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allCars.map((car) => (
              <Link key={car.id} href={`/cars/${car.id}`} className="group block">
                <Card className="overflow-hidden border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 rounded-4xl group-hover:-translate-y-2">
                  <div className="relative aspect-16/10 overflow-hidden">
                    <Image
                      src={car.coverImageUrl}
                      alt={car.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/10 backdrop-blur-md border-white/20 text-white font-bold h-9 px-4 rounded-2xl">
                        {car.serviceType === 'alignment_balancing' ? 'ضبط زوايا وترصيص' : 
                         car.serviceType === 'inspection' ? 'فحص شامل' : 
                         car.serviceType === 'steering_coding' ? 'تكويد طارة' : car.serviceType}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-emerald-500 transition-colors">
                      {car.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {car.description}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="p-6 pt-0 flex items-center justify-between text-sm">
                    <span className="text-slate-400 font-medium">
                      {new Date(car.createdAt!).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })}
                    </span>
                    <div className="flex items-center gap-1 text-emerald-500 font-bold group-hover:gap-2 transition-all">
                      <span>عرض التفاصيل</span>
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-slate-50 dark:bg-slate-800/20 rounded-5xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <Camera className="w-20 h-20 text-slate-300 mb-6" />
            <h2 className="text-2xl font-bold text-slate-400">سجل الخدمة فارغ حالياً</h2>
            <p className="text-slate-500 mt-2">سيتم توثيق أولى عمليات الخدمة فور إطلاق المنصة.</p>
          </div>
        )}
      </div>
    </main>
  );
}
