"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FormHeaderProps {
  isEdit: boolean;
}

export function FormHeader({ isEdit }: FormHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Button asChild variant="ghost" size="icon" className="h-10 w-10 shrink-0 rounded-full">
        <Link href="/admin/showcase">
          <ArrowRight className="w-5 h-5" />
        </Link>
      </Button>
      <div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
          {isEdit ? "تعديل بيانات العمل" : "إضافة عمل جديد للسجل"}
        </h1>
        <p className="text-zinc-500 text-sm md:text-base">
          {isEdit
            ? "قم بتحديث تفاصيل العمل والخدمة المقدمة."
            : "قم بتوثيق خدمة جديدة لتظهر لعملائك في المعرض العام."}
        </p>
      </div>
    </div>
  );
}
