"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  BUSINESS_ADDRESS,
  BUSINESS_CITY,
  FACEBOOK_URL,
  INSTAGRAM_URL,
  TIKTOK_URL,
  getReviewsUrl,
  GOOGLE_RATING,
  GOOGLE_REVIEWS_COUNT,
} from "@/lib/google-business";
import { Clock3, Facebook, MapPin, Phone, Star } from "lucide-react";
import { getDynamicStats } from "@/app/actions/stats";

export function Footer() {
  const pathname = usePathname();
  const [stats, setStats] = React.useState<{
    rating: string;
    reviewsCount: string;
  } | null>(null);

  React.useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    async function loadStats() {
      const data = await getDynamicStats();
      if (data) setStats(data);
    }
    void loadStats();
  }, [pathname]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-border/80 bg-background/50 backdrop-blur-sm mt-12 md:mt-24">
      <div className="container mx-auto px-6 py-12 md:py-20 relative z-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <div className="flex items-center gap-4 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-emerald-500/10 rounded-xl blur-sm group-hover:bg-emerald-500/20 transition-all" />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-card border border-border/60 overflow-hidden shadow-lg">
                  <Image src="/logo.png" alt="The Drive Logo" fill className="object-cover" sizes="48px" />
                </div>
              </div>
              <div className="leading-tight">
                <h1 className="text-xl font-black tracking-tighter uppercase italic text-foreground group-hover:text-emerald-500 transition-colors">
                  The Drive Center
                </h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black">
                  Precision Service
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              الخيار الأول والاحترافي لضبط الزوايا والترصيص الدقيق وفحص السيارات
              قبل الشراء بأحدث الأجهزة العالمية في قلب {BUSINESS_CITY}.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary/80">
              روابط سريعة
            </h3>
            <div className="grid gap-2.5 text-sm font-bold text-muted-foreground">
              <Link
                href="/"
                className="hover:text-emerald-500 transition-colors hover:translate-x-1 duration-200 inline-block"
              >
                الرئيسية
              </Link>
              <Link
                href="/cars"
                className="hover:text-emerald-500 transition-colors hover:translate-x-1 duration-200 inline-block"
              >
                سجل التميز
              </Link>
              <Link
                href="/#services"
                className="hover:text-emerald-500 transition-colors hover:translate-x-1 duration-200 inline-block font-bold"
              >
                خدماتنا
              </Link>
              <Link
                href="/book"
                className="hover:text-emerald-500 transition-colors hover:translate-x-1 duration-200 inline-block"
              >
                حجز موعد
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary/80">
              تواصل مـعـنا
            </h3>
            <div className="grid gap-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-4">
                <div className="size-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <MapPin className="size-5 text-emerald-500" />
                </div>
                <span className="leading-snug pt-1 font-bold">
                  {BUSINESS_ADDRESS}، {BUSINESS_CITY}
                </span>
              </div>
              <div className="flex items-start gap-4">
                <div className="size-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Phone className="size-5 text-emerald-500" />
                </div>
                <div className="flex flex-col gap-1 pt-1" dir="ltr">
                  <a
                    href="https://wa.me/201017131414"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-500 font-black transition-colors text-base tracking-tighter"
                  >
                    010 1713 1414
                  </a>
                  <p className="text-[10px] uppercase font-bold text-emerald-600/60 tracking-widest">
                    كلمـنـا دلوقتي
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="size-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Clock3 className="size-5 text-emerald-500" />
                </div>
                <span className="font-bold pt-1">يومياً: ١٠ ص - ١٠ م</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary/80">
              مجتمعنا الرقمي
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="rounded-xl hover:bg-foreground hover:text-background transition-all h-11 w-11 p-0 border-border/50"
              >
                <Link
                  href={TIKTOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="تيك توك"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5"
                  >
                    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
                  </svg>
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="rounded-xl hover:bg-[#1877F2] hover:text-white transition-all h-11 w-11 p-0 border-border/50"
              >
                <Link
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="فيسبوك"
                >
                  <Facebook className="size-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="rounded-xl hover:bg-linear-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white transition-all h-11 w-11 p-0 border-border/50"
              >
                <Link
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="انستجرام"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </Link>
              </Button>
            </div>

            <div className="pt-6 border-t border-border/10">
              <Link
                href={getReviewsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="group/google flex flex-col gap-2 p-3 rounded-2xl bg-muted/50 border border-transparent hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-all"
              >
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="size-3.5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm font-black text-foreground">
                    {stats?.rating || GOOGLE_RATING}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-4 rounded-full bg-emerald-500 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="white" className="size-2.5">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                    Google Business Verified •{" "}
                    {stats?.reviewsCount || GOOGLE_REVIEWS_COUNT}+ Reviews
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/50 py-6">
        <div className="container mx-auto px-6 flex flex-col items-center justify-center gap-1 text-[10px] md:text-xs font-medium text-muted-foreground text-center">
          <p className="flex flex-wrap items-center justify-center gap-1">
            <span dir="rtl">جميع الحقوق محفوظة.</span>
            <span dir="ltr">
              &copy; {new Date().getFullYear()} The Drive Center.
            </span>
          </p>
          <div className="flex items-center gap-1 group">
            <span className="opacity-60">Designed & Developed by</span>
            <Link
              href="https://ahmedlotfy.site"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground dark:text-white font-black hover:text-emerald-500 transition-colors"
            >
              Ahmed Shoman
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
