CREATE TABLE IF NOT EXISTS "rate_limit_buckets" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "action" text NOT NULL,
  "key" text NOT NULL,
  "count" integer DEFAULT 1 NOT NULL,
  "window_started_at" timestamp DEFAULT now() NOT NULL,
  "blocked_until" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "rate_limit_buckets_action_key_idx"
  ON "rate_limit_buckets" ("action", "key");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rate_limit_buckets_action_updated_at_idx"
  ON "rate_limit_buckets" ("action", "updated_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rate_limit_buckets_blocked_until_idx"
  ON "rate_limit_buckets" ("blocked_until");
