export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAppointments } from "@/server/actions/appointments";
import { Calendar, User, Phone, MapPin, Wrench, Clock } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

type Appointment = {
  id: string;
  guestName: string | null;
  guestPhone: string | null;
  guestEmail: string | null;
  machineType: string | null;
  serviceType: string;
  date: Date | string;
  address: string;
  notes: string | null;
  status: string | null;
};

export default async function AppointmentsAdminPage() {
  const result = await getAppointments();
  const appointments: Appointment[] = result.success ? (result.data as Appointment[]) : [];

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    confirmed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  } as const;

  const statusLabels = {
    pending: "قيد المراجعة",
    confirmed: "مؤكد",
    completed: "مكتمل",
    cancelled: "ملغي",
  } as const;

  const machineTypeLabels: Record<string, string> = {
    sedan: "ملاكي",
    suv: "SUV",
    washing_machine: "ملاكي",
    refrigerator: "SUV",
    water_filter: "نقل خفيف",
    other: "أخرى",
  };

  const serviceTypeLabels: Record<string, string> = {
    repair: "ضبط زوايا",
    installation: "ترصيص واتزان",
    maintenance: "فحص شامل قبل البيع والشراء",
    "ضبط زوايا": "ضبط زوايا",
    "فحص شامل": "فحص شامل",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold font-cairo text-primary tracking-wide">إدارة الحجوزات</h1>
          <p className="text-muted-foreground mt-1">متابعة كل طلبات الحجز في مكان واحد</p>
        </div>
        <div className="text-sm text-muted-foreground">
          إجمالي الحجوزات: <span className="font-bold text-foreground">{appointments.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {appointments.length > 0 ? (
          appointments.map((appointment) => {
            const statusKey = (appointment.status || "pending") as keyof typeof statusLabels;
            const machineLabel = machineTypeLabels[appointment.machineType || ""] || (appointment.machineType || "غير محدد");
            const serviceLabel = serviceTypeLabels[appointment.serviceType] || appointment.serviceType;

            return (
              <Card key={appointment.id} className="overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">الاسم</p>
                          <p className="font-bold">{appointment.guestName || "غير متوفر"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Phone className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">رقم الهاتف</p>
                          <p className="font-mono" dir="ltr">{appointment.guestPhone || "غير متوفر"}</p>
                        </div>
                      </div>

                      {appointment.guestEmail && (
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                            <p className="text-sm font-mono" dir="ltr">{appointment.guestEmail}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Wrench className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">نوع العربية</p>
                          <p className="font-bold">{machineLabel}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">نوع الخدمة</p>
                          <p className="font-bold">{serviceLabel}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">تاريخ الموعد</p>
                          <p className="font-bold">{format(new Date(appointment.date), "PPP", { locale: ar })}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">العنوان</p>
                          <p className="text-sm leading-relaxed">{appointment.address}</p>
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">ملاحظات</p>
                          <p className="text-sm">{appointment.notes}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[statusKey] || statusColors.pending}`}>
                          {statusLabels[statusKey] || "قيد المراجعة"}
                        </span>
                        <Button variant="outline" size="sm" disabled>
                          تحديث الحالة قريبًا
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center text-muted-foreground bg-accent/5 rounded-3xl border-2 border-dashed border-border/50">
            <div className="bg-muted p-4 rounded-full mb-4">
              <Calendar className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-lg font-medium">لا توجد طلبات حجز حالياً</p>
            <p className="text-sm opacity-70 mt-1">أول طلب سيظهر هنا فور إنشائه</p>
          </div>
        )}
      </div>
    </div>
  );
}
