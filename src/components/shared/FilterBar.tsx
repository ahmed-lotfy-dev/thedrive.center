"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SERVICE_TYPES } from "@/lib/constants";
import { useTransition } from "react";

interface FilterBarProps {
  placeholder?: string;
  showServiceFilter?: boolean;
}

export function FilterBar({ 
  placeholder = "بحث بالاسم أو الوصف...",
  showServiceFilter = true 
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handleServiceChange(value: string) {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (value && value !== "all") {
      params.set("serviceType", value);
    } else {
      params.delete("serviceType");
    }
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  const currentSearch = searchParams.get("search") || "";
  const currentService = searchParams.get("serviceType") || "all";

  return (
    <div dir="rtl" className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1 group">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
        <Input
          placeholder={placeholder}
          defaultValue={currentSearch}
          onChange={(e) => handleSearch(e.target.value)}
          aria-label="بحث في سجل التميز"
          className="h-14 pr-11 bg-white dark:bg-zinc-900 border-border rounded-2xl group-focus-within:border-emerald-500/50 transition-all shadow-sm"
        />
        {currentSearch && (
          <button
            onClick={() => handleSearch("")}
            aria-label="مسح البحث"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showServiceFilter && (
        <Select value={currentService} onValueChange={handleServiceChange}>
          <SelectTrigger className="md:w-[240px] h-14 bg-white dark:bg-zinc-900 border-border rounded-2xl focus:ring-emerald-500/20 shadow-sm font-bold">
            <SelectValue placeholder="كل التصنيفات" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-zinc-200 dark:border-zinc-800 font-bold">
            <SelectItem value="all">كل الخدمات</SelectItem>
            {SERVICE_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      {isPending && (
        <div className="flex items-center text-xs text-muted-foreground animate-pulse pr-2">
           جاري التحديث...
        </div>
      )}
    </div>
  );
}
