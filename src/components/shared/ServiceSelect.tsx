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
        "border-border/50 bg-muted/30 px-5 text-base font-bold shadow-xs md:text-sm",
        className
      )}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="font-bold">
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
