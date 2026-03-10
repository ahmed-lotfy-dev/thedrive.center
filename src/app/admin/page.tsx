export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Users, CheckCircle2, Timer } from "lucide-react";
import { appointmentQueries } from "@/db/queries/appointments";
import { userQueries } from "@/db/queries/users";

export default async function AdminDashboard() {
  const [appointments, users] = await Promise.all([appointmentQueries.findAll(), userQueries.findAll()]);

  const pendingAppointments = appointments.filter((a) => a.status === "pending");
  const completedAppointments = appointments.filter((a) => a.status === "completed");
  const newRequestsCount = pendingAppointments.length;
  const usersCount = users.length;
  const completionRate =
    appointments.length > 0 ? Math.round((completedAppointments.length / appointments.length) * 100) : 0;

  const stats = [
    {
      title: "إجمالي طلبات الحجز",
      value: appointments.length.toString(),
      icon: CalendarDays,
      description: `${newRequestsCount} طلب جديد`,
    },
    {
      title: "الحجوزات المكتملة",
      value: completedAppointments.length.toString(),
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-cairo text-primary">لوحة التحكم</h1>
        <p className="text-muted-foreground mt-2">لوحة إدارة MVP لمركز The Drive</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-sans">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="h-75 flex items-center justify-center border-dashed">
          <span className="text-muted-foreground">رسم بياني للحجوزات (قريبا)</span>
        </Card>
        <Card className="h-75 flex items-center justify-center border-dashed">
          <span className="text-muted-foreground">آخر التحديثات (قريبا)</span>
        </Card>
      </div>
    </div>
  );
}
