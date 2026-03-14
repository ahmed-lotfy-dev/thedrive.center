# Technical Architecture — The Drive Center

## 1. System Overview

The Drive Center runs as a full-stack Next.js 16 application using the App Router, with strictly typed TypeScript throughout. The system prioritizes Server Components and Server Actions for data mutations, with targeted client components for interactive UI.

---

## 2. Infrastructure (100% Self-Hosted)

| Layer | Technology | Details |
|---|---|---|
| **App Hosting** | VPS + **Dokploy** | The Next.js app runs as a Docker container, managed and deployed via Dokploy. Auto-deploys on push to the `main` branch. |
| **Database** | **PostgreSQL** (self-hosted) | Runs as a managed Dokploy service on the same VPS. Data stays on-premise — no external DB vendor. |
| **Media** | **Cloudflare R2** | S3-compatible object storage for car images and videos. Delivered at the edge globally. |
| **DNS / Edge** | Cloudflare | Acts as the CDN and DDoS layer in front of the VPS. |

---

## 3. Database Schema (Drizzle ORM)

All tables are in a PostgreSQL database managed via Drizzle ORM (`src/db/schema.ts`).

### Auth Layer (Better Auth)
| Table | Purpose |
|---|---|
| `user` | Registered users. Has a `role` field (`user`/`admin`/`owner`) and `onboarded` boolean. |
| `session` | Active sessions tied to a user. |
| `account` | OAuth or credential account links per user. |
| `verification` | Email/token verification entries. |

### Application Layer
| Table | Purpose |
|---|---|
| `appointments` | Booking requests. Links to `user` (nullable for guests) and `customer_cars`. Tracks `serviceType`, `machineType`, `date`, `status`, estimated/actual price. |
| `customer_cars` | Every car tracked by the center. Has `plateNumber` (unique), `make`, `model`, `year`, `color`, `status` (active/archived). Links to `user`. |
| `service_records` | Immutable log of completed services per car. Tracks `serviceType`, `cost`, `odometer`, `description`. |
| `cars` | Portfolio items ("سجل التميز"). Not customer cars — these are showcase work entries with `title`, `slug`, `coverImageUrl`, `videoUrl`, `serviceType`, `featured`. |
| `car_media` | Gallery images/videos linked to a portfolio `car` entry (cascade delete). |
| `advices` | Dynamic text tips shown in the UI, toggled via `isActive`. |
| `site_settings` | Key-value store for dynamic site configuration. |

---

## 4. Frontend Architecture

**Folder Structure**: Feature-driven under `src/features/`, with shared components under `src/components/`.

- `src/features/appointments/` — Client booking form and logic
- `src/features/maintenance/` — Admin car management, service records, garage dashboard
- `src/features/landing/` — All public-facing landing page sections (Hero, Services, CTA, etc.)
- `src/features/admin/` — Admin-specific charts and recent activity
- `src/features/cars/` — Public portfolio views
- `src/components/shared/` — Reusable components: `FilterBar`, `ServiceSelect`, `LicensePlateInput`, `UserMenu`, etc.
- `src/components/ui/` — Shadcn-based (Radix UI) base component library

**Server Actions**: All data mutations (create appointment, delete car, add service record) go through `"use server"` functions. No API routes for mutations.

---

## 5. Authentication Flow

- **Better Auth** handles sign-in with email/password and Google OAuth.
- On first sign-in, users are redirected to `/onboarding` to complete their profile.
- The `authClient` (client-side) exposes `useSession()` for reactive session state.
- The `auth.api.getSession()` (server-side) is used in Server Actions and API Routes for role checks.

---

## 6. Deployment Flow

```
git push origin main
    → Dokploy webhook triggered
    → Docker container rebuilt from repo
    → Zero-downtime swap on the VPS
    → PostgreSQL remains untouched (separate service)
```
