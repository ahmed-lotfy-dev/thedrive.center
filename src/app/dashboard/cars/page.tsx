import { db } from "@/db";
import { customerCars, appointments } from "@/db/schema";
import { desc, eq, ilike, or } from "drizzle-orm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, CarFront, CalendarDays, ExternalLink } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function CarsDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const query = (await searchParams).q || "";

  // Search logic
  let carsQuery = db.select().from(customerCars).orderBy(desc(customerCars.createdAt));
  
  if (query) {
    carsQuery = db
      .select()
      .from(customerCars)
      .where(
        or(
          ilike(customerCars.plateNumber, `%${query}%`),
          ilike(customerCars.make, `%${query}%`),
          ilike(customerCars.model, `%${query}%`),
        )
      )
      .orderBy(desc(customerCars.createdAt)) as any;
  }

  const cars = await carsQuery;

  // We fetch counts to show the admin how many times a car was serviced
  const carsWithHistory = await Promise.all(
    cars.map(async (car) => {
      const history = await db.select().from(appointments).where(eq(appointments.carId, car.id));
      return {
        ...car,
        serviceCount: history.length,
        lastService: history.sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime())[0]?.createdAt || null,
      };
    })
  );

  return (
    <div dir="rtl" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">سجل السيارات</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">ابحث عن سيارة برقم اللوحة أو الماركة لعرض تاريخ الصيانة</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <form className="flex gap-3 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <Input 
              name="q"
              defaultValue={query}
              placeholder="ابحث برقم اللوحة (مثال: أ ب ج 123)..."
              className="pl-4 pr-10 h-12 bg-zinc-50 dark:bg-zinc-800/50 uppercase"
            />
          </div>
          <Button type="submit" className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700">بحث</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {carsWithHistory.map((car) => (
          <div key={car.id} className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
             {/* Decorative background accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
            
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
                  <CarFront className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white uppercase">
                    {car.plateNumber}
                  </h3>
                  <p className="text-sm text-zinc-500 font-medium">
                    {car.make} {car.model} {car.year && `(${car.year})`}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800/60 grid grid-cols-2 gap-4 relative z-10">
              <div>
                <p className="text-xs text-zinc-500 mb-1">عدد الزيارات</p>
                <div className="flex items-center gap-2 font-semibold text-zinc-700 dark:text-zinc-300">
                  <span className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm">
                    {car.serviceCount}
                  </span>
                  زيارات
                </div>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">آخر زيارة</p>
                <div className="flex items-center gap-2 font-semibold text-zinc-700 dark:text-zinc-300">
                  <CalendarDays className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm">
                    {car.lastService ? format(car.lastService, 'yyyy/MM/dd') : 'لا يوجد سجل'}
                  </span>
                </div>
              </div>
            </div>

            <Link href={`/dashboard/cars/${car.id}`} className="absolute inset-0 z-20">
              <span className="sr-only">عرض السجل</span>
            </Link>

            <div className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-zinc-50 dark:bg-zinc-800/50 text-emerald-600 dark:text-emerald-400 font-medium rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors relative z-10 pointer-events-none">
              <span>عرض سجل الصيانة</span>
              <ExternalLink className="w-4 h-4" />
            </div>
          </div>
        ))}

        {carsWithHistory.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="inline-flex w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 items-center justify-center mb-4">
              <Search className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">لا توجد سيارات مطابقة</h3>
            <p className="text-zinc-500 max-w-sm mx-auto mt-2">
              لم نعثر على أي سيارات تطابق بحثك. تأكد من رقم اللوحة وحاول مرة أخرى.
            </p>
            {query && (
              <Button asChild variant="outline" className="mt-6">
                <Link href="/dashboard/cars">مسح البحث</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
