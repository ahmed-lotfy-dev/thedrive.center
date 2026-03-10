"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function GlobalScrollEffects() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const animatedEls = gsap.utils.toArray<HTMLElement>("[data-animate]");
      animatedEls.forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 26, scale: 0.98 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.95,
            ease: "power3.out",
            overwrite: "auto",
            scrollTrigger: {
              trigger: el,
              start: "top 84%",
              once: true,
            },
          }
        );
      });

      const parallaxEls = gsap.utils.toArray<HTMLElement>("[data-parallax]");
      parallaxEls.forEach((el) => {
        const speed = Number(el.dataset.parallax || "40");
        gsap.to(el, {
          y: speed,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
