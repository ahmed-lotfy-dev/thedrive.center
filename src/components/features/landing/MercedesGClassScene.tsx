"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, OrbitControls } from "@react-three/drei";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Group } from "three";
import { MathUtils } from "three";

function GClassModel() {
  const groupRef = useRef<Group | null>(null);
  const wheelRef = useRef<Group | null>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 1.8) * 0.025;
    if (wheelRef.current) {
      wheelRef.current.rotation.x += 0.03;
    }
  });

  const bodyMat = useMemo(
    () => ({
      color: "#0f766e",
      metalness: 0.62,
      roughness: 0.22,
    }),
    []
  );

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} scale={1.2}>
      <mesh position={[0, 0.26, 0]}>
        <boxGeometry args={[3.8, 0.65, 1.65]} />
        <meshStandardMaterial {...bodyMat} />
      </mesh>

      <mesh position={[0.28, 0.78, 0]}>
        <boxGeometry args={[2.55, 0.62, 1.5]} />
        <meshStandardMaterial {...bodyMat} />
      </mesh>

      <mesh position={[1.95, 0.25, 0]} rotation={[0, 0, 0.06]}>
        <boxGeometry args={[0.48, 0.45, 1.25]} />
        <meshStandardMaterial color="#0b3f3b" metalness={0.55} roughness={0.3} />
      </mesh>

      <mesh position={[-1.93, 0.24, 0]}>
        <boxGeometry args={[0.45, 0.45, 1.24]} />
        <meshStandardMaterial color="#0b3f3b" metalness={0.55} roughness={0.3} />
      </mesh>

      <mesh position={[0.26, 0.82, 0.78]}>
        <boxGeometry args={[2.35, 0.42, 0.02]} />
        <meshPhysicalMaterial color="#b8c5d6" transmission={0.62} roughness={0.18} thickness={0.12} />
      </mesh>
      <mesh position={[0.26, 0.82, -0.78]}>
        <boxGeometry args={[2.35, 0.42, 0.02]} />
        <meshPhysicalMaterial color="#b8c5d6" transmission={0.62} roughness={0.18} thickness={0.12} />
      </mesh>
      <mesh position={[1.25, 0.85, 0]}>
        <boxGeometry args={[0.02, 0.36, 1.25]} />
        <meshPhysicalMaterial color="#b8c5d6" transmission={0.5} roughness={0.22} thickness={0.1} />
      </mesh>

      <group ref={wheelRef}>
        {[
          [1.35, -0.05, 0.86],
          [1.35, -0.05, -0.86],
          [-1.35, -0.05, 0.86],
          [-1.35, -0.05, -0.86],
        ].map((pos, idx) => (
          <group key={idx} position={pos as [number, number, number]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.34, 0.34, 0.28, 28]} />
              <meshStandardMaterial color="#0f172a" roughness={0.86} metalness={0.2} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.18, 0.18, 0.3, 22]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.25} metalness={0.85} />
            </mesh>
          </group>
        ))}
      </group>

      <mesh position={[2.05, 0.23, 0.48]}>
        <boxGeometry args={[0.07, 0.12, 0.28]} />
        <meshStandardMaterial color="#f8fafc" emissive="#ffffff" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[2.05, 0.23, -0.48]}>
        <boxGeometry args={[0.07, 0.12, 0.28]} />
        <meshStandardMaterial color="#f8fafc" emissive="#ffffff" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[-2.06, 0.23, 0.48]}>
        <boxGeometry args={[0.07, 0.1, 0.28]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[-2.06, 0.23, -0.48]}>
        <boxGeometry args={[0.07, 0.1, 0.28]} />
        <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

export function MercedesGClassScene() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<Group | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const wrapper = wrapperRef.current;
    const card = cardRef.current;
    const scene = sceneRef.current;
    if (!wrapper || !card || !scene) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: "top 82%",
        once: true,
      },
    });

    tl.fromTo(card, { autoAlpha: 0, y: 35, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.95, ease: "power3.out" });

    gsap.to(scene.rotation, {
      y: Math.PI * 2.5,
      x: -0.08,
      ease: "none",
      scrollTrigger: {
        trigger: wrapper,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    const handleMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = MathUtils.clamp((0.5 - py) * 10, -8, 8);
      const ry = MathUtils.clamp((px - 0.5) * 12, -10, 10);
      gsap.to(card, {
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 1300,
        transformOrigin: "center center",
        duration: 0.35,
        ease: "power2.out",
      });
    };

    const handleLeave = () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.45, ease: "power2.out" });
    };

    wrapper.addEventListener("mousemove", handleMove);
    wrapper.addEventListener("mouseleave", handleLeave);
    return () => {
      wrapper.removeEventListener("mousemove", handleMove);
      wrapper.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative" data-animate>
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-[30px] border border-white/20 bg-[#0b1220] p-3 shadow-[0_34px_90px_rgba(2,8,23,0.5)]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <span className="absolute top-4 left-4 z-10 rounded-full border border-white/30 bg-black/35 px-3 py-1 text-[11px] font-semibold text-white">
          Mercedes G-Class 3D
        </span>
        <div className="rounded-[22px] border border-white/15 bg-slate-900/65">
          <div className="relative h-[300px] md:h-[330px] w-full">
            <Canvas camera={{ position: [4.8, 1.9, 3.2], fov: 36 }} dpr={[1, 1.6]}>
              <group ref={sceneRef}>
                <Suspense fallback={null}>
                  <ambientLight intensity={0.8} />
                  <directionalLight position={[4, 5, 2]} intensity={1.35} />
                  <directionalLight position={[-3, 2, -5]} intensity={0.5} color="#14b8a6" />
                  <GClassModel />
                  <ContactShadows position={[0, -0.55, 0]} opacity={0.32} scale={9} blur={2.4} far={2.1} />
                  <Environment preset="city" />
                  <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.1} minPolarAngle={Math.PI / 2.8} />
                </Suspense>
              </group>
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
