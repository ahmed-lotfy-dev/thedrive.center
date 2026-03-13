"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Star, Facebook, Music2 } from "lucide-react";
import Link from "next/link";
import {
  BUSINESS_ADDRESS,
  BUSINESS_CITY,
  BUSINESS_PHONE,
  BUSINESS_REGION,
  FACEBOOK_URL,
  GOOGLE_BUSINESS_NAME,
  INSTAGRAM_URL,
  TIKTOK_URL,
  getDirectionsUrl,
  getMapEmbedUrl,
  getReviewsUrl,
  getWriteReviewUrl,
} from "@/lib/google-business";

export function LocationSection() {
  const mapSrc = getMapEmbedUrl();
  const directionsUrl = getDirectionsUrl();
  const reviewsUrl = getReviewsUrl();
  const writeReviewUrl = getWriteReviewUrl();

  return (
    <section id="location" className="container mx-auto px-4 py-20 md:py-32" data-animate>
      <div className="grid gap-12 lg:grid-cols-2 items-start">
        <div className="space-y-8" data-parallax="20">
          <div className="space-y-4">
            <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5 px-4 h-8 rounded-full font-bold">
              عنواننا وصورنا
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
              تعالى لنا بسهولة <br /><span className="text-emerald-500">من أي مكان</span>
            </h2>
            <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl font-medium">
              {GOOGLE_BUSINESS_NAME} في {BUSINESS_CITY}. تقدر توصلنا بسهولة من خلال خرائط جوجل وتتابع سجل التميز الخاص بنا.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="relative group overflow-hidden p-6 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm transition-all duration-500 shadow-sm hover:shadow-xl">
              <div className="flex items-start gap-4">
                <div className="size-10 shrink-0 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <MapPin className="size-5" />
                </div>
                <div className="space-y-4 flex-1">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-1">العنوان بالتفصيل</p>
                    <p className="text-sm md:text-base font-bold text-zinc-900 dark:text-white">{BUSINESS_ADDRESS}، {BUSINESS_REGION}</p>
                  </div>
                  
                  {/* Driving Hint */}
                  <div className="rounded-2xl bg-emerald-500/5 text-emerald-800 dark:text-emerald-300 p-4 text-xs md:text-sm border border-emerald-500/10 flex items-start gap-3">
                    <div className="size-8 shrink-0 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                       💡
                    </div>
                    <p className="leading-relaxed font-medium">
                      <span className="block font-black text-emerald-600 dark:text-emerald-400 mb-1">نصيحة للوصول أسرع:</span>
                      في مدخل المحلة الكبرى، لعدم أخذ مسافة طويلة لا تدخل من مدخل الشعبية الأساسي. 
                      يفضل أخذ أول مدخل يمين (مدخل الشعبية الخارجي) قبل الكمين مباشرةً.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
              <Phone className="size-5 text-emerald-500" />
              <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">التواصل</p>
                <a href={`tel:+2${BUSINESS_PHONE}`} className="text-sm font-bold hover:text-emerald-500 transition-colors" dir="ltr">{BUSINESS_PHONE}</a>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
              <Clock className="size-5 text-emerald-500" />
              <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">المواعيد</p>
                <p className="text-sm font-bold">يومياً 9ص - 10م</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button asChild size="lg" className="rounded-2xl h-14 px-8 bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-500/10">
              <Link href={directionsUrl} target="_blank" rel="noopener noreferrer">
                افتح الخريطة
                <MapPin className="mr-2 size-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-2xl h-14 px-6 border-zinc-200 dark:border-zinc-800">
              <Link href={reviewsUrl} target="_blank" rel="noopener noreferrer">
                التقييمات
                <Star className="mr-2 size-5 text-amber-500" />
              </Link>
            </Button>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-white relative overflow-hidden shadow-xl dark:shadow-2xl border border-zinc-200/50 dark:border-white/5">
            <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4 relative z-10">مجتمعنا الرقمي</p>
            <div className="flex flex-wrap gap-3 relative z-10">
              <Button asChild variant="ghost" className="rounded-xl h-12 w-12 p-0 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all">
                <Link href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" title="تيك توك">
                   <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
                      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
                   </svg>
                </Link>
              </Button>
              <Button asChild variant="ghost" className="rounded-xl h-12 w-12 p-0 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all">
                <Link href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" title="فيسبوك">
                  <Facebook className="size-6" />
                </Link>
              </Button>
              <Button asChild variant="ghost" className="rounded-xl h-12 w-12 p-0 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all">
                <Link href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" title="انستجرام">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                   </svg>
                </Link>
              </Button>
            </div>
            
            {/* Decoy */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full" />
          </div>
        </div>

        <div className="relative group p-2 rounded-[2.5rem] bg-zinc-200/50 dark:bg-zinc-800/50 border-4 border-white dark:border-white/5 shadow-2xl overflow-hidden" data-parallax="-15">
          <iframe
            src={mapSrc}
            width="100%"
            height="560"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full rounded-4xl filter grayscale dark:invert-[0.9] opacity-90 group-hover:grayscale-0 group-hover:invert-0 transition-all duration-700"
            title="خريطة المركز"
          />
        </div>
      </div>
    </section>
  );
}
