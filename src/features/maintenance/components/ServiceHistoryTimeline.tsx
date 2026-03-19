"use client";

import { format } from "date-fns";
import { ar } from "date-fns/locale";

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

// Redesigned ServiceHistoryTimeline with a more premium, compact feel
export function ServiceHistoryTimeline({
  records,
}: ServiceHistoryTimelineProps) {
  if (records.length === 0) {
    return (
      <div className="py-12 text-center bg-zinc-900/40 rounded-3xl border border-dashed border-white/5">
        <p className="text-zinc-500 text-sm font-bold">
          لا يوجد سجل خدمات سابق
        </p>
      </div>
    );
  }

  return (
    <div className="relative pr-6 space-y-8 before:absolute before:inset-0 before:right-2 before:h-full before:w-px before:bg-linear-to-b before:from-emerald-500/50 before:via-emerald-500/10 before:to-transparent">
      {records.map((record) => (
        <div key={record.id} className="relative group">
          <div className="absolute -right-5 top-1.5 size-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10 group-hover:scale-125 transition-transform" />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <time className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70">
                {format(new Date(record.serviceDate), "d MMMM yyyy", {
                  locale: ar,
                })}
              </time>
              {record.odometer && (
                <span className="text-[9px] font-black text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full">
                  {record.odometer.toLocaleString()} KM
                </span>
              )}
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 group-hover:border-emerald-500/20 transition-all">
              <h4 className="text-sm font-black text-white">
                {record.serviceType}
              </h4>
              {record.description && (
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                  {record.description}
                </p>
              )}
              {record.cost && (
                <div className="mt-3 flex justify-end">
                  <span className="text-[10px] font-black text-emerald-400">
                    {record.cost} ج.م
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
