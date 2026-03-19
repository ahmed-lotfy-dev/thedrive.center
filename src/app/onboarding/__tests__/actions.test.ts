import { beforeEach, describe, expect, it, vi } from "vitest";

const headersMock = vi.fn();
const getSessionMock = vi.fn();
const enforceRateLimitMock = vi.fn();
const redirectMock = vi.fn();
const customerCarsFindFirstMock = vi.fn();
const insertValuesMock = vi.fn();
const insertMock = vi.fn(() => ({
  values: insertValuesMock,
}));
const updateWhereMock = vi.fn();
const updateSetMock = vi.fn(() => ({
  where: updateWhereMock,
}));
const updateMock = vi.fn(() => ({
  set: updateSetMock,
}));

vi.mock("next/headers", () => ({
  headers: headersMock,
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
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

vi.mock("@/db", () => ({
  db: {
    query: {
      customerCars: {
        findFirst: customerCarsFindFirstMock,
      },
    },
    insert: insertMock,
    update: updateMock,
  },
}));

describe("submitOnboarding", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.clearAllMocks();
    headersMock.mockResolvedValue(new Headers({ "x-forwarded-for": "127.0.0.1" }));
    getSessionMock.mockResolvedValue({
      user: { id: "user-1" },
    });
    enforceRateLimitMock.mockResolvedValue({
      allowed: true,
      limit: 5,
      remaining: 4,
      retryAfterSeconds: 0,
      resetAt: new Date(),
      message: "",
    });
    customerCarsFindFirstMock.mockResolvedValue(null);
    insertValuesMock.mockResolvedValue(undefined);
    updateWhereMock.mockResolvedValue(undefined);
    redirectMock.mockImplementation(() => {
      throw new Error("redirect");
    });
  });

  it("rejects unauthenticated onboarding", async () => {
    const { submitOnboarding } = await import("@/app/onboarding/actions");
    getSessionMock.mockResolvedValueOnce(null);

    const formData = new FormData();
    formData.set("make", "toyota");
    formData.set("model", "Corolla");
    formData.set("year", "2024");
    formData.set("color", "");
    formData.set("plateNumber", "س م ا 123");
    formData.set("phone", "01001234567");

    const result = await submitOnboarding(null, formData);

    expect(result).toEqual({
      error: "غير مصرح لك بالوصول. يرجى تسجيل الدخول أولاً.",
    });
  });

  it("surfaces onboarding rate-limit errors", async () => {
    const { submitOnboarding } = await import("@/app/onboarding/actions");
    const { RateLimitError } = await import("@/lib/rate-limit");

    enforceRateLimitMock.mockRejectedValueOnce(
      new RateLimitError({
        allowed: false,
        limit: 5,
        remaining: 0,
        retryAfterSeconds: 60,
        resetAt: new Date(Date.now() + 60_000),
        message: "try later",
      }),
    );

    const formData = new FormData();
    formData.set("make", "toyota");
    formData.set("model", "Corolla");
    formData.set("year", "2024");
    formData.set("color", "");
    formData.set("plateNumber", "س م ا 123");
    formData.set("phone", "01001234567");

    const result = await submitOnboarding(null, formData);

    expect(result).toEqual({ error: "try later" });
  });

  it("rejects onboarding when the plate belongs to another user", async () => {
    const { submitOnboarding } = await import("@/app/onboarding/actions");

    customerCarsFindFirstMock.mockResolvedValueOnce({
      id: "car-1",
      userId: "other-user",
    });

    const formData = new FormData();
    formData.set("make", "toyota");
    formData.set("model", "Corolla");
    formData.set("year", "2024");
    formData.set("color", "");
    formData.set("plateNumber", "س م ا 123");
    formData.set("phone", "01001234567");

    const result = await submitOnboarding(null, formData);

    expect(result).toEqual({
      error: "رقم اللوحة هذا مسجل لمستخدم آخر. يرجى التواصل مع الإدارة.",
    });
    expect(insertMock).not.toHaveBeenCalled();
  });
});
