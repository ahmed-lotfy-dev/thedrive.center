import { NextResponse } from "next/server";
import { syncStatsToDatabase } from "@/lib/google-api";

/**
 * GET /api/cron/sync-stats
 * 
 * Scheduled task to fetch latest Google Business stats and persist them to DB.
 * Can be triggered via a cron job (e.g., Vercel Cron or GitHub Actions).
 */
export async function GET(request: Request) {
  // Optional: Add simple secret check if needed
  // const authHeader = request.headers.get('authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new NextResponse('Unauthorized', { status: 401 });
  // }

  try {
    await syncStatsToDatabase();
    return NextResponse.json({ success: true, message: "Stats synced successfully" });
  } catch (error) {
    console.error("Cron sync failed:", error);
    return NextResponse.json({ success: false, error: "Sync failed" }, { status: 500 });
  }
}
