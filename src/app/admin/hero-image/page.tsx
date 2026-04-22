import { HeroImageClient } from "./client";
import { siteSettingQueries } from "@/db/queries/site-settings";

export const dynamic = "force-dynamic";

export default async function HeroImageAdminPage() {
  const heroImageUrl = await siteSettingQueries.get("hero_image_url");
  const mobileImageUrl = await siteSettingQueries.get("hero_image_mobile_url");

  return <HeroImageClient initialImageUrl={heroImageUrl} initialMobileUrl={mobileImageUrl} />;
}
