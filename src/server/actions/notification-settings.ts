"use server";

import { db } from "@/db";
import { siteSettings, notificationEvents } from "@/db/schema";
import { desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { NOTIFICATION_SETTING_KEYS, type NotificationSettingKey } from "@/lib/constants";

function isAdminRole(role?: string) {
  return role === "admin" || role === "owner";
}

export async function getNotificationSettings() {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user || !isAdminRole(role)) {
    return { success: false as const, error: "Unauthorized" };
  }

  const rows = await db.query.siteSettings.findMany({
    where: (fields, { inArray }) =>
      inArray(fields.key, [...NOTIFICATION_SETTING_KEYS]),
  });

  const map = Object.fromEntries(rows.map((r) => [r.key, r.value ?? ""]));

  return {
    success: true as const,
    data: {
      email_notifications_enabled: map["email_notifications_enabled"] ?? "true",
      whatsapp_notifications_enabled: map["whatsapp_notifications_enabled"] ?? "false",
      notification_from_email: map["notification_from_email"] ?? "",
      maintenance_reminder_days: map["maintenance_reminder_days"] ?? "3",
    },
  };
}

export async function updateNotificationSetting(key: NotificationSettingKey, value: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user || !isAdminRole(role)) {
    return { success: false, error: "Unauthorized" };
  }

  await db
    .insert(siteSettings)
    .values({ key, value })
    .onConflictDoUpdate({ target: siteSettings.key, set: { value } });

  revalidatePath("/admin/notifications");
  return { success: true };
}

export async function getNotificationLog(page = 1, limit = 20) {
  const session = await auth.api.getSession({ headers: await headers() });
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user || !isAdminRole(role)) {
    return { success: false as const, error: "Unauthorized" };
  }

  const offset = (page - 1) * limit;

  const events = await db.query.notificationEvents.findMany({
    orderBy: [desc(notificationEvents.createdAt)],
    limit,
    offset,
  });

  return { success: true as const, data: events };
}
