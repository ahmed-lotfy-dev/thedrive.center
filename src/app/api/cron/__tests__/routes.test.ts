import { beforeEach, describe, expect, it, vi } from "vitest";

const processDueNotificationEventsMock = vi.fn();
const syncStatsToDatabaseMock = vi.fn();

vi.mock("@/lib/notifications/outbox", () => ({
  processDueNotificationEvents: processDueNotificationEventsMock,
}));

vi.mock("@/lib/google-api", () => ({
  syncStatsToDatabase: syncStatsToDatabaseMock,
}));

describe("cron routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CRON_SECRET = "secret-token";
    processDueNotificationEventsMock.mockResolvedValue({
      processed: 2,
      sent: 1,
      failed: 0,
      skipped: 1,
    });
    syncStatsToDatabaseMock.mockResolvedValue(undefined);
  });

  it("rejects unauthorized notification processing requests", async () => {
    const { POST } = await import("@/app/api/cron/process-notifications/route");

    const response = await POST(
      new Request("http://localhost/api/cron/process-notifications", {
        method: "POST",
        headers: {
          authorization: "Bearer wrong",
        },
      }),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  it("processes due notifications with the correct cron secret", async () => {
    const { POST } = await import("@/app/api/cron/process-notifications/route");

    const response = await POST(
      new Request("http://localhost/api/cron/process-notifications", {
        method: "POST",
        headers: {
          authorization: "Bearer secret-token",
        },
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      processed: 2,
      sent: 1,
      failed: 0,
      skipped: 1,
    });
  });

  it("rejects unauthorized stat sync requests", async () => {
    const { GET } = await import("@/app/api/cron/sync-stats/route");

    const response = await GET(
      new Request("http://localhost/api/cron/sync-stats", {
        method: "GET",
        headers: {
          authorization: "Bearer wrong",
        },
      }),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "Unauthorized",
    });
  });

  it("syncs stats with the correct cron secret", async () => {
    const { GET } = await import("@/app/api/cron/sync-stats/route");

    const response = await GET(
      new Request("http://localhost/api/cron/sync-stats", {
        method: "GET",
        headers: {
          authorization: "Bearer secret-token",
        },
      }),
    );

    expect(syncStatsToDatabaseMock).toHaveBeenCalledOnce();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      message: "Stats synced successfully",
    });
  });
});
