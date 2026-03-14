"use client";

import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { CheckCircle2, Circle } from "lucide-react";

interface ServiceRecord {
  id: string;
  serviceDate: string | Date;
  serviceType: string;
  description?: string | null;
  odometer?: number | null;
  cost?: string | number | null;
}

interface ServiceHistoryTimelineProps {
  records: ServiceRecord[];
}

export function ServiceHistoryTimeline({ records }: ServiceHistoryTimelineProps) {
  if (records.length === 0) {
    return (
      <div className="py-8 text-center bg-zinc-800/20 rounded-2xl border border-white/5">
        <p className="text-zinc-500 text-sm font-bold">لا يوجد سجل خدمات سابق لهذه السيارة</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
      {records.map((record, index) => (
        <div key={record.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-zinc-900 group-hover:border-emerald-500/50 transition-colors shadow-xl z-10 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
            <CheckCircle2 className="size-5 text-emerald-500" />
          </div>

          {/* Content */}
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-3xl bg-zinc-800/30 border border-white/5 group-hover:border-white/10 transition-colors shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
              <time className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                {format(new Date(record.serviceDate), "d MMMM yyyy", { locale: ar })}
              </time>
              {record.odometer && (
                <span className="text-[10px] font-bold text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-full border border-white/5">
                  {record.odometer.toLocaleString()} كم
                </span>
              )}
            </div>
            <h4 className="text-sm font-black text-white mb-1">{record.serviceType}</h4>
            {record.description && (
              <p className="text-xs text-zinc-400 leading-relaxed">{record.description}</p>
            )}
            {record.cost && (
              <div className="mt-3 pt-3 border-t border-white/5 flex justify-end">
                <span className="text-[10px] font-black text-emerald-500/80">
                  {record.cost} ج.م
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
