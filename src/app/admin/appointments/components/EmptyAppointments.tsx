"use client";

import { Calendar } from "lucide-react";

export function EmptyAppointments() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-900/20 border-2 border-dashed border-white/5 rounded-[2.5rem]">
      <div className="bg-zinc-800/50 p-5 rounded-3xl mb-4 border border-white/5">
        <Calendar className="w-10 h-10 text-zinc-600" />
      </div>
      <p className="text-xl font-bold text-zinc-400 italic">لا توجد طلبات حجز حالياً</p>
      <p className="text-sm text-zinc-600 mt-2 font-medium">سيظهر أي حجز جديد هنا تلقائياً</p>
    </div>
  );
}
