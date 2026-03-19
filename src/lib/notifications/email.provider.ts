import { Resend } from "resend";
import { inArray } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";

let resend: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

async function getEmailSettings() {
  const rows = await db.query.siteSettings.findMany({
    where: inArray(siteSettings.key, [
      "email_notifications_enabled",
      "notification_from_email",
    ]),
  });

  const map = Object.fromEntries(rows.map((row) => [row.key, row.value ?? ""]));

  return {
    enabled: map.email_notifications_enabled !== "false",
    from: map.notification_from_email?.trim() || process.env.RESEND_FROM_EMAIL || "noreply@thedrive.center",
  };
}

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; error?: string }> {
  const client = getResendClient();

  if (!client) {
    return { success: false, error: "RESEND_API_KEY not configured — email skipped" };
  }

  const { enabled, from } = await getEmailSettings();

  if (!enabled) {
    return { success: false, error: "Email notifications disabled by admin." };
  }

  try {
    const { error } = await client.emails.send({
      from,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown email send error",
    };
  }
}
