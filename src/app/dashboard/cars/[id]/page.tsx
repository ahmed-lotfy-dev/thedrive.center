import { db } from "@/db";
import { appointments, customerCars, user } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ShieldCheck, CalendarDays, User, ArrowRight, Save, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function CarDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  // Fetch the car and the owner details
  const [car] = await db
    .select({
      car: customerCars,
      owner: user,
    })
    .from(customerCars)
    .leftJoin(user, eq(customerCars.userId, user.id))
    .where(eq(customerCars.id, id))
    .limit(1);

  if (!car) {
    notFound();
  }

  // Fetch the service history linked to this car
  const history = await db
    .select()
    .from(appointments)
    .where(eq(appointments.carId, id))
    .orderBy(desc(appointments.createdAt));

  return (
    <div dir="rtl" className="space-y-8 max-w-5xl mx-auto">
      {/* Header & Breadcrumb */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-10 w-10 shrink-0 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <Link href="/dashboard/cars">
            <ArrowRight className="w-5 h-5 text-zinc-500" />
            <span className="sr-only">العودة للسجل</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white uppercase">
            لوحة: {car.car.plateNumber}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            سجل الصيانة الخاص بسيارة {car.car.make} {car.car.model} {car.car.year}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Client & Car Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-1 bg-linear-to-r from-emerald-500 to-emerald-600" />
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-500" />
              بيانات العميل
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-zinc-500">الاسم</Label>
                <div className="font-medium">{car.owner?.name || "غير محدد"}</div>
              </div>
              <div>
                <Label className="text-xs text-zinc-500">البريد الإلكتروني</Label>
                <div className="font-medium text-sm text-zinc-700 dark:text-zinc-300">{car.owner?.email || "غير محدد"}</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-1 bg-linear-to-r from-emerald-500 to-teal-500" />
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              تفاصيل السيارة
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-zinc-500">الماركة</Label>
                <div className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">{car.car.make}</div>
              </div>
              <div>
                <Label className="text-xs text-zinc-500">الموديل</Label>
                <div className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">{car.car.model}</div>
              </div>
              <div>
                <Label className="text-xs text-zinc-500">سنة الصنع</Label>
                <div className="font-medium">{car.car.year || "---"}</div>
              </div>
              <div>
                <Label className="text-xs text-zinc-500">اللون</Label>
                <div className="font-medium">{car.car.color || "---"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: History & New Record Form */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Add New Record Form */}
          <div className="bg-zinc-50 dark:bg-zinc-800/30 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-700/50">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              إضافة سجل صيانة جديد
            </h3>
            
            {/* INCOMPLETE: Need a Server Action to handle this form submission */}
            <form className="space-y-4">
              <input type="hidden" name="carId" value={car.car.id} />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>نوع الخدمة</Label>
                  <Input 
                    name="serviceType" 
                    placeholder="مثال: ضبط زوايا، ترصيص، كشف أعطال" 
                    required 
                    className="bg-white dark:bg-zinc-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label>التكلفة الفعلية (دج)</Label>
                  <Input 
                    name="actualPrice" 
                    type="number" 
                    placeholder="0.00" 
                    className="bg-white dark:bg-zinc-900"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>ملاحظات الصيانة والأعطال (للتاريخ)</Label>
                <Textarea 
                  name="notes" 
                  placeholder="تم تغيير طقم تيل فرامل، مقصات بحاجة للتغيير الزيارة القادمة..." 
                  className="min-h-[100px] bg-white dark:bg-zinc-900 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="button" className="bg-zinc-900 hover:bg-zinc-800 text-white gap-2 px-8 rounded-xl h-12">
                  <Save className="w-4 h-4" />
                  حفظ السجل
                </Button>
              </div>
            </form>
          </div>

          {/* Timeline / History List */}
          <div>
            <h3 className="font-bold text-2xl mb-6">سجل الزيارات السابقة</h3>
            
            {history.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 border-dashed">
                <CalendarDays className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-zinc-900 dark:text-white mb-1">لا يوجد سجل سابق</h4>
                <p className="text-zinc-500">قم بإضافة أول خدمة صيانة لهذه السيارة من النموذج أعلاه.</p>
              </div>
            ) : (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-zinc-200 dark:before:via-zinc-800 before:to-transparent">
                {history.map((record, index) => (
                  <div key={record.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    
                    {/* Timeline Marker */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-zinc-950 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    
                    {/* Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <h4 className="font-bold text-lg text-zinc-900 dark:text-white">
                          {record.serviceType}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md w-fit">
                          <CalendarDays className="w-3.5 h-3.5" />
                          <time dateTime={format(record.createdAt!, "yyyy-MM-dd")}>
                            {format(record.createdAt!, "dd/MM/yyyy")}
                          </time>
                        </div>
                      </div>
                      
                      {record.notes ? (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 whitespace-pre-wrap leading-relaxed">
                          {record.notes}
                        </p>
                      ) : (
                        <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-4 italic">
                          لا توجد ملاحظات مسجلة
                        </p>
                      )}
                      
                      <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-sm font-medium">
                        <span className="text-zinc-500">التكلفة:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">
                          {record.actualPrice ? `${record.actualPrice} دج` : "غير مسجل"}
                        </span>
                      </div>
                    </div>
                    
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
