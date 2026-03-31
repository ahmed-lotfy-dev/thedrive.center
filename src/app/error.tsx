"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">حدث خطأ غير متوقع</h2>
        <p className="text-zinc-400 mb-8">
          نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={reset}
            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-zinc-700 hover:bg-zinc-800 rounded-xl gap-2"
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              الرئيسية
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
