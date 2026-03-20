import { beforeEach, describe, expect, it, vi } from "vitest";

const headersMock = vi.fn();
const getSessionMock = vi.fn();
const enforceRateLimitMock = vi.fn();
const revalidatePathMock = vi.fn();
const customerCarsFindFirstMock = vi.fn();
const serviceRecordsFindManyMock = vi.fn();
const appointmentsFindManyMock = vi.fn();
const insertReturningMock = vi.fn();
const insertValuesMock = vi.fn();
const insertMock = vi.fn();
const updateWhereMock = vi.fn();
const updateSetMock = vi.fn();
const updateMock = vi.fn();
const deleteWhereMock = vi.fn();
const deleteMock = vi.fn();

vi.mock("next/headers", () => ({
  headers: headersMock,
}));

vi.mock("next/cache", () => ({
  revalidatePath: revalidatePathMock,
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: getSessionMock,
    },
  },
}));

vi.mock("@/lib/rate-limit", async () => {
  const actual = await vi.importActual<typeof import("@/lib/rate-limit")>("@/lib/rate-limit");
  return {
    ...actual,
    enforceRateLimit: enforceRateLimitMock,
  };
});

vi.mock("@/lib/notifications/outbox", () => ({
  queueNotificationEvent: vi.fn(),
  processNotificationEvent: vi.fn(),
}));

vi.mock("@/lib/notifications/notification.service", () => ({
  notificationService: {
    buildServiceUpdateMessage: vi.fn(() => "service update"),
    buildMaintenanceReminderMessage: vi.fn(() => "reminder"),
  },
}));

vi.mock("@/db", () => ({
  db: {
    query: {
      customerCars: {
        findFirst: customerCarsFindFirstMock,
      },
      serviceRecords: {
        findMany: serviceRecordsFindManyMock,
      },
      appointments: {
        findMany: appointmentsFindManyMock,
      },
    },
    insert: insertMock,
    update: updateMock,
    delete: deleteMock,
    transaction: vi.fn(),
  },
}));

describe("maintenance actions", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    headersMock.mockResolvedValue(new Headers({ "x-forwarded-for": "127.0.0.1" }));
    getSessionMock.mockResolvedValue({ user: { id: "admin-1", role: "admin" } });

    insertReturningMock.mockResolvedValue([{ id: "car-1", plateNumber: "سما123" }]);
    insertValuesMock.mockReturnValue({
      returning: insertReturningMock,
    });
    insertMock.mockReturnValue({
      values: insertValuesMock,
    });

    updateWhereMock.mockResolvedValue(undefined);
    updateSetMock.mockReturnValue({
      where: updateWhereMock,
      returning: vi.fn().mockResolvedValue([{ id: "car-1", status: "active", userId: "user-1" }]),
    });
    updateMock.mockReturnValue({
      set: updateSetMock,
    });

    deleteWhereMock.mockResolvedValue(undefined);
    deleteMock.mockReturnValue({
      where: deleteWhereMock,
    });

    customerCarsFindFirstMock.mockResolvedValue(null);
    serviceRecordsFindManyMock.mockResolvedValue([]);
    appointmentsFindManyMock.mockResolvedValue([]);
  });

  it("rejects linking a car when no user session exists", async () => {
    const { linkCarByPlate } = await import("@/features/maintenance/actions");
    getSessionMock.mockResolvedValueOnce(null);

    const result = await linkCarByPlate("س م ا 123");

    expect(result).toEqual({ error: "يرجى تسجيل الدخول أولاً" });
  });

  it("returns a rate-limit message when linking a car is throttled", async () => {
    const { linkCarByPlate } = await import("@/features/maintenance/actions");
    const { RateLimitError } = await import("@/lib/rate-limit");

    getSessionMock.mockResolvedValueOnce({ user: { id: "user-1", role: "user" } });
    enforceRateLimitMock.mockRejectedValueOnce(
      new RateLimitError({
        allowed: false,
        limit: 8,
        remaining: 0,
        retryAfterSeconds: 30,
        resetAt: new Date(Date.now() + 30_000),
        message: "slow down",
      }),
    );

    const result = await linkCarByPlate("س م ا 123");

    expect(result).toEqual({ error: "slow down" });
  });

  it("returns a duplicate error when adding a car with an existing plate", async () => {
    const { addCustomerCarAction } = await import("@/features/maintenance/actions");

    customerCarsFindFirstMock.mockResolvedValueOnce({ id: "existing-car" });

    const result = await addCustomerCarAction({
      make: "toyota",
      model: "Corolla",
      year: 2024,
      plateNumber: "س م ا 123",
      color: "black",
    });

    expect(result).toEqual({ error: "هذه السيارة مسجلة بالفعل في النظام." });
  });

  it("prevents deleting a car that still has records or appointments", async () => {
    const { deleteCustomerCarAction } = await import("@/features/maintenance/actions");

    serviceRecordsFindManyMock.mockResolvedValueOnce([{ id: "record-1" }]);
    appointmentsFindManyMock.mockResolvedValueOnce([]);

    const result = await deleteCustomerCarAction("car-1");

    expect(result).toEqual({
      error: "لا يمكن مسح هذه السيارة نهائياً لوجود سجلات صيانة أو مواجهات حجز مرتبطة بها. يمكنك أرشفتها بدلاً من ذلك.",
    });
    expect(deleteWhereMock).not.toHaveBeenCalled();
  });

  it("archives a customer car for authorized admins", async () => {
    const { archiveCustomerCarAction } = await import("@/features/maintenance/actions");

    const result = await archiveCustomerCarAction("car-1");

    expect(updateSetMock).toHaveBeenCalledWith({ status: "archived" });
    expect(revalidatePathMock).toHaveBeenCalledWith("/admin/customer-cars");
    expect(result).toEqual({ success: true });
  });
});
