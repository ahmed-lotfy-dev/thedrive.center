"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ExoticCar3DCard() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const card = cardRef.current;
    const image = imageRef.current;
    const glow = glowRef.current;
    const wrapper = wrapperRef.current;
    if (!card || !image || !glow || !wrapper) return;

    const enterTl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: "top 82%",
        once: true,
      },
    });

    enterTl
      .fromTo(
        wrapper,
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.85, ease: "power3.out" }
      )
      .fromTo(
        image,
        { scale: 0.92, rotateZ: -1.3 },
        { scale: 1.02, rotateZ: 0, duration: 1.2, ease: "power2.out" },
        "-=0.35"
      );

    gsap.to(glow, {
      opacity: 0.95,
      scale: 1.08,
      repeat: -1,
      yoyo: true,
      duration: 2.2,
      ease: "sine.inOut",
    });

    gsap.to(image, {
      y: -28,
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    const handleMove = (e: MouseEvent) => {
      const bounds = wrapper.getBoundingClientRect();
      const px = (e.clientX - bounds.left) / bounds.width;
      const py = (e.clientY - bounds.top) / bounds.height;
      const rx = (0.5 - py) * 12;
      const ry = (px - 0.5) * 16;

      gsap.to(card, {
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 1300,
        transformOrigin: "center center",
        duration: 0.45,
        ease: "power3.out",
      });
    };

    const resetMove = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.55,
        ease: "power3.out",
      });
    };

    wrapper.addEventListener("mousemove", handleMove);
    wrapper.addEventListener("mouseleave", resetMove);

    return () => {
      wrapper.removeEventListener("mousemove", handleMove);
      wrapper.removeEventListener("mouseleave", resetMove);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative" data-animate>
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-[28px] border border-white/20 bg-[#0b1220] p-4 shadow-[0_30px_90px_rgba(2,8,23,0.45)]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          ref={glowRef}
          className="pointer-events-none absolute -top-12 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full bg-teal-300/35 blur-3xl opacity-70"
        />

        <div className="rounded-2xl border border-white/15 bg-slate-900/65 backdrop-blur-sm p-3">
          <div ref={imageRef} className="relative mx-auto h-[260px] w-full md:h-[300px]">
            <Image
              src="/exotic-car.svg"
              alt="سيارة رياضية ثلاثية الأبعاد"
              fill
              className="object-contain drop-shadow-[0_24px_30px_rgba(15,118,110,0.3)]"
              priority
            />
          </div>
        </div>

        <div className="absolute left-4 top-4 rounded-full border border-white/30 bg-black/35 px-3 py-1 text-[11px] font-semibold text-white">
          Exotic 3D Motion
        </div>
      </div>
    </div>
  );
}
