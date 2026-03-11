import { db } from "@/db";
import { cars } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronLeft } from "lucide-react";

export default async function CarsPortfolioPage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  const params = await searchParams;
  const filter = params.filter;

  const query = db.select().from(cars).orderBy(desc(cars.createdAt));
  
  if (filter && filter !== "all") {
    // Add filtering based on the search param if provided
    query.where(eq(cars.serviceType, filter));
  }

  const allCars = await query;

  const filters = [
    { label: "كل الأعمال", value: "all" },
    { label: "فحص شامل", value: "inspection" },
    { label: "ترصيص وزوايا", value: "alignment" },
    { label: "تكويد باور ستيرنج", value: "steering" },
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 pb-20 pt-36">
      <div className="container mx-auto px-4">
        
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">معرض أعمالنا</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            تصفح بعض السيارات اللي شرفتنا في المركز ونتائج الشغل اللي تم عليها
          </p>
        </header>

        {/* Filters */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {filters.map((f) => {
            const isActive = filter === f.value || (!filter && f.value === "all");
            return (
              <Link
                key={f.value}
                href={f.value === "all" ? "/cars" : `/cars?filter=${f.value}`}
                className={`rounded-full px-6 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                    : "bg-white text-slate-600 shadow-sm hover:bg-slate-100"
                }`}
              >
                {f.label}
              </Link>
            )
          })}
        </div>

        {/* Grid */}
        {allCars.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center">
            <p className="text-lg font-medium text-slate-500">لا يوجد سيارات مطابقة لهذا التصنيف حالياً.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allCars.map((car) => (
              <Link
                key={car.id}
                href={`/cars/${car.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgb(0_0_0/4%)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0_0_0/8%)]"
              >
                <div className="relative aspect-[4/3] w-full bg-slate-100">
                   {car.coverImageUrl ? (
                    <Image
                      src={car.coverImageUrl}
                      alt={car.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      سيارة بدون صورة
                    </div>
                  )}
                  
                  {/* Service Badge Overlays */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {car.serviceType === "inspection" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-md">
                        <CheckCircle2 className="size-3" />
                         فحص شامل
                      </span>
                    )}
                     {car.serviceType === "alignment" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/90 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-md">
                         ترصيص وزوايا
                      </span>
                    )}
                    {car.serviceType === "steering" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/90 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-md">
                         تكويد ستيرنج
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{car.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2 flex-1">
                    {car.description || "شاهد التفاصيل والصور الخاصه بهذه السيارة"}
                  </p>
                  
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-sm font-semibold text-emerald-600">شاهد الصور والفيديو</span>
                    <ChevronLeft className="size-5 text-emerald-600 transition-transform group-hover:-translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
