# Production Release Checklist

Date: 2026-03-19

## Local Gates

These should pass before deployment:

1. `~/.bun/bin/bun run test`
2. `~/.bun/bin/bun run lint`
3. `~/.bun/bin/bun run build`

Current status in this workspace:

- tests: passing
- lint: passing
- build: passing after fixing the admin appointments type-narrowing issue

## Database Migrations

Apply all migrations in order:

1. `0000_friendly_riptide.sql`
2. `0001_rename_machine_type_to_vehicle_type.sql`
3. `0002_add_notification_events.sql`
4. `0003_add_core_indexes.sql`
5. `0004_add_rate_limit_buckets.sql`
6. `0005_add_enum_check_constraints.sql`

Important notes:

- `0004` is required for the new DB-backed rate limiter
- `0005` adds `CHECK ... NOT VALID` constraints, so new writes are enforced without failing on older rows
- after deployment, older production rows should still be audited before validating those constraints fully

## Environment Variables

### Required

- `DATABASE_URL`
- `BETTER_AUTH_URL`
- `BETTER_AUTH_SECRET`
- `CRON_SECRET`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `NEXT_PUBLIC_R2_PUBLIC_URL`
- `ADMIN_EMAIL`

### Required only if the feature is enabled

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
  Required if Google sign-in is enabled

- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_NOTIFICATIONS_ENABLED`
  Required if production WhatsApp delivery is enabled

- `GOOGLE_MAPS_API_KEY`
  Required only if any live Google Maps API request path depends on it in production

### Public site config expected by the app

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_GOOGLE_BUSINESS_NAME`
- `NEXT_PUBLIC_GOOGLE_MAPS_COORDS`
- `NEXT_PUBLIC_GOOGLE_PLACE_ID`
- `NEXT_PUBLIC_GOOGLE_PLACE_URL`
- `NEXT_PUBLIC_BUSINESS_ADDRESS`
- `NEXT_PUBLIC_BUSINESS_CITY`
- `NEXT_PUBLIC_BUSINESS_REGION`
- `NEXT_PUBLIC_FACEBOOK_URL`
- `NEXT_PUBLIC_TIKTOK_URL`

### Optional flags

- `NEXT_PUBLIC_COMING_SOON_MODE`
- `NEXT_PUBLIC_COMING_SOON_LAUNCH`
- `NEXT_PUBLIC_SITE_MAINTENANCE_MODE`
- `NEXT_PUBLIC_MAINTENANCE_MODE`
- `NEXT_PUBLIC_MAINTENANCE_LAUNCH`
- `NEXT_PUBLIC_INSTAGRAM_URL`

## Gaps Found In The Current `.env`

These names are referenced in code but are not currently present in the checked local `.env`:

- `NEXT_PUBLIC_INSTAGRAM_URL`
- `NEXT_PUBLIC_MAINTENANCE_MODE`
- `NEXT_PUBLIC_MAINTENANCE_LAUNCH`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_NOTIFICATIONS_ENABLED`
- `GOOGLE_MAPS_API_KEY`

These may be fine if the related features are intentionally disabled, but they should be decided explicitly before production.

Also noted:

- `NEXT_PUBLIC_FACEBOOK_URL` appears twice
- `NEXT_PUBLIC_TIKTOK_URL` appears twice

That duplication should be cleaned up to avoid confusion.

## Post-Deploy Smoke Checks

Structured logs are now present for the main booking, upload, notification, cron, and admin-mutation paths. During these checks, verify not only UI behavior but also that the expected log events appear in the host logs.

### Public flows

1. Open `/`
2. Open `/cars`
3. Open `/book`
4. Create a booking with valid data
5. Confirm the booking is stored and visible in admin

### Admin flows

1. Sign in as admin
2. Open `/admin/appointments`
3. Change appointment status
4. Open `/admin/customer-cars`
5. Add a car
6. Add a service record
7. Archive or unlink a car
8. Open `/admin/showcase`
9. Create or edit a showcase entry
10. Open `/admin/hero-image`
11. Upload and save a hero image
12. Open `/admin/advices`
13. Create, toggle, and delete an advice

### Upload verification

1. Upload a valid image
2. Confirm the file is reachable via the public R2 URL
3. Delete the uploaded file from admin
4. Confirm the object is actually removed

### Cron / notification verification

1. Trigger `/api/cron/process-notifications` with the real `CRON_SECRET`
2. Trigger `/api/cron/sync-stats` with the real `CRON_SECRET`
3. Confirm unauthorized access is rejected without the header
4. Confirm notification events move through the expected states

## Release Decision Rule

Call the app production-ready only after all of the following are true:

1. local test, lint, and build gates pass
2. all migrations are applied on the target database
3. required env vars are present in the deployment environment
4. upload flows work against real R2
5. cron endpoints work with the real secret
6. the smoke checks above pass on the deployed app

## Remaining Follow-Up After Release

These are still worth doing after the release gate:

1. audit existing production rows and validate the new DB constraints
2. add structured logging / monitoring around bookings, uploads, and notifications
3. expand test coverage to more integration-style flows
4. add stronger booking business rules if the client wants stricter scheduling behavior
