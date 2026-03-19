import { NextResponse } from "next/server";
import { processDueNotificationEvents } from "@/lib/notifications/outbox";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret) {
    logger.error("cron.process_notifications.misconfigured", {
      route: "/api/cron/process-notifications",
    });
    return NextResponse.json(
      { error: "CRON_SECRET is not configured" },
      { status: 500 },
    );
  }

  if (authHeader !== `Bearer ${expectedSecret}`) {
    logger.warn("cron.process_notifications.unauthorized", {
      route: "/api/cron/process-notifications",
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summary = await processDueNotificationEvents();
  logger.info("cron.process_notifications.completed", summary);
  return NextResponse.json({ success: true, ...summary });
}
