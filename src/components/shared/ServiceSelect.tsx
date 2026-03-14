"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERVICE_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ServiceSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  showAllOption?: boolean;
}

export function ServiceSelect({
  value,
  onValueChange,
  className,
  placeholder = "اختر الخدمة",
  showAllOption = false,
}: ServiceSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn(
        "bg-card/50 backdrop-blur-md border-border/50 rounded-2xl focus:ring-emerald-500/20 shadow-sm font-black text-foreground hover:bg-muted/50 transition-all",
        className
      )}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-2xl border-border bg-popover/95 backdrop-blur-xl font-bold shadow-2xl">
        {showAllOption && (
          <SelectItem value="all" className="font-black italic text-emerald-500">
            كل الخدمات
          </SelectItem>
        )}
        {SERVICE_TYPES.map((type) => (
          <SelectItem key={type.value} value={type.value} className="font-bold">
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
