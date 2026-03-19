"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VideoEmbed } from "@/components/shared/VideoEmbed";
import { ImageGalleryViewer } from "./ImageGalleryViewer";
import {
  ArrowRight,
  Calendar,
  Wrench,
  Clock,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { ShowcaseCarWithMedia } from "@/types/showcase";
import { SERVICE_TYPES } from "@/lib/constants";
import { authClient } from "@/lib/auth-client";

interface CarDetailsViewProps {
  car: ShowcaseCarWithMedia;
}

export function CarDetailsView({ car }: CarDetailsViewProps) {
  const { data: session } = authClient.useSession();
  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const isManagement = userRole === "admin" || userRole === "owner";

  const serviceLabel =
    SERVICE_TYPES.find((s) => s.value === car.serviceType)?.label ||
    car.serviceType;

  return (
    <div className="bg-background">
      {/* ─── HERO ────────────────────────────────────────────────── */}
      <section className="relative w-full h-[55vh] md:h-[65vh] overflow-hidden bg-zinc-100 dark:bg-zinc-950">
        <Image
          src={car.coverImageUrl}
          alt={car.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t dark:from-zinc-950/90 dark:via-zinc-950/50 from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r dark:from-zinc-950/40 from-black/20 to-transparent" />

        {/* Hero Content */}
        <div className="absolute bottom-0 right-0 left-0 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="container mx-auto px-4 sm:px-6 pb-12 md:pb-16 flex flex-col items-start gap-4">
            {/* Breadcrumb relocated here */}
            <Link
              href="/cars"
              className="inline-flex items-center gap-2 text-sm font-bold text-white/90 hover:text-emerald-400 transition-colors bg-black/30 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl hover:bg-black/40 cursor-pointer w-fit"
            >
              <ArrowRight className="w-4 h-4" />
              <span>سجل التميز</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
              <span className="text-emerald-400">{car.title}</span>
            </Link>

            <div className="flex flex-col items-start gap-2">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 backdrop-blur-md font-bold h-8 px-4 rounded-xl text-xs uppercase tracking-wider w-fit">
                {serviceLabel}
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-1 drop-shadow-lg">
                {car.title}
              </h1>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(car.createdAt!).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BODY ────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14">

          {/* ─── MAIN CONTENT ──────────────────────────────────── */}
          <div className="lg:col-span-7 space-y-10">

            {/* Description Card — compact */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                <h2 className="text-lg font-black text-zinc-900 dark:text-white">
                  تفاصيل العمل
                </h2>
              </div>

              <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {car.description}
              </p>

              {/* Inline metadata chips */}
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60 rounded-2xl px-4 py-2">
                  <Wrench className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-xs text-zinc-400 font-bold">نوع الخدمة</span>
                  <span className="text-xs font-black text-zinc-900 dark:text-white">{serviceLabel}</span>
                </div>

                <div className="inline-flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-zinc-700/60 rounded-2xl px-4 py-2">
                  <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-xs text-zinc-400 font-bold">تاريخ التنفيذ</span>
                  <span className="text-xs font-black text-zinc-900 dark:text-white">
                    {new Date(car.createdAt!).toLocaleDateString("ar-EG", { month: "long", year: "numeric" })}
                  </span>
                </div>
              </div>
            </div>

            {/* Gallery — client component island */}
            {car.media && car.media.length > 0 && (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-7 bg-emerald-500 rounded-full" />
                  <h2 className="text-xl font-black text-zinc-900 dark:text-white">
                    معرض الصور
                  </h2>
                </div>
                <ImageGalleryViewer
                  images={car.media}
                  carTitle={car.title}
                />
              </div>
            )}
          </div>

          {/* ─── SIDEBAR ───────────────────────────────────────── */}
          <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 self-start">

            {/* Video */}
            {car.videoUrl && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-7 bg-emerald-500 rounded-full" />
                  <h2 className="text-xl font-black text-zinc-900 dark:text-white">
                    فيديو العمل
                  </h2>
                </div>
                <VideoEmbed url={car.videoUrl} title={`فيديو ${car.title}`} />

                {/* CTA right below video */}
                {!isManagement && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-4xl p-5 space-y-3">
                    <p className="text-zinc-700 dark:text-zinc-200 font-bold leading-relaxed text-sm">
                      أعجبك ما شاهدته؟ احجز موعدك الآن وسنهتم بسيارتك بنفس
                      الاحترافية.
                    </p>
                    <Button
                      asChild
                      className="w-full h-11 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:scale-[1.02] cursor-pointer"
                    >
                      <Link href="/book">احجز موعدك الآن</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* CTA when there's no video */}
            {!car.videoUrl && !isManagement && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-4xl p-6 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                  هل أعجبتك الخدمة؟
                </h3>
                <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                  احجز موعدك الآن وسنهتم بسيارتك بنفس المستوى من الاحترافية
                  والدقة.
                </p>
                <Button
                  asChild
                  className="w-full h-11 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:scale-[1.02] cursor-pointer"
                >
                  <Link href="/book">احجز موعدك الآن</Link>
                </Button>
              </div>
            )}

            {/* More from Gallery */}
            <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-5 space-y-2">
              <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest text-start">
                استعرض المزيد
              </p>
              <Link
                href="/cars"
                className="flex items-center justify-between text-zinc-800 dark:text-zinc-200 font-black hover:text-emerald-500 transition-colors group cursor-pointer text-sm"
              >
                <span>كل أعمال المركز</span>
                <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
