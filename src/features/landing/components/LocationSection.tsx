"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Star, Facebook, Lightbulb } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import * as motion from "motion/react-client";
import {
  FACEBOOK_URL,
  INSTAGRAM_URL,
  TIKTOK_URL,
  getDirectionsUrl,
  getMapEmbedUrl,
  getReviewsUrl,
} from "@/lib/google-business";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1
    } as any
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export function LocationSection() {
  const mapSrc = getMapEmbedUrl();
  const directionsUrl = getDirectionsUrl();
  const reviewsUrl = getReviewsUrl();

  return (
    <motion.section
      id="location"
      className="container mx-auto px-4 py-20 md:py-32"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants as any}
    >
      <div className="grid gap-12 lg:grid-cols-2 items-start">
        <div className="space-y-6">
          <motion.div className="space-y-4" variants={itemVariants as any}>
            <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5 px-4 h-8 rounded-full font-bold">
              موقعنا وتواصلنا
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
              نورنا في <span className="text-emerald-500">المحلة الكبرى</span>
            </h2>
            <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl font-medium">
              مجهزون بأحدث التكنولوجيا والخبرات الهندسية لخدمة وصيانة سيارتك بأعلى المعايير.
            </p>
          </motion.div>

          <motion.div className="flex flex-col gap-4" variants={itemVariants as any}>
            <Card className="relative overflow-hidden bg-card/40 backdrop-blur-xl border-border/50 group/addr">
              <CardContent className="">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover/addr:scale-110 transition-transform">
                    <MapPin className="size-5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-emerald-500/80 uppercase tracking-wider mb-1">
                      العنوان بالتفصيل
                    </h3>
                    <p className="text-xl font-bold text-foreground">
                      منشية البكري، ٨ شارع طلعت النجار، المحلة الكبرى
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Lightbulb className="size-4 text-emerald-500" />
                  </div>
                  <p className="text-sm text-emerald-500/90 leading-relaxed font-medium">
                    <span className="font-bold underline">نصيحة للوصول أسرع:</span>
                    <br />
                    في مدخل المحلة الكبري، لعدم أخذ مسافة طويلة لا تدخل من مدخل الشعبية الأساسي، يفضل أخذ أول مدخل يمين (مدخل الشعبية الخارجي) قبل الكمين مباشرة.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-card/40 backdrop-blur-xl border-border/50 group/time">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3 border border-emerald-500/20 group-hover/time:rotate-12 transition-transform">
                    <Clock className="size-5 text-emerald-500" />
                  </div>
                  <h3 className="text-[10px] font-medium text-muted-foreground mb-1 uppercase tracking-widest">المواعيد</h3>
                  <p className="font-bold text-foreground">يومياً 9ص - 10م</p>
                </CardContent>
              </Card>

              <Card className="bg-card/40 backdrop-blur-xl border-border/50 group/phone">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3 border border-emerald-500/20 group-hover/phone:scale-110 transition-transform">
                    <Phone className="size-5 text-emerald-500" />
                  </div>
                  <h3 className="text-[10px] font-medium text-muted-foreground mb-1 uppercase tracking-widest">التواصل</h3>
                  <p className="font-bold text-foreground dir-ltr underline decoration-emerald-500/30 underline-offset-4 decoration-2">01017131414</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <motion.div className="flex flex-wrap items-center gap-2 pt-2" variants={itemVariants as any}>
            <Button asChild size="lg" className="rounded-2xl h-12 px-6 bg-emerald-600 hover:bg-emerald-500 text-sm font-bold shadow-lg shadow-emerald-500/20 group">
              <Link href={directionsUrl} target="_blank" rel="noopener noreferrer">
                افتح الخريطة
                <MapPin className="ml-2 size-4 transition-transform group-hover:-translate-y-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-2xl h-12 px-6 border-border bg-card/40 backdrop-blur-md text-sm font-bold hover:border-amber-500/50 hover:bg-amber-500/5 hover:text-amber-600 dark:hover:text-amber-400 transition-all cursor-pointer">
              <Link href={reviewsUrl} target="_blank" rel="noopener noreferrer">
                التقييمات
                <Star className="ml-2 size-4 text-amber-500 fill-amber-500" />
              </Link>
            </Button>

            {/* Premium Social Icons - UI/UX Pro Max Redesign */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { 
                  name: "Facebook", 
                  icon: Facebook, 
                  href: FACEBOOK_URL, 
                  hoverClass: "hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]/20" 
                },
                { 
                  name: "Instagram", 
                  icon: (props: any) => (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  ), 
                  href: INSTAGRAM_URL, 
                  hoverClass: "hover:bg-gradient-to-tr hover:from-[#f9ce34]/10 hover:via-[#ee2a7b]/10 hover:to-[#6228d7]/10 hover:text-[#e4405f] hover:border-[#e4405f]/20" 
                },
                { 
                  name: "TikTok", 
                  icon: (props: any) => (
                    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
                      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
                    </svg>
                  ), 
                  href: TIKTOK_URL, 
                  hoverClass: "hover:bg-zinc-900/10 dark:hover:bg-white/10 hover:text-foreground hover:border-foreground/20" 
                }
              ].map((social, idx) => (
                <Button
                  key={idx}
                  asChild
                  variant="outline"
                  className={cn(
                    "group/soc size-12 rounded-2xl p-0 transition-all duration-300",
                    "bg-card/40 backdrop-blur-xl border-border/50",
                    "shadow-sm hover:shadow-xl hover:-translate-y-1.5 active:scale-95",
                    social.hoverClass
                  )}
                >
                  <Link href={social.href} target="_blank" rel="noopener noreferrer" title={social.name}>
                    <social.icon className="size-5 transition-transform duration-300 group-hover/soc:scale-110" />
                  </Link>
                </Button>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="relative group p-2 rounded-[3.5rem] bg-zinc-200/50 dark:bg-zinc-800/50 border-4 border-white dark:border-white/5 shadow-2xl overflow-hidden"
          variants={itemVariants as any}
        >
          <iframe
            src={mapSrc}
            width="100%"
            height="600"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full rounded-[2.8rem] transition-all duration-700"
            title="خريطة المركز"
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
