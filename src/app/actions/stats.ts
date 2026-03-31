"use server";

import { getGoogleBusinessStats } from "@/lib/google-api";
import { logger } from "@/lib/logger";

export async function getDynamicStats() {
  try {
    return await getGoogleBusinessStats();
  } catch (error) {
    logger.error("Failed to fetch dynamic stats via server action", { error });
    return null;
  }
}
