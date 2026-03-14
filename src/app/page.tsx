import { Hero } from "@/features/landing/components/Hero";
import { Services } from "@/features/landing/components/Services";
import { Process } from "@/features/landing/components/Process";
import { FAQ } from "@/features/landing/components/FAQ";
import { CTA } from "@/features/landing/components/CTA";
import { LocationSection } from "@/features/landing/components/LocationSection";
import { ComingSoon } from "@/features/maintenance/components/ComingSoon";

import { siteSettingQueries } from "@/db/queries/site-settings";
import { getRandomAdvice } from "@/app/admin/advices/actions";
import { AdvicePopup } from "@/components/shared/AdvicePopup";

export default async function Home() {
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";

  if (isMaintenanceMode) {
    return <ComingSoon />;
  }

  const [heroImageUrl, randomAdvice] = await Promise.all([
    siteSettingQueries.get("hero_image_url"),
    getRandomAdvice()
  ]);

  return (
    <main dir="rtl" className="overflow-x-hidden pb-10">
      <Hero imageUrl={heroImageUrl} />
      <Services />
      <Process />
      <FAQ />
      <CTA />
      <LocationSection />
      
      {/* Dynamic Car Tips / Advice Pop-up */}
      <AdvicePopup advice={randomAdvice} delaySeconds={30} />
    </main>
  );
}
