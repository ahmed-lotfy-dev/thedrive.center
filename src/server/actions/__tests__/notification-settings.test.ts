import { beforeEach, describe, expect, it, vi } from "vitest";

const getSessionMock = vi.fn();
const headersMock = vi.fn();
const findManyMock = vi.fn();

vi.mock("next/headers", () => ({
  headers: headersMock,
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: getSessionMock,
    },
  },
}));

vi.mock("@/db", () => ({
  db: {
    query: {
      siteSettings: {
        findMany: findManyMock,
      },
    },
  },
}));

describe("notification settings actions", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    headersMock.mockResolvedValue(new Headers());
  });

  it("returns unauthorized when settings are requested without admin access", async () => {
    const { getNotificationSettings } = await import("@/server/actions/notification-settings");

    getSessionMock.mockResolvedValueOnce(null);

    const result = await getNotificationSettings();

    expect(result).toEqual({ success: false, error: "Unauthorized" });
    expect(findManyMock).not.toHaveBeenCalled();
  });

  it("returns saved notification settings for admins", async () => {
    const { getNotificationSettings } = await import("@/server/actions/notification-settings");

    getSessionMock.mockResolvedValueOnce({ user: { id: "admin-1", role: "admin" } });
    findManyMock.mockResolvedValueOnce([
      { key: "email_notifications_enabled", value: "false" },
      { key: "admin_booking_alerts_enabled", value: "true" },
      { key: "whatsapp_notifications_enabled", value: "true" },
      { key: "notification_from_email", value: "hello@example.com" },
      { key: "maintenance_reminder_days", value: "5" },
    ]);

    const result = await getNotificationSettings();

    expect(result).toEqual({
      success: true,
      data: {
        email_notifications_enabled: "false",
        admin_booking_alerts_enabled: "true",
        whatsapp_notifications_enabled: "true",
        notification_from_email: "hello@example.com",
        maintenance_reminder_days: "5",
      },
    });
  });
});
