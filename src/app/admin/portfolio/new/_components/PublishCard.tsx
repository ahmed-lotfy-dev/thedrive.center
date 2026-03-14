"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PublishCardProps {
  isEdit: boolean;
  isPending: boolean;
  isUploading: boolean;
}

export function PublishCard({ isEdit, isPending, isUploading }: PublishCardProps) {
  return (
    <Card className="rounded-4xl border-zinc-200/60 dark:border-zinc-800/60 shadow-xl shadow-zinc-200/20 dark:shadow-none bg-zinc-900 text-white sticky top-24">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          النشر والمراجعة
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-zinc-400 leading-relaxed">
          عند الحفظ، سيتم {isEdit ? "تحديث" : "إضافة"} هذا العمل فوراً وسيتعرف عليه محرك بحث جوجل لضمان
          وصول العملاء إليك.
        </p>

        <Button
          type="submit"
          disabled={isPending || isUploading}
          className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-lg transition-all active:scale-95 disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="ml-2 w-5 h-5 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Save className="ml-2 w-5 h-5" />
              {isEdit ? "حفظ التعديلات" : "حفظ العمل الآن"}
            </>
          )}
        </Button>

        <Button
          asChild
          variant="outline"
          className="w-full h-12 rounded-2xl border-white/10 hover:bg-white/10 text-white"
        >
          <Link href="/admin/portfolio">إلغاء</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
