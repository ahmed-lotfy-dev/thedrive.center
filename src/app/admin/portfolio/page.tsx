import { db } from "@/db";
import { cars } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid, Video, Image as ImageIcon, Trash2, Edit3, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default async function PortfolioDashboardPage() {
  const allCars = await db.query.cars.findMany({
    orderBy: [desc(cars.createdAt)],
    with: {
      media: true,
    },
  });

  return (
    <div dir="rtl" className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
             <LayoutGrid className="w-8 h-8 text-emerald-500" />
             إدارة سجل التميز
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">إضافة وتعديل السيارات التي تظهر في معرض أعمال المركز (Portfolio)</p>
        </div>
        <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-12 px-6 gap-2">
             <Link href="/admin/portfolio/new">
               <Plus className="w-5 h-5" />
               إضافة عمل جديد
             </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {allCars.map((car) => (
          <div key={car.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm group">
            <div className="relative aspect-video">
              <Image 
                src={car.coverImageUrl} 
                alt={car.title} 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                 <Button asChild variant="secondary" size="icon" className="rounded-full">
                    <Link href={`/cars/${car.id}`} target="_blank">
                       <ExternalLink className="w-4 h-4" />
                    </Link>
                 </Button>
                 <Button variant="secondary" size="icon" className="rounded-full">
                    <Edit3 className="w-4 h-4" />
                 </Button>
                 <Button variant="destructive" size="icon" className="rounded-full">
                    <Trash2 className="w-4 h-4" />
                 </Button>
              </div>
            </div>
            
            <div className="p-5">
               <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1">{car.title}</h3>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold border-slate-200 dark:border-slate-700">
                     {car.serviceType}
                  </Badge>
               </div>
               
               <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-1">
                     <ImageIcon className="w-3.5 h-3.5" />
                     <span>{car.media.length} صور</span>
                  </div>
                  {car.videoUrl && (
                    <div className="flex items-center gap-1 text-emerald-500">
                       <Video className="w-3.5 h-3.5" />
                       <span>فيديو مدعوم</span>
                    </div>
                  )}
               </div>
            </div>
          </div>
        ))}

        {allCars.length === 0 && (
          <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-4xl">
             <LayoutGrid className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
             <h3 className="text-xl font-bold text-slate-400">لا توجد أعمال مسجلة بعد</h3>
             <p className="text-slate-500 mt-2 mb-8">ابدأ بتوثيق أول عمل لمركز التميز ليظهر للجمهور.</p>
             <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-12 px-8">
                <Link href="/admin/portfolio/new">إضافة أول عمل الآن</Link>
             </Button>
          </div>
        )}
      </div>
    </div>
  );
}
