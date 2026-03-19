import { beforeEach, describe, expect, it, vi } from "vitest";

const headersMock = vi.fn();
const getSessionMock = vi.fn();
const revalidatePathMock = vi.fn();
const findPaginatedMock = vi.fn();
const deleteAppointmentMock = vi.fn();
const enforceRateLimitMock = vi.fn();
const queueNotificationEventMock = vi.fn();
const processNotificationEventMock = vi.fn();
const buildAppointmentRequestReceivedMessageMock = vi.fn(() => "message");
const transactionMock = vi.fn();

class MockRateLimitError extends Error {
  result: {
    allowed: boolean;
    limit: number;
    remaining: number;
    retryAfterSeconds: number;
    resetAt: Date;
    message: string;
  };

  constructor(result: {
    allowed: boolean;
    limit: number;
    remaining: number;
    retryAfterSeconds: number;
    resetAt: Date;
    message: string;
  }) {
    super(result.message);
    this.name = "RateLimitError";
    this.result = result;
  }
}

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

vi.mock("@/db", () => ({
  db: {
    transaction: transactionMock,
  },
}));

vi.mock("@/db/queries/appointments", () => ({
  appointmentQueries: {
    findPaginated: findPaginatedMock,
    delete: deleteAppointmentMock,
  },
}));

vi.mock("@/lib/rate-limit", () => {
  return {
    enforceRateLimit: enforceRateLimitMock,
    RateLimitError: MockRateLimitError,
    rateLimitPolicies: {
      publicBooking: { action: "public_booking" },
      adminWrite: { action: "admin_write" },
    },
  };
});

vi.mock("@/lib/notifications/outbox", () => ({
  queueNotificationEvent: queueNotificationEventMock,
  processNotificationEvent: processNotificationEventMock,
}));

vi.mock("@/lib/notifications/notification.service", () => ({
  notificationService: {
    buildAppointmentRequestReceivedMessage: buildAppointmentRequestReceivedMessageMock,
    buildAppointmentStatusMessage: vi.fn(() => "status message"),
  },
}));

describe("appointment actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    headersMock.mockResolvedValue(new Headers({ "x-forwarded-for": "127.0.0.1" }));
    getSessionMock.mockResolvedValue(null);
    enforceRateLimitMock.mockResolvedValue({
      allowed: true,
      limit: 5,
      remaining: 4,
      retryAfterSeconds: 0,
      resetAt: new Date(),
      message: "",
    });
    findPaginatedMock.mockResolvedValue({
      data: [{ id: "apt-1" }],
      meta: { total: 1, totalPages: 1, page: 1, limit: 12 },
    });
    deleteAppointmentMock.mockResolvedValue(undefined);
    queueNotificationEventMock.mockResolvedValue({ id: "event-1" });
    processNotificationEventMock.mockResolvedValue(undefined);
    transactionMock.mockReset();
  });

  it("returns a guest-name error when unauthenticated booking omits guest name", async () => {
    const { createAppointment } = await import("@/server/actions/appointments");

    const result = await createAppointment({
      guestPhone: "01001234567",
      guestEmail: "",
      serviceType: "inspection",
      vehicleType: "sedan",
      date: "2099-03-20T10:00:00.000Z",
      notes: "",
      plateNumber: "س م ا 123",
      make: "toyota",
    });

    expect(result).toEqual({
      success: false,
      error: "Name is required for guest bookings",
    });
    expect(enforceRateLimitMock).toHaveBeenCalledOnce();
  });

  it("surfaces rate-limit failures during booking creation", async () => {
    const { createAppointment } = await import("@/server/actions/appointments");
    enforceRateLimitMock.mockRejectedValueOnce(
      new MockRateLimitError({
        allowed: false,
        limit: 5,
        remaining: 0,
        retryAfterSeconds: 60,
        resetAt: new Date(Date.now() + 60_000),
        message: "too many requests",
      }),
    );

    const result = await createAppointment({
      guestName: "Ahmed",
      guestPhone: "01001234567",
      guestEmail: "",
      serviceType: "inspection",
      vehicleType: "sedan",
      date: "2099-03-20T10:00:00.000Z",
      notes: "",
      plateNumber: "س م ا 123",
      make: "toyota",
    });

    expect(result).toEqual({
      success: false,
      error: "too many requests",
    });
  });

  it("returns paginated appointments for admins", async () => {
    const { getAppointments } = await import("@/server/actions/appointments");

    getSessionMock.mockResolvedValueOnce({
      user: { id: "admin-1", role: "admin" },
    });

    const result = await getAppointments(2, 20);

    expect(findPaginatedMock).toHaveBeenCalledWith(2, 20);
    expect(result).toEqual({
      success: true,
      data: [{ id: "apt-1" }],
      meta: { total: 1, totalPages: 1, page: 1, limit: 12 },
    });
  });

  it("rejects duplicate active bookings for the same car on the same day", async () => {
    const { createAppointment } = await import("@/server/actions/appointments");

    transactionMock.mockImplementationOnce(async (callback) => callback({
      query: {
        customerCars: {
          findFirst: vi.fn().mockResolvedValue({
            id: "car-1",
            status: "active",
            userId: null,
            plateNumber: "سما123",
          }),
        },
        appointments: {
          findFirst: vi.fn().mockResolvedValue({
            id: "apt-existing",
            status: "pending",
          }),
        },
      },
      update: vi.fn(() => ({
        set: vi.fn(() => ({
          where: vi.fn(),
          returning: vi.fn(),
        })),
      })),
      insert: vi.fn(() => ({
        values: vi.fn(() => ({
          returning: vi.fn(),
        })),
      })),
    }));

    const result = await createAppointment({
      guestName: "Ahmed",
      guestPhone: "01001234567",
      guestEmail: "",
      serviceType: "inspection",
      vehicleType: "sedan",
      date: "2099-03-20T10:00:00.000Z",
      notes: "",
      plateNumber: "س م ا 123",
      make: "toyota",
    });

    expect(result).toEqual({
      success: false,
      error: "يوجد بالفعل حجز مسجل لهذه السيارة في هذا اليوم.",
    });
    expect(queueNotificationEventMock).not.toHaveBeenCalled();
  });

  it("rejects non-admin appointment status updates", async () => {
    const { updateAppointmentStatus } = await import("@/server/actions/appointments");

    getSessionMock.mockResolvedValueOnce({
      user: { id: "user-1", role: "user" },
    });

    const result = await updateAppointmentStatus("apt-1", "confirmed");

    expect(result).toEqual({
      success: false,
      error: "Unauthorized",
    });
    expect(enforceRateLimitMock).not.toHaveBeenCalled();
  });
});
