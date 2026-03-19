import { beforeEach, describe, expect, it, vi } from "vitest";

const requireAdminMock = vi.fn();
const headersMock = vi.fn();
const enforceRateLimitMock = vi.fn();
const createAdviceMock = vi.fn();
const updateAdviceMock = vi.fn();
const deleteAdviceMock = vi.fn();
const siteSettingSetMock = vi.fn();

vi.mock("next/headers", () => ({
  headers: headersMock,
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/server-auth", async () => {
  const actual = await vi.importActual<typeof import("@/lib/server-auth")>("@/lib/server-auth");
  return {
    ...actual,
    requireAdmin: requireAdminMock,
  };
});

vi.mock("@/lib/rate-limit", async () => {
  const actual = await vi.importActual<typeof import("@/lib/rate-limit")>("@/lib/rate-limit");
  return {
    ...actual,
    enforceRateLimit: enforceRateLimitMock,
  };
});

vi.mock("@/db/queries/advices", () => ({
  adviceQueries: {
    create: createAdviceMock,
    update: updateAdviceMock,
    delete: deleteAdviceMock,
    findActive: vi.fn(),
  },
}));

vi.mock("@/db/queries/site-settings", () => ({
  siteSettingQueries: {
    set: siteSettingSetMock,
    get: vi.fn(),
  },
}));

describe("admin server action guards", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.clearAllMocks();
    headersMock.mockResolvedValue(new Headers({ "x-forwarded-for": "127.0.0.1" }));
    requireAdminMock.mockResolvedValue({ user: { id: "admin-1" } });
    enforceRateLimitMock.mockResolvedValue({
      allowed: true,
      limit: 180,
      remaining: 179,
      retryAfterSeconds: 0,
      resetAt: new Date(),
      message: "",
    });
    createAdviceMock.mockResolvedValue(undefined);
    updateAdviceMock.mockResolvedValue({ id: "adv-1", isActive: true });
    deleteAdviceMock.mockResolvedValue(undefined);
    siteSettingSetMock.mockResolvedValue(undefined);
  });

  it("returns unauthorized when createAdvice is called without admin access", async () => {
    const { AuthorizationError } = await import("@/lib/server-auth");
    const { createAdvice } = await import("@/app/admin/advices/actions");

    requireAdminMock.mockRejectedValueOnce(new AuthorizationError());

    const result = await createAdvice("tip");

    expect(result).toEqual({ error: "Unauthorized" });
    expect(enforceRateLimitMock).not.toHaveBeenCalled();
  });

  it("returns the limiter message when createAdvice is rate limited", async () => {
    const { createAdvice } = await import("@/app/admin/advices/actions");
    const { RateLimitError } = await import("@/lib/rate-limit");

    enforceRateLimitMock.mockRejectedValueOnce(
      new RateLimitError({
        allowed: false,
        limit: 180,
        remaining: 0,
        retryAfterSeconds: 30,
        resetAt: new Date(Date.now() + 30_000),
        message: "wait a bit",
      }),
    );

    const result = await createAdvice("tip");

    expect(result).toEqual({ error: "wait a bit" });
  });

  it("returns not found when updating a missing advice", async () => {
    const { updateAdviceState } = await import("@/app/admin/advices/actions");

    updateAdviceMock.mockResolvedValueOnce(null);

    const result = await updateAdviceState("missing", true);

    expect(result).toEqual({ error: "النصيحة غير موجودة" });
  });

  it("returns unauthorized when updateHeroImage is called without admin access", async () => {
    const { AuthorizationError } = await import("@/lib/server-auth");
    const { updateHeroImage } = await import("@/app/admin/hero-image/actions");

    requireAdminMock.mockRejectedValueOnce(new AuthorizationError());

    const result = await updateHeroImage("https://cdn.example.com/image.webp");

    expect(result).toEqual({ error: "Unauthorized" });
    expect(siteSettingSetMock).not.toHaveBeenCalled();
  });

  it("saves the hero image when authorized and not rate limited", async () => {
    const { updateHeroImage } = await import("@/app/admin/hero-image/actions");

    const result = await updateHeroImage("https://cdn.example.com/image.webp");

    expect(siteSettingSetMock).toHaveBeenCalledWith(
      "hero_image_url",
      "https://cdn.example.com/image.webp",
    );
    expect(result).toEqual({ success: true });
  });
});
