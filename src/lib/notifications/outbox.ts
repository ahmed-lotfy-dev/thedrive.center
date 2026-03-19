import { db } from "@/db";
import { notificationEvents, siteSettings } from "@/db/schema";
import { and, eq, lte } from "drizzle-orm";
import { notificationService } from "./notification.service";
import { logger } from "@/lib/logger";
import { getServiceTypeLabel, getAppointmentStatusLabel } from "@/lib/constants";
import type {
  NotificationEventStatusValue,
  NotificationEventTypeValue,
} from "@/lib/constants";

async function isWhatsAppEnabledInSettings(): Promise<boolean> {
  const row = await db.query.siteSettings.findFirst({
    where: eq(siteSettings.key, "whatsapp_notifications_enabled"),
  });
  return row?.value !== "false";
}


type NotificationPayload = Record<string, unknown>;

type NotificationEventInsert = {
  type: NotificationEventTypeValue;
  phone: string;
  email?: string | null;
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
    email: values.email ?? null,
    payload: values.payload ?? {},
    provider: notificationService.getProviderName(),
    scheduledFor: values.scheduledFor ?? new Date(),
  }).returning();

  logger.info("notification.queued", {
    eventId: event.id,
    type: event.type,
    appointmentId: event.appointmentId,
    carId: event.carId,
    userId: event.userId,
  });

  return event;
}

export async function processNotificationEvent(eventId: string) {
  const event = await db.query.notificationEvents.findFirst({
    where: eq(notificationEvents.id, eventId),
  });

  if (!event) {
    logger.warn("notification.process_missing", { eventId });
    return { success: false, error: "Notification event not found" };
  }

  if (event.status !== "pending") {
    logger.info("notification.process_skipped_non_pending", {
      eventId,
      status: event.status,
    });
    return { success: true, skipped: true };
  }

  // --- WhatsApp delivery ---
  let whatsappResult: { success: boolean; error?: string } = { success: true };
  let shouldSkipWhatsApp = false;

  const whatsappEnabledInDb = await isWhatsAppEnabledInSettings();

  if (!notificationService.shouldAttemptDelivery() || !whatsappEnabledInDb) {
    logger.warn("notification.delivery_disabled", {
      eventId,
      provider: notificationService.getProviderName(),
      whatsappEnabledInDb,
    });

    shouldSkipWhatsApp = true;
    whatsappResult = { success: true };
  } else {
    whatsappResult = await notificationService.sendWhatsApp(event.phone, event.message);
    const status: NotificationEventStatusValue = whatsappResult.success ? "sent" : "failed";

    await db.update(notificationEvents)
      .set({
        status,
        provider: notificationService.getProviderName(),
        sentAt: whatsappResult.success ? new Date() : null,
        error: whatsappResult.error ?? null,
        updatedAt: new Date(),
      })
      .where(eq(notificationEvents.id, eventId));

    logger.info("notification.processed", {
      eventId,
      status,
      provider: notificationService.getProviderName(),
    });
  }

  // --- Email delivery (parallel channel, non-blocking) ---
  if (event.email && notificationService.isEmailEnabled()) {
    try {
      await dispatchEmailForEvent(event);
    } catch (err) {
      logger.warn("notification.email_dispatch_failed", {
        eventId,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  if (shouldSkipWhatsApp) {
    await db.update(notificationEvents)
      .set({
        status: "skipped",
        provider: notificationService.getProviderName(),
        error: !whatsappEnabledInDb
          ? "تم تعطيل إشعارات واتساب من لوحة الإدارة."
          : "إرسال واتساب متوقف حاليًا حتى يتم تفعيل مزود واتساب الإنتاجي.",
        updatedAt: new Date(),
      })
      .where(eq(notificationEvents.id, eventId));

    return { success: true, skipped: true };
  }

  return whatsappResult.success
    ? { success: true }
    : { success: false, error: whatsappResult.error ?? "Failed to deliver notification" };
}

async function dispatchEmailForEvent(event: {
  id: string;
  type: NotificationEventTypeValue;
  email: string | null;
  customerName: string | null;
  payload: Record<string, unknown>;
}) {
  if (!event.email) return;

  const customerName = event.customerName ?? "عميلنا";
  const payload = event.payload;
  const serviceType = getServiceTypeLabel(String(payload.serviceType ?? ""));
  const date = payload.date
    ? new Date(String(payload.date)).toLocaleDateString("ar-EG")
    : "";
  let result: { success: boolean; error?: string } | null = null;

  if (event.type === "appointment_request_received") {
    result = await notificationService.sendBookingConfirmationEmail(
      event.email,
      customerName,
      serviceType,
      date,
    );
  } else if (
    event.type === "appointment_confirmed" ||
    event.type === "appointment_completed" ||
    event.type === "appointment_cancelled" ||
    event.type === "service_record_added"
  ) {
    const statusValue = String(
      payload.status ?? (event.type === "service_record_added" ? "completed" : event.type.replace("appointment_", ""))
    );

    const statusLabel = getAppointmentStatusLabel(statusValue);
    const statusEmojiMap: Record<string, string> = {
      confirmed: "✅",
      completed: "🎉",
      cancelled: "❌",
    };
    const statusEmoji = statusEmojiMap[statusValue] ?? "📋";

    result = await notificationService.sendAppointmentStatusEmail(
      event.email,
      customerName,
      statusLabel,
      statusEmoji,
      serviceType,
      date,
    );
  } else if (
    event.type === "maintenance_service_reminder" ||
    event.type === "maintenance_alignment_reminder"
  ) {
    const reminderLabel =
      event.type === "maintenance_alignment_reminder" ? "ضبط زوايا" : "صيانة دورية";
    const plateNumber = String(payload.plateNumber ?? "");
    const reminderDate = payload.reminderDate
      ? new Date(String(payload.reminderDate)).toLocaleDateString("ar-EG")
      : "";

    result = await notificationService.sendMaintenanceReminderEmail(
      event.email,
      customerName,
      reminderLabel,
      reminderDate,
      plateNumber,
    );
  }

  if (result?.success) {
    logger.info("notification.email_sent", { eventId: event.id, type: event.type });
    return;
  }

  if (result && !result.success) {
    logger.warn("notification.email_not_sent", {
      eventId: event.id,
      type: event.type,
      error: result.error ?? "Unknown email send error",
    });
  }
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

  logger.info("notification.process_due_batch", {
    limit,
    processed,
    sent,
    failed,
    skipped,
  });

  return { processed, sent, failed, skipped };
}
