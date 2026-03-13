"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="container mx-auto px-4 py-18" data-animate>
      <div className="relative overflow-hidden rounded-3xl border border-border bg-zinc-900 dark:bg-zinc-950 px-6 py-10 text-white md:px-10 shadow-2xl">
        <div className="pointer-events-none absolute -top-20 -left-14 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />
        <p className="text-sm font-semibold text-emerald-200">جاهز لضبط العربية؟</p>
        <h2 className="mt-2 max-w-2xl text-3xl font-semibold md:text-4xl">
          احجز ميعادك في The Drive وخليك مطمّن على ثبات وأداء عربيتك
        </h2>
        <div className="mt-6">
          <Button asChild size="lg" className="h-12 rounded-full bg-white px-8 text-zinc-900 hover:bg-white/90">
            <Link href="/book">احجز الآن</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
