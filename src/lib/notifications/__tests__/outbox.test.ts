import { beforeEach, describe, expect, it, vi } from "vitest";

const insertValuesMock = vi.fn();
const insertReturningMock = vi.fn();
const findFirstMock = vi.fn();
const findManyMock = vi.fn();
const updateWhereMock = vi.fn();
const updateSetMock = vi.fn();
const insertMock = vi.fn();
const updateMock = vi.fn();
const sendWhatsAppMock = vi.fn();
const shouldAttemptDeliveryMock = vi.fn();
const getProviderNameMock = vi.fn();

const siteSettingsFindFirstMock = vi.fn();

vi.mock("@/db", () => ({
  db: {
    insert: insertMock,
    update: updateMock,
    query: {
      notificationEvents: {
        findFirst: findFirstMock,
        findMany: findManyMock,
      },
      siteSettings: {
        findFirst: siteSettingsFindFirstMock,
      },
    },
  },
}));


vi.mock("@/lib/notifications/notification.service", () => ({
  notificationService: {
    sendWhatsApp: sendWhatsAppMock,
    shouldAttemptDelivery: shouldAttemptDeliveryMock,
    getProviderName: getProviderNameMock,
  },
}));

describe("notification outbox", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.clearAllMocks();

    insertReturningMock.mockResolvedValue([{ id: "event-1" }]);
    insertValuesMock.mockReturnValue({
      returning: insertReturningMock,
    });
    insertMock.mockReturnValue({
      values: insertValuesMock,
    });

    updateWhereMock.mockResolvedValue(undefined);
    updateSetMock.mockReturnValue({
      where: updateWhereMock,
    });
    updateMock.mockReturnValue({
      set: updateSetMock,
    });

    getProviderNameMock.mockReturnValue("mock");
    shouldAttemptDeliveryMock.mockReturnValue(true);
    sendWhatsAppMock.mockResolvedValue({ success: true });
    siteSettingsFindFirstMock.mockResolvedValue({ value: "true" });
  });

  it("queues notification events with default payload and provider", async () => {
    const { queueNotificationEvent } = await import("@/lib/notifications/outbox");

    const result = await queueNotificationEvent({
      type: "appointment_request_received",
      phone: "01001234567",
      message: "hello",
    });

    expect(insertValuesMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "appointment_request_received",
        phone: "01001234567",
        message: "hello",
        payload: {},
        provider: "mock",
      }),
    );
    expect(result).toEqual({ id: "event-1" });
  });

  it("marks pending events as skipped when delivery is disabled", async () => {
    const { processNotificationEvent } = await import("@/lib/notifications/outbox");

    findFirstMock.mockResolvedValueOnce({
      id: "event-1",
      status: "pending",
      phone: "01001234567",
      message: "hello",
    });
    shouldAttemptDeliveryMock.mockReturnValueOnce(false);

    const result = await processNotificationEvent("event-1");

    expect(updateSetMock).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "skipped",
        provider: "mock",
      }),
    );
    expect(result).toEqual({ success: true, skipped: true });
  });

  it("marks failed deliveries as failed", async () => {
    const { processNotificationEvent } = await import("@/lib/notifications/outbox");

    findFirstMock.mockResolvedValueOnce({
      id: "event-1",
      status: "pending",
      phone: "01001234567",
      message: "hello",
    });
    sendWhatsAppMock.mockResolvedValueOnce({
      success: false,
      error: "provider failed",
    });

    const result = await processNotificationEvent("event-1");

    expect(updateSetMock).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "failed",
        error: "provider failed",
      }),
    );
    expect(result).toEqual({ success: false, error: "provider failed" });
  });

  it("processes due notification events and returns counts", async () => {
    const { processDueNotificationEvents } = await import("@/lib/notifications/outbox");

    findManyMock.mockResolvedValueOnce([
      { id: "event-1" },
      { id: "event-2" },
      { id: "event-3" },
    ]);

    findFirstMock
      .mockResolvedValueOnce({
        id: "event-1",
        status: "pending",
        phone: "1",
        message: "one",
      })
      .mockResolvedValueOnce({
        id: "event-2",
        status: "pending",
        phone: "2",
        message: "two",
      })
      .mockResolvedValueOnce({
        id: "event-3",
        status: "pending",
        phone: "3",
        message: "three",
      });

    shouldAttemptDeliveryMock
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true);

    sendWhatsAppMock
      .mockResolvedValueOnce({ success: true })
      .mockResolvedValueOnce({ success: false, error: "nope" });

    const result = await processDueNotificationEvents(3);

    expect(findManyMock).toHaveBeenCalledOnce();
    expect(result).toEqual({
      processed: 3,
      sent: 1,
      failed: 1,
      skipped: 1,
    });
  });
});
