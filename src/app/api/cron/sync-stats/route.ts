import { NextResponse } from "next/server";
import { syncStatsToDatabase } from "@/lib/google-api";
import { logger } from "@/lib/logger";

/**
 * GET /api/cron/sync-stats
 * 
 * Scheduled task to fetch latest Google Business stats and persist them to DB.
 * Can be triggered via a cron job (e.g., Vercel Cron or GitHub Actions).
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!cronSecret) {
    logger.error("cron.sync_stats.misconfigured", {
      route: "/api/cron/sync-stats",
    });
    return NextResponse.json(
      { success: false, error: "Cron secret is not configured" },
      { status: 500 },
    );
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    logger.warn("cron.sync_stats.unauthorized", {
      route: "/api/cron/sync-stats",
    });
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    await syncStatsToDatabase();
    logger.info("cron.sync_stats.completed", {
      route: "/api/cron/sync-stats",
    });
    return NextResponse.json({ success: true, message: "Stats synced successfully" });
  } catch (error) {
    logger.error("cron.sync_stats.failed", {
      route: "/api/cron/sync-stats",
      error,
    });
    return NextResponse.json({ success: false, error: "Sync failed" }, { status: 500 });
  }
}
