"use client";

import { 
  User, 
  Phone, 
  Wrench, 
  Calendar, 
  Clock, 
  MoreVertical, 
  CheckCircle2, 
  Check, 
  XCircle, 
  Trash2,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { formatLicensePlate } from "@/lib/utils";

interface AppointmentCardProps {
  appointment: any;
  statusColors: Record<string, string>;
  statusLabels: Record<string, string>;
  machineTypeLabels: Record<string, string>;
  serviceTypeLabels: Record<string, string>;
  loadingId: string | null;
  onStatusUpdate: (id: string, status: string) => void;
  onDeleteRequest: (id: string) => void;
}

export function AppointmentCard({ 
  appointment, 
  statusColors, 
  statusLabels, 
  machineTypeLabels, 
  serviceTypeLabels,
  loadingId,
  onStatusUpdate,
  onDeleteRequest
}: AppointmentCardProps) {
  const statusKey = (appointment.status || "pending") as keyof typeof statusLabels;
  const machineLabel = machineTypeLabels[appointment.machineType || ""] || (appointment.machineType || "غير محدد");
  const serviceLabel = serviceTypeLabels[appointment.serviceType] || appointment.serviceType;

  return (
    <Card className="overflow-hidden border-border/50 bg-card/40 hover:border-emerald-500/20 transition-all duration-300 shadow-lg">
      <div className="p-4 sm:p-5 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/10 shrink-0">
                <User className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="min-w-0">
                <p className="text-[clamp(10px,0.6vw+4px,12px)] font-black uppercase tracking-widest text-muted-foreground/60 leading-none mb-1.5">العميل</p>
                <p className="font-bold text-[clamp(14px,0.8vw+8px,18px)] truncate leading-none text-foreground">{appointment.guestName || "غير متوفر"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-muted/50 p-2.5 rounded-xl border border-border/50 shrink-0">
                <Phone className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-[clamp(10px,0.6vw+4px,12px)] font-black uppercase tracking-widest text-muted-foreground/60 leading-none mb-1.5">الهاتف</p>
                <p className="font-mono text-[clamp(12px,0.7vw+6px,15px)] leading-none text-foreground" dir="ltr">{appointment.guestPhone || "غير متوفر"}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-5">
            <div className="space-y-4 border-r border-border/50 pr-4">
              <div className="flex items-center gap-3">
                <Wrench className="w-4.5 h-4.5 text-emerald-500/70" />
                <div className="min-w-0">
                  <p className="text-[clamp(9px,0.5vw+4px,11px)] font-black uppercase text-muted-foreground/60 leading-none mb-1">العربية</p>
                  <div className="flex flex-col gap-1">
                    <p className="text-[clamp(12px,0.6vw+6px,14px)] font-bold truncate leading-none text-foreground">{machineLabel}</p>
                    {appointment.car?.plateNumber && (
                      <p className="text-[10px] font-black text-emerald-500 bg-emerald-500/5 px-1.5 py-0.5 rounded border border-emerald-500/10 inline-block w-fit leading-none">
                        {formatLicensePlate(appointment.car.plateNumber)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4.5 h-4.5 text-emerald-500/70" />
                <div className="min-w-0">
                  <p className="text-[clamp(9px,0.5vw+4px,11px)] font-black uppercase text-muted-foreground/60 leading-none mb-1">التاريخ</p>
                  <p className="text-[clamp(12px,0.6vw+6px,14px)] font-bold leading-none text-foreground">{format(new Date(appointment.date), "dd MMMM", { locale: ar })}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-4.5 h-4.5 text-emerald-500/70" />
                <div className="min-w-0">
                  <p className="text-[clamp(9px,0.5vw+4px,11px)] font-black uppercase text-muted-foreground/60 leading-none mb-1">الخدمة</p>
                  <p className="text-[clamp(12px,0.6vw+6px,14px)] font-bold truncate leading-none text-foreground">{serviceLabel}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-between gap-5 h-full">
            <div className="flex-1 min-w-0 w-full">
              {appointment.notes ? (
                <div className="bg-muted/40 p-3 rounded-xl border border-border/50 max-w-full">
                  <p className="text-[clamp(9px,0.5vw+4px,11px)] font-black text-muted-foreground/60 uppercase mb-1.5 leading-none">ملاحظات</p>
                  <p className="text-[clamp(11px,0.5vw+6px,13px)] leading-tight text-muted-foreground line-clamp-2 italic">{appointment.notes}</p>
                </div>
              ) : (
                <div className="h-full flex items-center">
                  <p className="text-[clamp(10px,0.5vw+6px,12px)] text-muted-foreground/40 italic leading-none">لا توجد ملاحظات</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <div className={`px-4 py-2 rounded-lg text-[clamp(10px,0.5vw+6px,12px)] font-black uppercase tracking-tighter border ${statusColors[statusKey]} leading-none`}>
                {statusLabels[statusKey]}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-muted text-foreground border border-border/50 bg-background/50 transition-colors">
                    {loadingId === appointment.id ? (
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    ) : (
                      <MoreVertical className="h-4.5 w-4.5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover/95 backdrop-blur-md border-border/50 rounded-2xl p-2 shadow-2xl">
                  <div className="px-2 py-2 text-[11px] font-black uppercase text-muted-foreground/60 tracking-widest leading-none mb-1.5">تحديث الحالة</div>
                  <DropdownMenuItem onClick={() => onStatusUpdate(appointment.id, "confirmed")} className="rounded-xl gap-3 py-2.5 focus:bg-emerald-500/10 focus:text-emerald-500 cursor-pointer">
                    <CheckCircle2 className="w-5 h-5" /> <span className="font-bold text-[13px] uppercase">تأكيد الحجز</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusUpdate(appointment.id, "completed")} className="rounded-xl gap-3 py-2.5 focus:bg-blue-500/10 focus:text-blue-500 cursor-pointer">
                    <Check className="w-5 h-5" /> <span className="font-bold text-[13px] uppercase">اكتمل العمل</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusUpdate(appointment.id, "cancelled")} className="rounded-xl gap-3 py-2.5 focus:bg-red-500/10 focus:text-red-500 cursor-pointer text-red-500/70">
                    <XCircle className="w-5 h-5" /> <span className="font-bold text-[13px] uppercase">إلغاء الحجز</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50 my-1.5" />
                  <DropdownMenuItem 
                    onClick={() => onDeleteRequest(appointment.id)}
                    className="rounded-xl gap-3 py-2.5 focus:bg-red-600 focus:text-white text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" /> <span className="font-bold text-[13px] uppercase">مسح الحجز</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
