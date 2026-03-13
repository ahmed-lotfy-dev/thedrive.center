"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ScrollingCar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !carRef.current) return;

    const car = carRef.current;
    
    // Create the animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5, // Smooth scrubbing
        // onUpdate: (self) => {
        //   // Optional: Add tilt based on velocity if needed
        // }
      }
    });

    // Animate the car along the vertical axis
    tl.to(car, {
      y: "90vh", // Move the car down as we scroll
      ease: "none",
    });

    // Add subtle rotation or "swaying" for more life
    gsap.to(car, {
      rotation: 2,
      repeat: -1,
      yoyo: true,
      duration: 2,
      ease: "power1.inOut",
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-100 overflow-hidden"
    >
      <div 
        ref={carRef}
        className="absolute left-[2%] md:left-[5%] top-[15%] w-32 h-32 md:w-64 md:h-64 flex items-center justify-center opacity-0 transition-opacity duration-1000"
        style={{
          filter: "drop-shadow(0 25px 25px rgba(0,0,0,0.5))",
        }}
      >
         <img 
            src="/scrolling-car.png" 
            alt="Animated Car" 
            className="w-full h-full object-contain rotate-90"
            onLoad={(e) => {
              (e.target as HTMLImageElement).parentElement?.classList.add("opacity-100");
            }}
         />
      </div>
    </div>
  );
}
