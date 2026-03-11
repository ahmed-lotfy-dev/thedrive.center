"use client";

import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Star, Facebook, Music2 } from "lucide-react";
import Link from "next/link";
import {
  BUSINESS_ADDRESS,
  BUSINESS_CITY,
  BUSINESS_REGION,
  FACEBOOK_URL,
  GOOGLE_BUSINESS_NAME,
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
    <section id="location" className="container mx-auto px-4 py-24" data-animate>
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr] items-start">
        <div className="space-y-6" data-parallax="20">
          <div>
            <p className="text-sm font-semibold text-accent">مكاننا وخدمة العملاء</p>
            <h2 className="mt-2 text-4xl md:text-5xl font-semibold text-balance">تعالى لنا بسهولة من أي مكان</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed text-lg">
              {GOOGLE_BUSINESS_NAME} في {BUSINESS_CITY}. تقدر توصلنا بسهولة من خلال خرائط جوجل وتقرا تقييمات العملاء.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="surface p-4 inline-flex items-start gap-3 tilt-hover flex-col md:flex-row w-full">
              <div className="flex items-start gap-3 w-full">
                <MapPin className="mt-0.5 size-5 text-accent shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">العنوان</p>
                  <p className="font-medium">{BUSINESS_ADDRESS}، {BUSINESS_REGION}</p>
                  
                  {/* Driving Hint */}
                  <div className="mt-3 rounded-lg bg-emerald-50 text-emerald-800 p-3 text-sm border border-emerald-100 flex items-start gap-2">
                    <span className="text-emerald-600 font-bold shrink-0 mt-0.5">💡 نصيحة للوصول أسرع:</span>
                    <p className="leading-relaxed text-emerald-700/90">
                      في مدخل المحلة الكبرى، لعدم أخذ مسافة طويلة لا تدخل من مدخل الشعبية الأساسي. 
                      يفضل أخذ أول مدخل يمين (مدخل الشعبية الخارجي) قبل الكمين مباشرةً.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="surface p-4 inline-flex items-start gap-3 tilt-hover">
              <Phone className="mt-0.5 size-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">رقم التواصل</p>
                <p className="font-medium" dir="ltr">012 2809 3434 - 010 2447 9427</p>
              </div>
            </div>

            <div className="surface p-4 inline-flex items-start gap-3 tilt-hover">
              <Clock className="mt-0.5 size-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">مواعيد العمل</p>
                <p className="font-medium">يوميا من 9 صباحا الى 10 مساء</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-full shine">
              <Link href={directionsUrl} target="_blank" rel="noopener noreferrer">
                افتح في خرائط جوجل
                <MapPin className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href={reviewsUrl} target="_blank" rel="noopener noreferrer">
                شوف التقييمات
                <Star className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href={writeReviewUrl} target="_blank" rel="noopener noreferrer">
                اكتب تقييمك
                <Star className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="surface-soft p-4">
            <p className="mb-3 text-sm font-semibold text-primary">تابعنا على السوشيال</p>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" className="rounded-full">
                <Link href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
                  Facebook
                  <Facebook className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href={TIKTOK_URL} target="_blank" rel="noopener noreferrer">
                  TikTok
                  <Music2 className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="surface overflow-hidden p-2" data-parallax="-15">
          <iframe
            src={mapSrc}
            width="100%"
            height="520"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full rounded-xl"
            title="خريطة المركز"
          />
        </div>
      </div>
    </section>
  );
}
