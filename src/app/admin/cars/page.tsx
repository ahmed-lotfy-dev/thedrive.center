import { db } from "@/db";
import { cars } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Plus } from "lucide-react";
import Image from "next/image";

export default async function AdminCarsPage() {
  const allCars = await db.select().from(cars).orderBy(desc(cars.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">معرض الأعمال والسيارات</h1>
        <Link
          href="/admin/cars/new"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-black text-zinc-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all active:scale-95"
        >
          <Plus className="size-4" />
          إضافة سيارة جديدة
        </Link>
      </div>

      {allCars.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          لا يوجد سيارات مضافة حالياً. أضف بعض الأعمال ليراها الزوار.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allCars.map((car) => (
            <div
              key={car.id}
              className="group overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-md"
            >
              <div className="relative aspect-video bg-muted">
                {car.coverImageUrl ? (
                  <Image
                    src={car.coverImageUrl}
                    alt={car.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    بدون صورة
                  </div>
                )}
                {car.featured && (
                  <span className="absolute left-2 top-2 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">
                    مميز
                  </span>
                )}
                <span className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-xs text-white backdrop-blur">
                  {car.serviceType === "all" ? "شامل" : car.serviceType}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{car.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {car.description || "بدون وصف"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
