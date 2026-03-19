"use server";

import { siteSettingQueries } from "@/db/queries/site-settings";
import { revalidatePath } from "next/cache";
import { AuthorizationError, requireAdmin } from "@/lib/server-auth";

export async function updateHeroImage(imageUrl: string) {
  try {
    await requireAdmin();
    await siteSettingQueries.set("hero_image_url", imageUrl);
    revalidatePath("/");
    revalidatePath("/admin/hero-image");
    return { success: true };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return { error: "Unauthorized" };
    }
    console.error("Error updating hero image:", error);
    return { error: "فشل تحديث صورة الهيرو" };
  }
}

export async function getHeroImage() {
  return await siteSettingQueries.get("hero_image_url");
}
