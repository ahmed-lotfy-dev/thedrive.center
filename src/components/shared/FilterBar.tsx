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
import { ServiceSelect } from "./ServiceSelect";

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
    <div dir="rtl" className="flex flex-col md:flex-row items-stretch gap-4 mb-8">
      <div className="relative flex-1 group">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40 group-focus-within:text-emerald-500 transition-colors" />
        <Input
          placeholder={placeholder}
          defaultValue={currentSearch}
          onChange={(e) => handleSearch(e.target.value)}
          aria-label="بحث في سجل التميز"
          className="h-12! pr-12 bg-card/50 backdrop-blur-md border-border/50 rounded-2xl group-focus-within:border-emerald-500/50 transition-all shadow-sm text-foreground font-bold placeholder:text-muted-foreground/40"
        />
        {currentSearch && (
          <button
            onClick={() => handleSearch("")}
            aria-label="مسح البحث"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-xl hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {showServiceFilter && (
        <ServiceSelect 
          value={currentService} 
          onValueChange={handleServiceChange}
          className="md:w-[260px] h-12!"
          showAllOption={true}
        />
      )}
      
      {isPending && (
        <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-emerald-500 animate-pulse pr-2 whitespace-nowrap">
           جاري التحديث...
        </div>
      )}
    </div>
  );
}
