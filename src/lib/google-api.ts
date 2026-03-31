
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { GOOGLE_PLACE_ID, GOOGLE_RATING, GOOGLE_REVIEWS_COUNT } from "./google-business";
import { logger } from "@/lib/logger";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export interface GoogleBusinessStats {
  rating: string;
  reviewsCount: string;
}

/**
 * Fetches the latest rating and review count from Google Places API (New).
 * Requires GOOGLE_MAPS_API_KEY and GOOGLE_PLACE_ID.
 */
export async function fetchGoogleBusinessStats(): Promise<GoogleBusinessStats | null> {
  if (!GOOGLE_MAPS_API_KEY || !GOOGLE_PLACE_ID) {
    logger.warn("Google Maps API Key or Place ID missing. Using fallback values.");
    return null;
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${GOOGLE_PLACE_ID}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "rating,userRatingCount",
      },
    });
    
    const data = await response.json();

    if (response.ok && data) {
      return {
        rating: data.rating?.toString() || GOOGLE_RATING,
        reviewsCount: data.userRatingCount?.toString() || GOOGLE_REVIEWS_COUNT,
      };
    }

    logger.error("Google Places API error", { status: data.error?.status, message: data.error?.message });
    return null;
  } catch (error) {
    logger.error("Failed to fetch Google Business stats", { error });
    return null;
  }
}

/**
 * Persists the stats to the database site_settings table.
 */
export async function syncStatsToDatabase() {
  const stats = await fetchGoogleBusinessStats();
  if (!stats) return;

  try {
    // Update Rating
    await db
      .insert(siteSettings)
      .values({ key: "google_rating", value: stats.rating })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: stats.rating, updatedAt: new Date() },
      });

    // Update Reviews Count
    await db
      .insert(siteSettings)
      .values({ key: "google_reviews_count", value: stats.reviewsCount })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value: stats.reviewsCount, updatedAt: new Date() },
      });

    logger.info("Successfully synced Google Business stats to database");
  } catch (error) {
    logger.error("Failed to sync stats to database", { error });
  }
}

/**
 * Retrieves stats from DB with a local constant fallback.
 */
export async function getGoogleBusinessStats(): Promise<GoogleBusinessStats> {
  try {
    const settings = await db.select().from(siteSettings);
    
    const rating = settings.find((s) => s.key === "google_rating")?.value || GOOGLE_RATING;
    const reviewsCount = settings.find((s) => s.key === "google_reviews_count")?.value || GOOGLE_REVIEWS_COUNT;

    return { rating, reviewsCount };
  } catch {
    return { rating: GOOGLE_RATING, reviewsCount: GOOGLE_REVIEWS_COUNT };
  }
}
