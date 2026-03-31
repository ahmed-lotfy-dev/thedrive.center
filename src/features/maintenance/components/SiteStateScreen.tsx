"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Construction, Facebook, Instagram, MessageSquare, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getComingSoonLaunchDate } from "@/lib/site-state";
import {
  FACEBOOK_URL,
  INSTAGRAM_URL,
  TIKTOK_URL,
  getWhatsAppUrl,
} from "@/lib/google-business";

type CountdownState = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

type SiteStateScreenProps = {
  badge: string;
  title: string;
  eyebrow?: string;
  description: string;
  secondaryDescription: string;
  showCountdown?: boolean;
  countdownTitle?: string;
  countdownSubtitle?: string;
  expiredMessage?: string;
};

function getCountdownState(target: Date): CountdownState {
  const now = Date.now();
  const diff = Math.max(target.getTime() - now, 0);
  const secondsTotal = Math.floor(diff / 1000);

  return {
    days: Math.floor(secondsTotal / 86400),
    hours: Math.floor((secondsTotal % 86400) / 3600),
    minutes: Math.floor((secondsTotal % 3600) / 60),
    seconds: secondsTotal % 60,
    expired: diff <= 0,
  };
}

function formatSegment(value: number) {
  return value.toString().padStart(2, "0");
}

export function SiteStateScreen({
  badge,
  title,
  eyebrow,
  description,
  secondaryDescription,
  showCountdown = false,
  countdownTitle = "العد التنازلي للإطلاق",
  countdownSubtitle = "وقت تقريبي",
  expiredMessage = "Countdown complete. Stand by for the next update.",
}: SiteStateScreenProps) {
  const targetDate = useMemo(() => {
    const parsed = new Date(getComingSoonLaunchDate());
    return Number.isNaN(parsed.getTime())
      ? new Date("2026-03-21T07:00:00+02:00")
      : parsed;
  }, []);

  const [countdown, setCountdown] = useState<CountdownState>(() =>
    getCountdownState(targetDate),
  );
  const whatsappUrl = getWhatsAppUrl("أهلاً، أريد التواصل مع The Drive Center.");

  useEffect(() => {
    if (!showCountdown) return;

    const id = window.setInterval(() => {
      setCountdown((prev) => {
        const next = getCountdownState(targetDate);
        if (next.expired && !prev.expired) {
          window.clearInterval(id);
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [targetDate, showCountdown]);

  return (
    <div
      dir="rtl"
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-zinc-950 text-white"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/active-hero-image.jpg"
          alt="مركز خدمة The Drive"
          fill
          priority
          className="object-cover opacity-35 grayscale-[0.35]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-b from-zinc-950/88 via-zinc-950/72 to-zinc-950/92" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_30%)]" />
      </div>

      <div className="absolute -right-20 top-24 h-72 w-72 rounded-full bg-emerald-500/15 blur-[110px]" />
      <div className="absolute -left-20 bottom-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-[110px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 flex justify-center lg:mb-10 lg:justify-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-emerald-300 backdrop-blur-xl">
            <Construction className="size-5" />
            <span className="text-sm font-black tracking-[0.18em]">{badge}</span>
          </div>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="rounded-[2rem] border border-white/10 bg-black/25 p-6 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.45)] sm:p-8 lg:p-10">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-4 text-5xl font-black tracking-tight text-emerald-400 sm:text-6xl lg:text-7xl">
                {title}
              </h1>
              {eyebrow && (
                <p className="mb-4 text-base font-bold tracking-[0.18em] text-emerald-300 sm:text-lg">
                  {eyebrow}
                </p>
              )}
              <p className="text-lg leading-8 text-zinc-200 sm:text-xl">
                {description}
              </p>
              <p className="mt-4 text-base leading-7 text-zinc-400 sm:text-lg">
                {secondaryDescription}
              </p>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="h-14 rounded-2xl bg-emerald-500 px-8 text-base font-black text-zinc-950 shadow-[0_10px_30px_rgba(16,185,129,0.18)] transition-all hover:bg-emerald-400 hover:shadow-[0_14px_34px_rgba(16,185,129,0.26)]"
              >
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="تواصل معنا عبر واتساب"
                >
                  <MessageSquare className="size-5" />
                  تواصل معنا عبر واتساب
                </a>
              </Button>

              <div className="flex items-center gap-3">
                <Button asChild variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-white/10 bg-white/5 text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-[#1877F2] hover:bg-[#1877F2]/12 hover:text-[#1877F2] hover:shadow-[0_0_24px_rgba(24,119,242,0.28)]">
                  <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="group">
                    <Facebook className="size-5 transition-transform duration-200 group-hover:scale-110" strokeWidth={1.8} />
                  </a>
                </Button>
                <Button asChild variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-white/10 bg-white/5 text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-[#ee2a7b]/70 hover:bg-[linear-gradient(135deg,rgba(249,206,52,0.18),rgba(238,42,123,0.28),rgba(98,40,215,0.24))] hover:text-white hover:shadow-[0_0_24px_rgba(238,42,123,0.24)]">
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="group">
                    <Instagram className="size-5 transition-transform duration-200 group-hover:scale-110" strokeWidth={1.8} />
                  </a>
                </Button>
                <Button asChild variant="outline" size="icon" className="h-12 w-12 rounded-2xl border-white/10 bg-white/5 text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-[#25F4EE] hover:bg-[linear-gradient(135deg,rgba(37,244,238,0.14),rgba(254,44,85,0.14))] hover:text-[#25F4EE] hover:shadow-[0_0_24px_rgba(37,244,238,0.18)]">
                  <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="group">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 transition-transform duration-200 group-hover:scale-110 group-hover:drop-shadow-[1px_0_0_#fe2c55]">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.27 1.76-.23.84-.04 1.77.47 2.45.47.66 1.25 1.05 2.04 1.13.73.07 1.48-.11 2.09-.52.66-.41 1.11-1.06 1.25-1.83.07-1.4.03-2.81.04-4.21V0l.02.02z" />
                    </svg>
                  </a>
                </Button>
              </div>
            </div>

            {showCountdown ? (
              <div dir="ltr" className="mt-12 rounded-[2rem] border border-emerald-500/25 bg-black/35 p-6 text-center backdrop-blur-2xl shadow-[0_25px_80px_rgba(6,78,59,0.28)] ring-1 ring-emerald-500/15 sm:mt-14 sm:p-7">
                <p className="text-sm font-black tracking-[0.16em] text-emerald-300">{countdownTitle}</p>
                <p className="mt-2 text-sm text-zinc-400">{countdownSubtitle}</p>
                <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/8 pt-6 sm:grid-cols-4 sm:gap-x-4">
                  {[
                    { value: countdown.days, label: "Days" },
                    { value: countdown.hours, label: "Hours" },
                    { value: countdown.minutes, label: "Minutes" },
                    { value: countdown.seconds, label: "Seconds" },
                  ].map((segment, index) => (
                    <div key={segment.label} className={index === 0 ? "px-1" : "px-1 sm:border-l sm:border-white/8"}>
                      <span className="block text-4xl font-black leading-none tracking-[-0.04em] text-white sm:text-5xl">
                        {formatSegment(segment.value)}
                      </span>
                      <span className="mt-3 block text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                        {segment.label}
                      </span>
                    </div>
                  ))}
                </div>
                {countdown.expired && (
                  <p className="mt-5 text-sm font-semibold text-emerald-300">{expiredMessage}</p>
                )}
              </div>
            ) : (
              <div className="mt-12 rounded-[2rem] border border-amber-500/20 bg-amber-500/8 p-6 text-center backdrop-blur-2xl shadow-[0_25px_80px_rgba(120,53,15,0.18)] ring-1 ring-amber-500/10 sm:mt-14 sm:p-7">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 text-amber-300">
                  <Wrench className="size-6" />
                </div>
                <p className="mt-4 text-lg font-black text-amber-200">جاري تنفيذ أعمال صيانة على الموقع</p>
                <p className="mt-2 text-sm leading-7 text-zinc-300 sm:text-base">
                  بعض الخدمات والصفحات قد تكون غير متاحة مؤقتاً حتى ننتهي من التحديثات المطلوبة ونستعيد التشغيل الكامل بشكل آمن.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
