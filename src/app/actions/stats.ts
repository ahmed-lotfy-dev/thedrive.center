"use server";

import { getGoogleBusinessStats } from "@/lib/google-api";

/**
 * Server action to safely retrieve Google Business stats for Client Components.
 */
export async function getDynamicStats() {
  try {
    return await getGoogleBusinessStats();
  } catch (error) {
    console.error("Failed to fetch dynamic stats via server action:", error);
    return null;
  }
}
