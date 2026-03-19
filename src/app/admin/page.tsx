export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, CheckCircle2, Timer } from "lucide-react";
import { appointmentQueries } from "@/db/queries/appointments";
import { userQueries } from "@/db/queries/users";
import { BookingCharts } from "@/features/admin/components/BookingCharts";
import { RecentActivity } from "@/features/admin/components/RecentActivity";
import { subDays, format, startOfDay } from "date-fns";
import { ar } from "date-fns/locale";

export default async function AdminDashboard() {
  const today = new Date();
  const chartStartDate = startOfDay(subDays(today, 6));
  const recentWindowStart = startOfDay(today);

  const [
    totalAppointments,
    completedAppointmentsCount,
    usersCount,
    recentActivities,
    dailyCounts,
    newRequestsCount,
  ] = await Promise.all([
    appointmentQueries.countAll(),
    appointmentQueries.countByStatus("completed"),
    userQueries.countAll(),
    appointmentQueries.findRecent(6),
    appointmentQueries.getDailyCountsSince(chartStartDate),
    appointmentQueries.countCreatedSince(recentWindowStart),
  ]);

  const completionRate =
    totalAppointments > 0 ? Math.round((completedAppointmentsCount / totalAppointments) * 100) : 0;

  const dailyCountsMap = new Map(
    dailyCounts.map((entry) => [entry.day, entry.count]),
  );

  // Process Chart Data (Last 7 Days)
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i);
    const dayName = format(date, "EEEE", { locale: ar });
    const dateKey = format(date, "yyyy-MM-dd");
    return { day: dayName, count: dailyCountsMap.get(dateKey) ?? 0 };
  });

  const stats = [
    {
      title: "إجمالي طلبات الحجز",
      value: totalAppointments.toString(),
      icon: CalendarDays,
      description: `${newRequestsCount} طلب جديد`,
    },
    {
      title: "الحجوزات المكتملة",
      value: completedAppointmentsCount.toString(),
      icon: CheckCircle2,
      description: "طلبات تم تنفيذها",
    },
    {
      title: "المستخدمون",
      value: usersCount.toString(),
      icon: Users,
      description: `${usersCount} مستخدم`,
    },
    {
      title: "معدل الإنجاز",
      value: `${completionRate}%`,
      icon: Timer,
      description: "نسبة الحجوزات المكتملة",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black font-cairo text-primary tracking-tight">لوحة التحكم</h1>
          <p className="text-muted-foreground mt-1 font-medium italic opacity-80">إدارة مركز The Drive Center باحترافية</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">التاريخ اليوم</p>
          <p className="text-sm font-bold">{format(new Date(), "PP", { locale: ar })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="rounded-3xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black font-sans">{stat.value}</div>
              <p className="text-[10px] text-muted-foreground mt-1 font-bold">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <BookingCharts data={chartData} />
        </div>
        <div className="lg:col-span-5">
          <RecentActivity activities={recentActivities} />
        </div>
      </div>
    </div>
  );
}
