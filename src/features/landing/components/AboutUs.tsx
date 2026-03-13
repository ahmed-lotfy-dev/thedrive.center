"use client";

import { Phone, MapPin, Mail, Facebook, Instagram, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUSINESS_ADDRESS, BUSINESS_PHONE, FACEBOOK_URL, INSTAGRAM_URL, TIKTOK_URL } from "@/lib/google-business";
import Link from "next/link";

export function AboutUs() {
  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 order-2 lg:order-1">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                من نحن
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-foreground dark:text-white leading-tight">
                عن مركز <br />
                <span className="text-emerald-500 underline decoration-emerald-500/30 underline-offset-8 italic">The Drive Center</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed font-sans max-w-xl">
                هدفنا الرئيسي هو توفير أقصى درجات الأمان والثبات لسيارتك، من خلال استخدام أحدث التكنولوجيا العالمية في الفحص والضبط.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: MapPin, title: "العنوان", detail: `${BUSINESS_ADDRESS}، المحلة الكبرى` },
                { icon: Phone, title: "الرقم الرسمي", detail: BUSINESS_PHONE },
                { icon: Mail, title: "الإيميل", detail: "info@thedrivecenter.com" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-muted-foreground">{item.title}</h4>
                    <p className="font-black text-lg">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <Button asChild variant="outline" size="icon" className="w-12 h-12 rounded-full border-zinc-200 dark:border-zinc-800 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-300 shadow-sm">
                <Link href={TIKTOK_URL} target="_blank"><Music2 className="w-5 h-5" /></Link>
              </Button>
              <Button asChild variant="outline" size="icon" className="w-12 h-12 rounded-full border-zinc-200 dark:border-zinc-800 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-300 shadow-sm">
                <Link href={FACEBOOK_URL} target="_blank"><Facebook className="w-5 h-5" /></Link>
              </Button>
              <Button asChild variant="outline" size="icon" className="w-12 h-12 rounded-full border-zinc-200 dark:border-zinc-800 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-all duration-300 shadow-sm">
                <Link href={INSTAGRAM_URL} target="_blank"><Instagram className="w-5 h-5" /></Link>
              </Button>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="relative aspect-square w-full max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-linear-to-tr from-emerald-500 to-emerald-700 opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center text-emerald-500/10">
                <span className="text-[200px] font-black">DRIVE</span>
              </div>
              <div className="absolute bottom-8 left-8 right-8 bg-white/20 dark:bg-black/20 backdrop-blur-xl p-8 rounded-2xl border border-white/30 dark:border-white/10 animate-in slide-in-from-bottom-4 duration-500">
                <h4 className="text-2xl font-black mb-2">رؤيتنا</h4>
                <p className="text-sm opacity-80 font-bold leading-relaxed">أن نكون الوجهة الأولى والموثوقة لكل مالك سيارة يبحث عن الدقة والاحترافية.</p>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[radial-gradient(#0369A1_2px,transparent_2px)] bg-size-[16px_16px] opacity-30" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[radial-gradient(#0369A1_2px,transparent_2px)] bg-size-[16px_16px] opacity-30" />
          </div>
        </div>
      </div>
    </section>
  );
}
