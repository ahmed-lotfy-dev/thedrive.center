# The Drive Center Application Audit

Date: 2026-03-19

## Executive Summary

The application is a solid MVP for a service-center website with booking, portfolio, admin management, onboarding, and customer car tracking. The overall stack is coherent: Next.js App Router, Better Auth, Drizzle ORM, PostgreSQL, Cloudflare R2, and a feature-based folder structure. The UI work is strong, and the project already covers the main business flows needed for an early client launch.

The main release risk is not design. It is authorization and operational hardening. Several admin-facing server actions do not verify the current user at the action layer, even though the pages are protected in the UI. That is a real security issue because server actions should not rely on page visibility alone. There is also an unauthenticated cron endpoint, weak schema constraints for business-critical fields such as appointment status, and no transaction boundaries around multi-step writes.

The application can become client-ready, but not in its current form. The highest-priority work is to harden admin actions, protect background endpoints, strengthen business validations, and improve build/lint reliability.

## Audit Scope

This review covered:

- App structure and route layout
- Authentication and authorization flow
- Database schema and query layer
- Booking, onboarding, garage, and admin flows
- Upload and cron API endpoints
- Notification architecture
- Security posture
- Tooling readiness: tests, lint, build

## Current Feature Inventory

### Public Site

- Landing page with hero, services, process, FAQ, CTA, and location
- Portfolio/gallery of completed work
- Dynamic “tip of the day” popup
- Maintenance-mode landing page with countdown and social links
- SEO metadata, robots, and sitemap generation

### Authentication and User Area

- Google and credentials-based sign-in
- Onboarding flow for first-time users
- User garage dashboard
- Customer-car linkage by license plate
- Service history display for linked cars

### Booking

- Public appointment form
- Guest and signed-in booking flows
- Plate normalization
- Admin appointment listing and status changes

### Admin

- Admin dashboard shell
- Portfolio management
- Hero image management
- Advice/tip management
- Appointment management
- Customer car management
- Car detail view with service history

### Infrastructure

- Better Auth + Drizzle adapter
- PostgreSQL via `pg`
- Cloudflare R2 signed uploads
- Google Business stat sync
- WhatsApp notification abstraction with mock and official provider

## Architecture Summary

### Stack

- Framework: Next.js 16 App Router
- Language: TypeScript
- Auth: Better Auth
- ORM: Drizzle
- Database: PostgreSQL
- File/media storage: Cloudflare R2
- Styling/UI: Tailwind + Radix + custom components
- Test runner: Vitest

### Structure

The project uses a reasonable split:

- `src/app`: route entry points, metadata, API routes
- `src/features`: feature-specific UI and actions
- `src/db`: schema and query layer
- `src/lib`: auth, integrations, utilities, notifications
- `src/components`: shared UI and layout primitives

This structure is maintainable for an MVP. The biggest architectural weakness is not folder layout. It is uneven trust boundaries: some flows enforce auth at the route level, while other flows enforce it only in some actions and not others.

## High-Priority Findings

### Critical Findings

#### C-01: Several admin server actions are missing server-side authorization checks

Status: Fixed on 2026-03-19.

Impact: an attacker who can trigger the action endpoint directly could mutate admin-managed data without passing through the protected admin UI.

Affected files:

- `src/app/admin/advices/actions.ts:6`
- `src/app/admin/advices/actions.ts:18`
- `src/app/admin/advices/actions.ts:30`
- `src/app/admin/hero-image/actions.ts:6`
- `src/app/admin/portfolio/actions.ts:21`
- `src/app/admin/portfolio/actions.ts:79`
- `src/app/admin/portfolio/actions.ts:91`
- `src/app/admin/cars/actions.ts:9`

Details:

- These functions are marked `"use server"` and perform writes.
- They do not call `auth.api.getSession(...)`.
- They do not verify `admin` or `owner` roles.
- Route-level protection in `src/app/admin/layout.tsx:12` is not enough for server actions. The action itself must verify authorization.

Recommendation:

- Create one shared `requireAdmin()` helper in a server-only module.
- Call it in every admin write action.
- Return or throw on unauthorized access before any database mutation.

Resolution:

- Added a shared admin guard in `src/lib/server-auth.ts`
- Wired the guard into:
  - `src/app/admin/advices/actions.ts`
  - `src/app/admin/hero-image/actions.ts`
  - `src/app/admin/portfolio/actions.ts`
  - `src/app/admin/cars/actions.ts`
- The remaining follow-up is consistency work for admin pages and role checks, which is covered separately in `H-01`

#### C-02: The cron sync endpoint is publicly callable

Status: Fixed on 2026-03-19.

Impact: anyone can trigger external API usage and database writes, which can cause abuse, rate-limit consumption, noisy logs, and unintended operational load.

Affected file:

- `src/app/api/cron/sync-stats/route.ts:10`

Details:

- The route comment already acknowledges a missing secret check.
- The secret check is commented out at `src/app/api/cron/sync-stats/route.ts:11-15`.

Recommendation:

- Require a `CRON_SECRET` bearer token.
- Reject requests without that token.
- Consider limiting the HTTP method or moving the sync behind a server-only scheduler if deployment allows it.

Resolution:

- Added bearer-token enforcement in `src/app/api/cron/sync-stats/route.ts`
- The endpoint now requires `Authorization: Bearer <CRON_SECRET>`
- Added `CRON_SECRET` to `.env.example`
- Remaining deployment step: set `CRON_SECRET` in the real environment and configure the scheduler to send it

### High Findings

#### H-01: Authorization rules are inconsistent across admin surfaces

Status: Fixed on 2026-03-19.

Affected files:

- `src/app/admin/layout.tsx:6-9`
- `src/app/admin/customer-cars/page.tsx:12-14`
- `src/app/admin/customer-cars/[id]/page.tsx:18-20`

Details:

- The admin layout previously allowed `admin`, `owner`, or the configured `ADMIN_EMAIL`.
- The customer cars pages allowed only `role === "admin"`.
- This created role drift. A user treated as admin by one surface could still be blocked by another.

Recommendation:

- Centralize authorization logic.
- Use the same helper for layout, pages, server actions, and APIs.

Resolution:

- Centralized the admin check in `src/lib/server-auth.ts`
- Updated:
  - `src/app/admin/layout.tsx`
  - `src/app/admin/customer-cars/page.tsx`
  - `src/app/admin/customer-cars/[id]/page.tsx`
- These surfaces now rely on the same role-based admin rule as the secured server actions
- `ADMIN_EMAIL` remains only as a first-login bootstrap mechanism in `src/lib/auth.ts`, not as a runtime authorization bypass

#### H-02: Production build depends on fetching Google Fonts during build time

Status: Fixed on 2026-03-19.

Affected files:

- `src/app/layout.tsx` via `next/font/google` Cairo import

Observed behavior:

- `npm run build` failed in this environment because Next could not fetch Cairo from Google Fonts.

Impact:

- Build reliability depends on outbound network access to Google.
- This can break CI, restricted environments, or some deployment pipelines.

Recommendation:

- Either self-host the font or confirm your deployment environment always has access to Google Fonts at build time.
- If deterministic builds matter, prefer local fonts.

Resolution:

- Replaced `next/font/google` Cairo usage with `next/font/local` in `src/app/layout.tsx`
- Self-hosted Cairo font files under `src/app/fonts/`
- The previous Google Fonts fetch failure no longer occurs during build
- Remaining build failure in this environment is unrelated and comes from a Turbopack process-binding error

## Medium Findings

#### M-01: Booking logic trusts client-side constraints for appointment date validity

Status: Partially fixed for MVP on 2026-03-19.

Affected file:

- `src/server/actions/appointments.ts:29-109`

Details:

- The client calendar prevented selecting past dates.
- The server action previously accepted any date string and stored it directly.
- The booking flow in this product currently works as a day-level booking request, not as a fully automated time-slot scheduler.

Recommendation:

- For the current MVP:
  - validate dates server-side
  - reject invalid or past dates
  - keep booking as a preferred day request
- Treat the following as future features if demand requires them:
  - valid business hours
  - maximum bookings per time slot
  - service duration modeling
  - conflict detection and true appointment-slot scheduling

Resolution:

- Added server-side date validation in `src/server/actions/appointments.ts`
- The action now rejects invalid dates and past dates before creating a booking
- Slot-based scheduling is intentionally deferred as a future product feature, not a current release blocker

#### M-02: Appointment creation can corrupt customer-car data semantics

Status: Fixed on 2026-03-19.

Affected file:

- `src/server/actions/appointments.ts:61-68`

Details:

- When a car does not exist, the code creates `customer_cars`.
- The flow previously stored `machineType` into the `model` field.
- `machineType` is a vehicle class like sedan/SUV, not the real car model.

Impact:

- Customer car records become polluted with booking-form shorthand instead of real vehicle data.
- Later reporting and customer records become less trustworthy.

Recommendation:

- Separate `vehicleType` from `model`.
- Either collect the model explicitly during booking or leave it null/unknown until confirmed.

Resolution:

- The booking flow no longer stores vehicle class into the customer-car `model`
- New customer-car records created from booking now use an explicit unknown-model placeholder instead of incorrect vehicle-type data
- Legacy `machineType` terminology from the old project was removed from the active app flow and replaced with `vehicleType`
- The current schema and app flow now preserve the distinction between `vehicleType` and `model` for this MVP

#### M-03: Core business fields are plain text with no enum or DB-level constraints

Status: Partially fixed on 2026-03-19.

Affected files:

- `src/db/schema.ts:68-88`
- `src/db/schema.ts:118-145`
- `src/db/queries/appointments.ts:27-34`
- `src/server/actions/appointments.ts:141-169`

Details:

- `appointments.status`, `appointments.serviceType`, `appointments.vehicleType`, `customer_cars.status`, and `car_media.type` were modeled as free-form text.
- `updateAppointmentStatus` accepts any `status` string and writes it directly.

Impact:

- UI assumptions can silently break.
- Reporting, filtering, and automation become fragile.
- Typos become valid state.

Recommendation:

- Introduce application enums and, ideally, database constraints.
- Validate incoming status updates against a known list.

Resolution:

- Shared application-level allowed values now exist for appointment statuses, service types, vehicle types, customer-car statuses, and car-media types
- Server-side validation now rejects unsupported appointment statuses, service types, vehicle types, and car makers on the relevant write paths
- `updateAppointmentStatus` no longer writes arbitrary strings directly
- Drizzle schema fields are now typed against shared application unions to reduce accidental invalid writes in the codebase
- Database-level constraints are still recommended as a follow-up migration if stricter persistence guarantees are needed

#### M-04: Multi-step writes are not wrapped in transactions

Status: **Fixed on 2026-03-19.**

Affected files:

- `src/server/actions/appointments.ts:57-87`
- `src/app/admin/portfolio/actions.ts:47-69`
- `src/app/admin/portfolio/actions.ts:107-133`

Details:

- Appointment creation may insert or update `customer_cars` and then create the appointment separately.
- Portfolio update deletes existing media, then reinserts the new set.

Impact:

- Partial failures can leave the database in an inconsistent state.
- A failed portfolio media insert can erase the gallery.

Recommendation:

- Wrap these flows in database transactions.

Resolution:

- Appointment creation now wraps customer-car lookup/update/create and appointment insertion in a single database transaction
- Portfolio creation now wraps the car insert and gallery-media inserts in a single database transaction
- Portfolio update now wraps the car update, media deletion, and media reinsertion in a single database transaction
- Partial failures in these flows now roll back together instead of leaving the database in a partially updated state

#### M-05: Maintenance mode blocks admin access entirely

Status: **Fixed on 2026-03-19.**

Affected file:

- `src/proxy.ts:16-27`

Details:

- During maintenance mode, all non-root, non-api, non-static, non-dashboard, non-onboarding, non-sign-in routes are redirected to `/`.
- `/admin` is not excluded.

Impact:

- Staff cannot access admin tools during maintenance unless they use APIs directly.
- This creates operational friction during real launches.

Recommendation:

- Exclude `/admin` for authorized staff, or at least allow it behind auth.

Resolution:

- Maintenance-mode redirect logic in [src/proxy.ts](/mnt/hdd/projects/thedrive.center/src/proxy.ts) now excludes `/admin`
- Admin routes are no longer blocked by the maintenance redirect before authorization runs
- Unauthorized users still cannot access `/admin`, because the normal admin auth gate remains in place and redirects them to sign-in

#### M-06: Notifications are architected but not integrated into core flows

Affected files:

- `src/lib/notifications/notification.service.ts:5-87`

Observed usage:

- No runtime usage found for `notificationService`, `notifyAppointment`, or `notifyServiceUpdate`.

Impact:

- The code suggests customer notifications exist, but the feature is not actually wired into booking or maintenance updates.
- This creates expectation drift for the client.

Recommendation:

- Either integrate it into appointment confirmation and service updates, or remove it from the claimed feature set until complete.

#### M-07: Admin upload API lacks file-type and size policy enforcement

Affected file:

- `src/app/api/upload/route.ts:22-44`

Details:

- The endpoint trusts `filename` and `contentType`.
- There is no allowlist for file types.
- There is no size policy attached to the signed upload flow.

Impact:

- Admin-only scope reduces severity, but storage abuse and incorrect media uploads remain possible.

Recommendation:

- Enforce allowed MIME types and known extensions.
- Enforce upload size at the client and bucket/presign policy level where possible.

## Low Findings

#### L-01: Linting is currently broken

Observed behavior:

- `npm run lint` fails with an ESLint / `@typescript-eslint` runtime error:
  - `Class extends value undefined is not a constructor or null`

Impact:

- Static analysis is not protecting the codebase.
- CI quality gates are weaker than they appear.

Recommendation:

- Repair the ESLint toolchain before client release.

#### L-02: Automated test coverage is very small

Observed behavior:

- `npm test` passes.
- Only one suite exists, covering plate normalization.

Impact:

- Critical flows are untested:
  - auth
  - booking
  - admin mutations
  - upload authorization
  - onboarding
  - garage permissions

Recommendation:

- Add focused tests around server actions and auth boundaries before release.

#### L-03: Duplicate admin content-management flows increase maintenance cost

Affected areas:

- `src/app/admin/cars/*`
- `src/app/admin/portfolio/*`

Details:

- There are overlapping concepts for vehicle/portfolio content management.
- `src/app/admin/cars/actions.ts` and `src/app/admin/portfolio/actions.ts` both create car-like records in different ways.

Impact:

- This can confuse future maintainers.
- It increases the chance of inconsistent behavior and duplicated UI.

Recommendation:

- Consolidate on one content-management flow unless both are intentionally distinct.

## Schema and Data Model Assessment

### Strengths

- UUID primary keys are used across core entities.
- `plate_number` is unique, which simplifies car lookup.
- Relations are defined clearly in Drizzle.
- Better Auth tables are present and integrated.

### Weaknesses

- Several status/type fields are unconstrained text.
- There are few explicit `notNull()` constraints beyond the basics.
- There are no explicit indexes shown for common search paths like:
  - `appointments.date`
  - `appointments.status`
  - `customer_cars.user_id`
  - `service_records.car_id`
- Business states are encoded in application logic rather than schema rules.

### Recommended Schema Improvements

1. Add enums or constrained text values for:
   - appointment status
   - service type
   - machine type / vehicle type
   - customer car status
   - car media type
2. Add indexes for frequent admin queries and dashboard lookups.
3. Consider splitting “vehicle type” from actual car model.
4. Add audit fields for critical admin mutations if the client needs accountability.

## Security Assessment

### What is good

- Admin route shell is protected in `src/app/admin/layout.tsx`.
- Upload API checks auth and role.
- Security headers exist in `next.config.ts:25-52`.
- Auth is centralized through Better Auth.
- `.env*` is ignored in `.gitignore`.

### What needs work

- Admin server actions need real authorization checks.
- Cron endpoint needs authentication.
- Business validation needs to move server-side.
- Build and lint reliability need to improve.
- There is no evidence of rate limiting on booking or upload-related routes.

## Release Readiness

### Verified during this audit

- `npm test`: passed
- `npm run lint`: failed due toolchain issue
- `npm run build`: failed in this environment because `next/font` could not fetch Cairo from Google Fonts

### Release Verdict

Current verdict: not ready for client handoff.

The app is close in product shape, but release should wait until the following blockers are resolved:

1. Add auth checks to all admin server actions.
2. Protect the cron endpoint.
3. Normalize authorization rules across admin pages and actions.
4. Add server-side booking validation.
5. Fix linting.
6. Make production builds deterministic and reliable.

## Recommended Feature Additions Before Client Delivery

### Strongly recommended

1. Booking guardrails
   - business hours
   - slot capacity
   - duplicate booking prevention
   - blackout dates
2. Notification integration
   - send booking confirmation
   - send status updates
3. Audit logging
   - who changed appointment status
   - who edited portfolio or customer-car records
4. Admin security improvements
   - shared `requireAdmin()` helper
   - protected cron token
   - rate limiting for public booking
5. Operational observability
   - error monitoring
   - structured logs for critical flows

### Nice to have

1. Customer appointment history
2. Booking availability calendar backed by real business rules
3. Search/filter improvements in admin
4. Better SEO content management for landing sections
5. Export/reporting for appointments and service records

## Features to Remove, Merge, or De-scope

### Merge or simplify

1. Merge duplicate admin vehicle/portfolio content flows
2. Decide whether “tip of the day” is a core product feature or a marketing detail
3. Remove or hide unfinished notification functionality until it is wired end-to-end

### De-scope if timeline is short

1. Fancy notification provider abstraction beyond the one real provider you plan to use
2. Any duplicate car-management surface that is not required for launch

## Suggested Remediation Order

1. Fix admin server action authorization
2. Secure the cron endpoint
3. Add server-side booking validations
4. Add transactions to multi-step writes
5. Standardize roles and permissions
6. Fix lint toolchain
7. Resolve build-time font dependency risk
8. Expand tests around auth and mutations

## Final Assessment

This project is directionally good. The product shape is there, the UI is strong, and the architecture is serviceable for the current size. The biggest problems are trust-boundary mistakes, weak enforcement of business rules, and release-process fragility.

If the goal is a safe client delivery, fix the security and data-integrity items first. After that, the app should be in a much stronger state for handoff and future maintenance.
