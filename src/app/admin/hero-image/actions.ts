"use server";

import { siteSettingQueries } from "@/db/queries/site-settings";
import { revalidatePath } from "next/cache";
import { AuthorizationError, requireAdmin } from "@/lib/server-auth";
import { headers } from "next/headers";
import { enforceRateLimit, RateLimitError, rateLimitPolicies } from "@/lib/rate-limit";

export async function updateHeroImage(imageUrl: string) {
  try {
    const session = await requireAdmin();
    await enforceRateLimit(rateLimitPolicies.adminWrite, {
      headers: await headers(),
      userId: session.user.id,
    });
    await siteSettingQueries.set("hero_image_url", imageUrl);
    revalidatePath("/");
    revalidatePath("/admin/hero-image");
    return { success: true };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return { error: "Unauthorized" };
    }
    if (error instanceof RateLimitError) {
      return { error: error.result.message };
    }
    console.error("Error updating hero image:", error);
    return { error: "فشل تحديث صورة الهيرو" };
  }
}

export async function getHeroImage() {
  return await siteSettingQueries.get("hero_image_url");
}
