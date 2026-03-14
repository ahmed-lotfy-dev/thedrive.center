"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { CheckCircle2, Timer, XCircle, Clock } from "lucide-react";

interface Activity {
  id: string;
  user: {
    name: string | null;
  } | null;
  guestName: string | null;
  serviceType: string;
  status: string | null;
  createdAt: Date | null;
}

interface RecentActivityProps {
  activities: Activity[];
}

const statusConfig: Record<string, { icon: any, color: string, label: string }> = {
  pending: { icon: Clock, color: "text-amber-500 bg-amber-500/10", label: "قيد الانتظار" },
  completed: { icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10", label: "مكتمل" },
  cancelled: { icon: XCircle, color: "text-red-500 bg-red-500/10", label: "ملغي" },
  active: { icon: Timer, color: "text-blue-500 bg-blue-500/10", label: "نشط" },
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="rounded-4xl border border-border/50 bg-card/40 backdrop-blur-xl shadow-xl overflow-hidden h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-black font-cairo">أحدث النشاطات</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {activities.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground italic">لا توجد سجلات حديثة</div>
        ) : (
          activities.map((activity, index) => {
            const displayName = activity.user?.name || activity.guestName || "عميل مجهول";
            const currentStatus = activity.status || "pending";
            const config = statusConfig[currentStatus] || statusConfig.pending;

            return (
              <div key={activity.id} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <Avatar className="size-10 border border-border/50">
                  <AvatarFallback className="bg-zinc-800 text-xs font-black">
                    {displayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-sm font-black text-foreground truncate">{displayName}</p>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {activity.createdAt ? formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true, locale: ar }) : ""}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-tight">{activity.serviceType}</span>
                    <div className="size-1 rounded-full bg-border" />
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${config.color} text-[10px] font-black`}>
                      <config.icon className="size-3" />
                      {config.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
