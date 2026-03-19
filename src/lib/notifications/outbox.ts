import { db } from "@/db";
import { notificationEvents } from "@/db/schema";
import { and, eq, lte } from "drizzle-orm";
import { notificationService } from "./notification.service";
import type {
  NotificationEventStatusValue,
  NotificationEventTypeValue,
} from "@/lib/constants";

type NotificationPayload = Record<string, unknown>;

type NotificationEventInsert = {
  type: NotificationEventTypeValue;
  phone: string;
  message: string;
  customerName?: string | null;
  payload?: NotificationPayload;
  scheduledFor?: Date;
  appointmentId?: string | null;
  carId?: string | null;
  userId?: string | null;
};

type NotificationExecutor = Pick<typeof db, "insert">;

export async function queueNotificationEvent(
  values: NotificationEventInsert,
  executor: NotificationExecutor = db,
) {
  const [event] = await executor.insert(notificationEvents).values({
    ...values,
    payload: values.payload ?? {},
    provider: notificationService.getProviderName(),
    scheduledFor: values.scheduledFor ?? new Date(),
  }).returning();

  return event;
}

export async function processNotificationEvent(eventId: string) {
  const event = await db.query.notificationEvents.findFirst({
    where: eq(notificationEvents.id, eventId),
  });

  if (!event) {
    return { success: false, error: "Notification event not found" };
  }

  if (event.status !== "pending") {
    return { success: true, skipped: true };
  }

  if (!notificationService.shouldAttemptDelivery()) {
    await db.update(notificationEvents)
      .set({
        status: "skipped",
        provider: notificationService.getProviderName(),
        error: "Delivery disabled until a production WhatsApp provider is approved and enabled.",
        updatedAt: new Date(),
      })
      .where(eq(notificationEvents.id, eventId));

    return { success: true, skipped: true };
  }

  const result = await notificationService.sendWhatsApp(event.phone, event.message);
  const status: NotificationEventStatusValue = result.success ? "sent" : "failed";

  await db.update(notificationEvents)
    .set({
      status,
      provider: notificationService.getProviderName(),
      sentAt: result.success ? new Date() : null,
      error: result.error ?? null,
      updatedAt: new Date(),
    })
    .where(eq(notificationEvents.id, eventId));

  return result.success
    ? { success: true }
    : { success: false, error: result.error ?? "Failed to deliver notification" };
}

export async function processDueNotificationEvents(limit = 50) {
  const dueEvents = await db.query.notificationEvents.findMany({
    where: and(
      eq(notificationEvents.status, "pending"),
      lte(notificationEvents.scheduledFor, new Date()),
    ),
    orderBy: (fields, { asc }) => [asc(fields.scheduledFor)],
    limit,
  });

  let processed = 0;
  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const event of dueEvents) {
    processed += 1;
    const result = await processNotificationEvent(event.id);
    if ("skipped" in result && result.skipped) skipped += 1;
    else if (result.success) sent += 1;
    else failed += 1;
  }

  return { processed, sent, failed, skipped };
}
