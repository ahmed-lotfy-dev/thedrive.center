"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface Slide {
  id: string;
  title: string | null;
  description: string | null;
  imageUrl: string;
  linkUrl: string | null;
  buttonText?: string | null;
}

interface HeroCarouselProps {
  slides?: Slide[];
}

export function HeroCarousel({ slides = [] }: HeroCarouselProps) {
  const { data: session } = authClient.useSession();
  const plugin = React.useRef(Autoplay({ delay: 4500, stopOnInteraction: true }));

  const displaySlides =
    slides.length > 0
      ? slides
      : [
          {
            id: "1",
            title: "ضبط زوايا وترصيص بأحدث الأجهزة",
            description: "تشخيص دقيق وتحسين ثبات العربية على الطريق.",
            imageUrl: "/hero-maintenance.png",
            linkUrl: "/book",
            buttonText: "احجز الآن",
          },
          {
            id: "2",
            title: "فحص شامل قبل البيع والشراء",
            description: "نتيجة واضحة تساعدك تاخد قرارك بثقة.",
            imageUrl: "/hero-spare-parts.png",
            linkUrl: "/book",
            buttonText: "اطلب فحص",
          },
          {
            id: "3",
            title: "خدمة سريعة ومواعيد مرنة",
            description: "فريق محترف وتجهيزات قوية في قلب المحلة الكبرى.",
            imageUrl: "/hero-water-filters.png",
            linkUrl: "/book",
            buttonText: "تواصل معنا",
          },
        ];

  return (
    <Carousel
      opts={{ align: "start", direction: "rtl", loop: true }}
      plugins={[plugin.current]}
      className="w-full relative"
      dir="rtl"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {displaySlides.map((slide) => (
          <CarouselItem key={slide.id}>
            <div className="relative h-[520px] md:h-[680px] w-full overflow-hidden rounded-3xl">
              <div className="absolute inset-0 z-0">
                <Image
                  src={slide.imageUrl}
                  alt={slide.title || "صورة الخدمة"}
                  fill
                  className="object-cover scale-[1.03] transition-transform duration-7000 ease-linear hover:scale-[1.1]"
                  priority
                />
              </div>

              <div className="absolute inset-0 bg-linear-to-tr from-zinc-950/80 via-zinc-950/35 to-zinc-900/10 z-10" />
              <div className="absolute -top-16 -left-14 h-44 w-44 rounded-full bg-teal-300/25 blur-3xl z-10" />
              <div className="absolute -bottom-14 -right-10 h-48 w-48 rounded-full bg-zinc-300/20 blur-3xl z-10" />

              <div className="absolute inset-0 z-20 flex flex-col justify-center items-start px-8 md:px-24">
                <div className="max-w-2xl space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-1000">
                  <div className="inline-block px-4 py-1.5 rounded-full border border-white/30 bg-black/20 text-white text-sm font-medium mb-2">
                    The Drive Center
                  </div>

                  <h2 className="text-4xl md:text-6xl font-bold font-heading leading-tight text-white drop-shadow-2xl">
                    {slide.title}
                  </h2>

                  <p className="text-lg md:text-2xl text-zinc-200 font-sans leading-relaxed max-w-xl drop-shadow-lg opacity-90">
                    {slide.description}
                  </p>

                  {slide.linkUrl && (
                    <div className="flex flex-wrap gap-4 pt-4">
                      {(!session || slide.linkUrl !== "/book") && (
                        <Button
                          asChild
                          size="lg"
                          className="h-12 px-8 rounded-full bg-accent hover:bg-accent/90 text-white shadow-xl hover:shadow-accent/40 transition-all duration-300 shine"
                        >
                          <Link href={slide.linkUrl}>{slide.buttonText || "احجز الآن"}</Link>
                        </Button>
                      )}
                      {!session && (
                        <Button
                          variant="outline"
                          size="lg"
                          className="h-12 px-8 rounded-full border-white/40 bg-black/20 text-white hover:bg-white/10 shadow-lg transition-all duration-300"
                        >
                          <Link href="/book">احجز موعد</Link>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background to-transparent z-20" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4 rtl:left-auto rtl:right-4" />
      <CarouselNext className="right-4 rtl:right-auto rtl:left-4" />
    </Carousel>
  );
}
