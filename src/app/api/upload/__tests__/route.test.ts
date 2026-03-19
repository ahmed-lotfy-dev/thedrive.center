import { beforeEach, describe, expect, it, vi } from "vitest";

const headersMock = vi.fn();
const getSessionMock = vi.fn();
const checkRateLimitMock = vi.fn();
const getSignedUrlMock = vi.fn();
const sendMock = vi.fn();

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

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: checkRateLimitMock,
  rateLimitPolicies: {
    adminUploadSign: { action: "admin_upload_sign" },
    adminUploadDelete: { action: "admin_upload_delete" },
  },
}));

vi.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: getSignedUrlMock,
}));

vi.mock("@/lib/r2", () => ({
  r2: {
    send: sendMock,
  },
}));

describe("upload route", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.clearAllMocks();
    headersMock.mockResolvedValue(new Headers({ "x-forwarded-for": "127.0.0.1" }));
    getSessionMock.mockResolvedValue({ user: { id: "admin-1", role: "admin" } });
    checkRateLimitMock.mockResolvedValue({
      allowed: true,
      message: "",
      retryAfterSeconds: 0,
    });
    getSignedUrlMock.mockResolvedValue("https://signed.example/upload");
    sendMock.mockResolvedValue({});
    process.env.R2_BUCKET_NAME = "bucket";
    process.env.NEXT_PUBLIC_R2_PUBLIC_URL = "https://cdn.example.com";
  });

  it("rejects unauthenticated upload-url generation", async () => {
    const { POST } = await import("@/app/api/upload/route");
    getSessionMock.mockResolvedValueOnce(null);

    const response = await POST(
      new Request("http://localhost/api/upload", {
        method: "POST",
        body: JSON.stringify({
          filename: "car.webp",
          contentType: "image/webp",
          size: 1000,
        }),
      }),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  it("returns 429 when upload signing is rate limited", async () => {
    const { POST } = await import("@/app/api/upload/route");
    checkRateLimitMock.mockResolvedValueOnce({
      allowed: false,
      message: "slow down",
      retryAfterSeconds: 120,
    });

    const response = await POST(
      new Request("http://localhost/api/upload", {
        method: "POST",
        body: JSON.stringify({
          filename: "car.webp",
          contentType: "image/webp",
          size: 1000,
        }),
      }),
    );

    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("120");
    await expect(response.json()).resolves.toEqual({ error: "slow down" });
  });

  it("returns a signed upload URL for valid admin uploads", async () => {
    const { POST } = await import("@/app/api/upload/route");

    const response = await POST(
      new Request("http://localhost/api/upload", {
        method: "POST",
        body: JSON.stringify({
          filename: "car.webp",
          contentType: "image/webp",
          size: 1000,
        }),
      }),
    );

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.uploadUrl).toBe("https://signed.example/upload");
    expect(payload.publicUrl).toContain("https://cdn.example.com/");
    expect(checkRateLimitMock).toHaveBeenCalledOnce();
  });
});
