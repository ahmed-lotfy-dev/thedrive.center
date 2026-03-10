"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  BUSINESS_ADDRESS,
  BUSINESS_CITY,
  FACEBOOK_URL,
  GOOGLE_BUSINESS_NAME,
  TIKTOK_URL,
  getDirectionsUrl,
  getReviewsUrl,
} from "@/lib/google-business";
import { Clock3, Facebook, MapPin, Music2, Phone, Star } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const directionsUrl = getDirectionsUrl();
  const reviewsUrl = getReviewsUrl();

  return (
    <footer className="border-t border-border/80 bg-card/60 mt-12">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.webp"
                alt="The Drive Logo"
                className="h-14 w-auto object-contain rounded-md"
              />
              <div className="leading-tight">
                <h1 className="text-xl font-bold">{GOOGLE_BUSINESS_NAME}</h1>
                <p className="text-xs text-muted-foreground">مركز ضبط زوايا وترصيص</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              خدمة احترافية لضبط الزوايا والترصيص وفحص السيارات قبل البيع أو الشراء داخل {BUSINESS_CITY}.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">روابط سريعة</h3>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary transition-colors">الرئيسية</Link>
              <Link href="/#services" className="hover:text-primary transition-colors">الخدمات</Link>
              <Link href="/#location" className="hover:text-primary transition-colors">الموقع</Link>
              <Link href="/book" className="hover:text-primary transition-colors">احجز موعد</Link>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">بيانات المركز</h3>
            <div className="grid gap-3 text-sm text-muted-foreground">
              <p className="inline-flex items-start gap-2">
                <MapPin className="size-4 mt-0.5 text-accent shrink-0" />
                <span>{BUSINESS_ADDRESS}، {BUSINESS_CITY}</span>
              </p>
              <p className="inline-flex items-center gap-2">
                <Phone className="size-4 text-accent shrink-0" />
                <span className="text-left w-full" dir="ltr">٠١٢ ٢٨٠٩ ٣٤٣٤ - ٠١٠ ٢٤٤٧ ٩٤٢٧</span>
              </p>
              <p className="inline-flex items-center gap-2">
                <Clock3 className="size-4 text-accent shrink-0" />
                <span>يوميا من ٩ صباحا إلى ١٠ مساء</span>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">تواصل وتقييمات</h3>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" className="rounded-full">
                <Link href={directionsUrl} target="_blank" rel="noopener noreferrer">
                  الاتجاهات
                  <MapPin className="size-4" />
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="rounded-full">
                <Link href={reviewsUrl} target="_blank" rel="noopener noreferrer">
                  التقييمات
                  <Star className="size-4" />
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="rounded-full hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]">
                <Link href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
                  Facebook
                  <Facebook className="size-4" />
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="rounded-full hover:bg-black hover:text-white hover:border-black dark:hover:bg-white dark:hover:text-black dark:hover:border-white">
                <Link href={TIKTOK_URL} target="_blank" rel="noopener noreferrer">
                  TikTok
                  <Music2 className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/80">
        <div className="container mx-auto px-4 py-4 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} {GOOGLE_BUSINESS_NAME}. جميع الحقوق محفوظة.</p>
          <p>المحلة الكبرى - مصر</p>
        </div>
      </div>
    </footer>
  );
}
