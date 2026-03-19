"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

type NotificationEvent = {
  id: string;
  type: string;
  status: string;
  customerName: string | null;
  phone: string;
  email: string | null;
  provider: string;
  sentAt: Date | null;
  error: string | null;
  createdAt: Date | null;
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  sent: "default",
  failed: "destructive",
  skipped: "secondary",
  pending: "outline",
};

const TYPE_LABELS: Record<string, string> = {
  appointment_request_received: "طلب حجز جديد",
  appointment_confirmed: "تأكيد حجز",
  appointment_completed: "اكتمال حجز",
  appointment_cancelled: "إلغاء حجز",
  service_record_added: "تحديث خدمة",
  maintenance_service_reminder: "تذكير صيانة",
  maintenance_alignment_reminder: "تذكير ضبط زوايا",
};

interface NotificationLogProps {
  events: NotificationEvent[];
}

export function NotificationLog({ events }: NotificationLogProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        لا توجد إشعارات مسجلة بعد
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="text-right font-bold text-xs uppercase tracking-wider">التاريخ</TableHead>
            <TableHead className="text-right font-bold text-xs uppercase tracking-wider">العميل</TableHead>
            <TableHead className="text-right font-bold text-xs uppercase tracking-wider">النوع</TableHead>
            <TableHead className="text-right font-bold text-xs uppercase tracking-wider">واتساب</TableHead>
            <TableHead className="text-right font-bold text-xs uppercase tracking-wider">إيميل</TableHead>
            <TableHead className="text-right font-bold text-xs uppercase tracking-wider">الحالة</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id} className="hover:bg-muted/10 transition-colors">
              <TableCell className="text-xs text-muted-foreground">
                {event.createdAt
                  ? format(new Date(event.createdAt), "dd MMM yyyy - HH:mm", { locale: ar })
                  : "—"}
              </TableCell>
              <TableCell>
                <div className="text-sm font-medium">{event.customerName ?? "—"}</div>
                <div className="text-xs text-muted-foreground">{event.phone}</div>
              </TableCell>
              <TableCell>
                <span className="text-xs">{TYPE_LABELS[event.type] ?? event.type}</span>
              </TableCell>
              <TableCell>
                <span className="text-xs text-muted-foreground">{event.provider}</span>
              </TableCell>
              <TableCell>
                {event.email ? (
                  <span className="text-xs text-emerald-500 truncate max-w-[140px] block">
                    {event.email}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground/50">—</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <Badge variant={STATUS_VARIANT[event.status] ?? "outline"}>
                    {event.status}
                  </Badge>
                  {event.error && (
                    <span className="text-[10px] text-destructive line-clamp-1" title={event.error}>
                      {event.error}
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
