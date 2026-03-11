import { Hero } from "@/features/landing/components/Hero";
import { Services } from "@/features/landing/components/Services";
import { UvInspection } from "@/features/landing/components/UvInspection";
import { Process } from "@/features/landing/components/Process";
import { CTA } from "@/features/landing/components/CTA";
import { LocationSection } from "@/features/landing/components/LocationSection";

export default function Home() {
  return (
    <main dir="rtl" className="overflow-x-hidden pb-10">
      <Hero />
      <Services />
      <UvInspection />
      <Process />
      <CTA />
      <LocationSection />
    </main>
  );
}
