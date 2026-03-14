"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartData {
  day: string;
  count: number;
}

interface BookingChartsProps {
  data: ChartData[];
}

export function BookingCharts({ data }: BookingChartsProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <Card className="rounded-4xl border border-border/50 bg-card/40 backdrop-blur-xl shadow-xl overflow-hidden group">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-black font-cairo flex items-center gap-2">
          <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          تحليلات الحجوزات (آخر ٧ أيام)
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64 pt-6 flex items-end justify-between gap-1 sm:gap-2">
        {data.map((item, index) => (
          <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group/bar">
            {/* Bar Label (Value) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-[10px] font-black text-emerald-500 opacity-0 group-hover/bar:opacity-100 transition-opacity"
            >
              {item.count}
            </motion.div>

            {/* Bar */}
            <div className="w-full relative flex flex-col items-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.count / maxCount) * 100}%` }}
                transition={{ 
                  duration: 1, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                className="w-full max-w-[40px] rounded-t-xl bg-linear-to-t from-emerald-500/20 to-emerald-500 group-hover/bar:brightness-110 shadow-lg shadow-emerald-500/10 min-h-[4px]"
              />
              {/* Overlay glow */}
              <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-0 group-hover/bar:opacity-20 transition-opacity pointer-events-none" />
            </div>

            {/* Day Name */}
            <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest group-hover/bar:text-foreground transition-colors">
              {item.day}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
