import { sql } from "drizzle-orm";
import { db } from "@/db";

type HeaderAccessor = Pick<Headers, "get">;

export type RateLimitPolicy = {
  action: string;
  limit: number;
  windowMs: number;
  blockDurationMs?: number;
  message: string;
};

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
  resetAt: Date;
  message: string;
};

export class RateLimitError extends Error {
  readonly result: RateLimitResult;

  constructor(result: RateLimitResult) {
    super(result.message);
    this.name = "RateLimitError";
    this.result = result;
  }
}

export const rateLimitPolicies = {
  publicBooking: {
    action: "public_booking",
    limit: 5,
    windowMs: 15 * 60 * 1000,
    message: "تم الوصول إلى الحد الأقصى لمحاولات الحجز. يرجى الانتظار قليلًا ثم المحاولة مرة أخرى.",
  },
  onboarding: {
    action: "user_onboarding",
    limit: 5,
    windowMs: 30 * 60 * 1000,
    message: "تم تجاوز عدد محاولات التسجيل المسموح بها مؤقتًا. حاول مرة أخرى لاحقًا.",
  },
  carLinking: {
    action: "garage_link_car",
    limit: 8,
    windowMs: 15 * 60 * 1000,
    message: "تم تجاوز عدد محاولات ربط السيارة مؤقتًا. حاول مرة أخرى بعد قليل.",
  },
  adminWrite: {
    action: "admin_write",
    limit: 180,
    windowMs: 15 * 60 * 1000,
    message: "عدد عمليات الإدارة كبير جدًا حاليًا. يرجى الانتظار قليلًا ثم المحاولة مرة أخرى.",
  },
  adminUploadSign: {
    action: "admin_upload_sign",
    limit: 40,
    windowMs: 10 * 60 * 1000,
    message: "تم تجاوز عدد طلبات رفع الملفات مؤقتًا. يرجى الانتظار ثم إعادة المحاولة.",
  },
  adminUploadDelete: {
    action: "admin_upload_delete",
    limit: 80,
    windowMs: 10 * 60 * 1000,
    message: "تم تجاوز عدد طلبات حذف الملفات مؤقتًا. يرجى الانتظار ثم إعادة المحاولة.",
  },
} satisfies Record<string, RateLimitPolicy>;

function getClientIp(headers: HeaderAccessor) {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const realIp = headers.get("x-real-ip") ?? headers.get("cf-connecting-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}

function getRateLimitKey(headers: HeaderAccessor, userId?: string | null) {
  if (userId) {
    return `user:${userId}`;
  }

  return `ip:${getClientIp(headers)}`;
}

function toSeconds(ms: number) {
  return Math.max(1, Math.ceil(ms / 1000));
}

export async function checkRateLimit(
  policy: RateLimitPolicy,
  options: {
    headers: HeaderAccessor;
    userId?: string | null;
  },
): Promise<RateLimitResult> {
  const now = new Date();
  const key = getRateLimitKey(options.headers, options.userId);
  const blockDurationMs = policy.blockDurationMs ?? policy.windowMs;
  const windowSeconds = toSeconds(policy.windowMs);
  const blockSeconds = toSeconds(blockDurationMs);
  const windowInterval = sql.raw(`interval '${windowSeconds} seconds'`);
  const blockInterval = sql.raw(`interval '${blockSeconds} seconds'`);

  const result = await db.execute(sql`
    INSERT INTO rate_limit_buckets (
      action,
      key,
      count,
      window_started_at,
      blocked_until,
      created_at,
      updated_at
    )
    VALUES (
      ${policy.action},
      ${key},
      1,
      ${now},
      NULL,
      ${now},
      ${now}
    )
    ON CONFLICT (action, key)
    DO UPDATE
    SET
      count = CASE
        WHEN rate_limit_buckets.blocked_until IS NOT NULL
          AND rate_limit_buckets.blocked_until > ${now}
          THEN rate_limit_buckets.count
        WHEN rate_limit_buckets.window_started_at + ${windowInterval} <= ${now}
          THEN 1
        ELSE rate_limit_buckets.count + 1
      END,
      window_started_at = CASE
        WHEN rate_limit_buckets.blocked_until IS NOT NULL
          AND rate_limit_buckets.blocked_until > ${now}
          THEN rate_limit_buckets.window_started_at
        WHEN rate_limit_buckets.window_started_at + ${windowInterval} <= ${now}
          THEN ${now}
        ELSE rate_limit_buckets.window_started_at
      END,
      blocked_until = CASE
        WHEN rate_limit_buckets.blocked_until IS NOT NULL
          AND rate_limit_buckets.blocked_until > ${now}
          THEN rate_limit_buckets.blocked_until
        WHEN rate_limit_buckets.window_started_at + ${windowInterval} <= ${now}
          THEN NULL
        WHEN rate_limit_buckets.count + 1 > ${policy.limit}
          THEN ${now} + ${blockInterval}
        ELSE NULL
      END,
      updated_at = ${now}
    RETURNING count, window_started_at, blocked_until
  `);

  const row = result.rows[0] as {
    count: number | string;
    window_started_at: Date | string;
    blocked_until: Date | string | null;
  };

  const count = Number(row.count);
  const windowStartedAt = new Date(row.window_started_at);
  const blockedUntil = row.blocked_until ? new Date(row.blocked_until) : null;
  const resetAt = blockedUntil ?? new Date(windowStartedAt.getTime() + policy.windowMs);
  const retryAfterMs = Math.max(0, resetAt.getTime() - now.getTime());
  const allowed = !blockedUntil || blockedUntil.getTime() <= now.getTime();
  const remaining = allowed ? Math.max(0, policy.limit - count) : 0;

  return {
    allowed,
    limit: policy.limit,
    remaining,
    retryAfterSeconds: retryAfterMs > 0 ? toSeconds(retryAfterMs) : 0,
    resetAt,
    message: policy.message,
  };
}

export async function enforceRateLimit(
  policy: RateLimitPolicy,
  options: {
    headers: HeaderAccessor;
    userId?: string | null;
  },
) {
  const result = await checkRateLimit(policy, options);

  if (!result.allowed) {
    throw new RateLimitError(result);
  }

  return result;
}
