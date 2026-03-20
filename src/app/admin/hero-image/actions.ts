"use server";

import { siteSettingQueries } from "@/db/queries/site-settings";
import { revalidatePath } from "next/cache";
import { AuthorizationError, requireAdmin } from "@/lib/server-auth";
import { logger } from "@/lib/logger";

export async function updateHeroImage(imageUrl: string) {
  try {
    await requireAdmin();
    await siteSettingQueries.set("hero_image_url", imageUrl);
    revalidatePath("/");
    revalidatePath("/admin/hero-image");
    logger.info("admin.hero_image.updated", {
      imageUrl,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return { error: "Unauthorized" };
    }
    logger.error("admin.hero_image.update_failed", {
      error,
      imageUrl,
    });
    return { error: "فشل تحديث صورة الهيرو" };
  }
}

export async function getHeroImage() {
  return await siteSettingQueries.get("hero_image_url");
}
