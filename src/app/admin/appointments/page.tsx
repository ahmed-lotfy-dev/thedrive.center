export const dynamic = "force-dynamic";
 
import { getAppointments } from "@/server/actions/appointments";
import { Calendar } from "lucide-react";
import { AdminAppointmentList } from "./AdminAppointmentList";
 
export default async function AppointmentsAdminPage() {
  const result = await getAppointments();
  const appointments: any[] = result.success ? (result.data as any[]) : [];
 
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-8">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-foreground">إدارة الحجوزات</h1>
          <p className="text-muted-foreground/60 font-bold mt-1 text-sm tracking-wide">متابعة طلبات الحجز وتنظيم جدول العمل</p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 border border-border/50 px-4 py-2 rounded-2xl shadow-sm">
          <span className="text-xs font-black text-muted-foreground/60 uppercase tracking-widest">الإجمالي</span>
          <span className="text-lg font-black text-emerald-500">{appointments.length}</span>
        </div>
      </div>
 
      <AdminAppointmentList initialAppointments={appointments} />
    </div>
  );
}
