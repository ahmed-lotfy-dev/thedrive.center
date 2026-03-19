"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationControlsProps {
  totalPages: number;
  currentPage: number;
  baseUrl: string;
  queryParams?: Record<string, string | number | boolean | undefined>;
}

export function PaginationControls({
  totalPages,
  currentPage,
  baseUrl,
  queryParams = {},
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined) params.set(key, String(value));
    });
    params.set("page", String(page));
    return `${baseUrl}?${params.toString()}`;
  };

  const getVisiblePages = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div dir="rtl" className="flex items-center justify-center gap-2 mt-12 mb-8">
      <Button
        asChild
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        className="rounded-xl border-border"
      >
        <Link href={createPageUrl(1)} aria-disabled={currentPage === 1} aria-label="الصفحة الأولى">
          <ChevronsRight className="h-4 w-4" />
        </Link>
      </Button>

      <Button
        asChild
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        className="rounded-xl border-border"
      >
        <Link href={createPageUrl(currentPage - 1)} aria-disabled={currentPage === 1} aria-label="الصفحة السابقة">
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>

      {visiblePages.map((page) => (
        <Button
          key={page}
          asChild
          variant={currentPage === page ? "default" : "outline"}
          size="icon"
          className={cn(
            "rounded-xl h-10 w-10 font-bold transition-all",
            currentPage === page 
              ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/20" 
              : "border-border hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
          )}
        >
          <Link href={createPageUrl(page)} aria-label={`انتقل إلى الصفحة ${page}`}>{page}</Link>
        </Button>
      ))}

      <Button
        asChild
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        className="rounded-xl border-border"
      >
        <Link href={createPageUrl(currentPage + 1)} aria-disabled={currentPage === totalPages} aria-label="الصفحة التالية">
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>

      <Button
        asChild
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        className="rounded-xl border-border"
      >
        <Link href={createPageUrl(totalPages)} aria-disabled={currentPage === totalPages} aria-label="الصفحة الأخيرة">
          <ChevronsLeft className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
