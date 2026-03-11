import { Hero } from "@/features/landing/components/Hero";
import { Services } from "@/features/landing/components/Services";
import { UvInspection } from "@/features/landing/components/UvInspection";
import { Process } from "@/features/landing/components/Process";
import { CTA } from "@/features/landing/components/CTA";
import { LocationSection } from "@/features/landing/components/LocationSection";
import { ComingSoon } from "@/features/maintenance/components/ComingSoon";

export default function Home() {
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  if (isMaintenanceMode) {
    return <ComingSoon />;
  }

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
