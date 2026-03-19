# Project Audit Report — The Drive Center

Last Updated: **2026-03-15**

---

## 1. UI/UX Fixes Applied Today

### 1.1 Admin Appointments — Light Theme Readability
**Status**: ✅ FIXED

| Issue | Fix |
|---|---|
| Header `text-white` was invisible in light mode | → `text-foreground` semantic token |
| Stats badge "الإجمالي 2" was dull and unreadable | → `bg-muted/50 border-border/50 text-foreground` |
| 3-dot menu `MoreVertical` icon disappeared on hover | → `hover:text-foreground` added to trigger button |
| DeleteAppointmentDialog hardcoded `bg-zinc-950` | → `bg-background border-border/50 rounded-4xl` |

---

### 1.2 Customer Cars Page
**Status**: ✅ FIXED

| Issue | Fix |
|---|---|
| Arabic header "إدارة سيارات العملاء" was accidentally removed | → Restored with Pro Max styling |
| 3-dot action menu invisible in light theme on hover | → `hover:text-foreground` high-contrast state |

---

### 1.3 Showcase Page
**Status**: ✅ FIXED

| Issue | Fix |
|---|---|
| "معاينة العرض" button: white-on-white in light theme hover | → `hover:bg-foreground hover:text-background` |
| Cards and header used hardcoded zinc colors | → Migrated to `bg-card`, `border-border/50`, `text-foreground` |

---

### 1.4 FilterBar — Input/Select Height Misalignment
**Status**: ✅ FIXED

| Issue | Fix |
|---|---|
| Search input and Select dropdown were different heights | → Both forced to `h-12!` |
| "Add New Work" button height out of sync | → Synced to `h-12` |

---

### 1.5 ServiceSelect — Unified Component
**Status**: ✅ FIXED

| Issue | Fix |
|---|---|
| Appointment form had its own hardcoded service list | → Replaced with `ServiceSelect` from `constants.ts` |
| `AddServiceRecordModal` used a free-text field | → Replaced with `ServiceSelect` dropdown |
| FilterBar had its own inline `Select` mapping | → Replaced with `ServiceSelect` (`showAllOption={true}`) |
| `AddServiceRecordModal` used `bg-zinc-950` | → `bg-background border-border/50` |

### 1.6 Egyptian License Plate Normalization
**Status**: ✅ FIXED

| Issue | Fix |
|---|---|
| Arabic license plates treated as different due to character variations (أ, إ, آ, ة, ى) | → Centralized `normalizePlateNumber()` in `utils.ts` |
| Variations like "س م أ" vs "س م ا" caused duplicate car records | → Consistent character mapping: Alef variations to "ا", "ة" to "ه", "ي" to "ى" |
| Inconsistent normalization regex in different actions | → All actions now use the unified utility function |

---

## 2. Security Audit

### 🔴 CRITICAL — Unauthenticated Upload Route
**File**: `src/app/api/upload/route.ts`
**Status**: ⚠️ OPEN

The `POST /api/upload` and `DELETE /api/upload` routes have **no authentication check**. The auth import is commented out:
```ts
// import { auth } from "@/lib/auth"; // We should ideally protect this route
```

**Risk**: Any anonymous user can call `POST /api/upload` to generate a valid pre-signed R2 URL and upload arbitrary files to your Cloudflare R2 bucket. The `DELETE` endpoint allows anyone to delete any file by filename.

**Fix needed**:
```ts
const session = await auth.api.getSession({ headers: request.headers });
if (!session?.user || !isAdminRole(session.user.role)) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

---

### 🟠 HIGH — Weak Content Security Policy
**File**: `next.config.ts`
**Status**: ⚠️ OPEN

The only CSP header is:
```ts
{ key: "Content-Security-Policy", value: "upgrade-insecure-requests" }
```

This is the weakest possible CSP — it only ensures HTTP is upgraded to HTTPS. It provides **no protection against XSS, clickjacking, or unauthorized script injection**.

**Missing headers**:
- `X-Frame-Options: DENY` (clickjacking protection)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`
- A real `Content-Security-Policy` with `default-src`, `script-src`, `img-src` directives

---

### 🟠 HIGH — Wildcard Image Hostname
**File**: `next.config.ts`
**Status**: ⚠️ OPEN

```ts
images: {
  remotePatterns: [{ protocol: "https", hostname: "**" }]
}
```

This allows Next.js Image optimization for **any external URL**, bypassing the intended purpose of the allowlist and potentially enabling SSRF via the image proxy.

**Fix**: Restrict to only the hostnames actually used:
```ts
remotePatterns: [
  { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
  { protocol: "https", hostname: "your-r2-public-domain.com" },
  { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google profile photos
]
```

---

### 🟡 MEDIUM — `isAdmin()` misses "owner" role
**File**: `src/features/maintenance/actions.ts`
**Status**: ⚠️ OPEN

```ts
async function isAdmin() {
  return session?.user?.role === "admin";
}
```

This helper only checks for `"admin"` but the `appointments.ts` server actions correctly check for both `"admin"` and `"owner"` via the `isAdminRole()` helper. The maintenance actions could fail to authorize the `owner` account.

**Fix**: Align with `appointments.ts`:
```ts
function isAdmin(role?: string) {
  return role === "admin" || role === "owner";
}
```

---

### 🟡 MEDIUM — Real Credentials in `.env.example`
**File**: `.env.example`
**Status**: ⚠️ REVIEW

The example file contains what appears to be a real database credential:
```
DATABASE_URL="postgresql://thedrive_store:thedrive_store_2026@postgres-db:5432/thedrive-store?sslmode=require"
```

While `.env*` is in `.gitignore`, this file **is committed to the repo**. If the password `thedrive_store_2026` is actually used in production, it should be rotated and the example file should use a clearly fake placeholder.

**Fix**: Replace with:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?sslmode=require"
```

---

### 🟡 MEDIUM — Admin Routes Not Protected by Middleware
**File**: `src/proxy.ts`
**Status**: ⚠️ OPEN

The middleware handles onboarding redirects but does **not guard `/admin/*` routes**. Any logged-in user (with `role: "user"`) can navigate to `/admin/appointments` — the protection relies only on server-side role checks within each page/action.

**Recommended**: Add explicit middleware guard:
```ts
if (pathname.startsWith("/admin")) {
  if (!session || !isAdminRole(session.user.role)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}
```

---

### 🟡 MEDIUM — Duplicate Booking Endpoint
**Files**: `src/app/api/appointments/route.ts` AND `src/server/actions/appointments.ts`
**Status**: ⚠️ REVIEW

Two separate booking implementations exist for the same action. The API route (`/api/appointments`) does NOT link the appointment to a `carId` or create a `customerCar` record, while the Server Action does. This means bookings via the REST API are structurally incomplete.

**Fix**: Remove or deprecate `src/app/api/appointments/route.ts` if all booking is going through Server Actions.

---

## 3. Deployment Audit (Self-Hosted VPS / Dokploy)

### ✅ Good
- `.env` is correctly excluded from git via `.gitignore` (`.env*` pattern)
- Dokploy handles Docker-based auto-deploy on push to `main`
- PostgreSQL runs as a separate Dokploy service — not bundled in the app container
- `NEXT_PUBLIC_MAINTENANCE_MODE` feature flag allows instant lockdown without a redeploy
- No Vercel-specific dependencies — fully portable stack

### ⚠️ Open Items
| Item | Risk | Action |
|---|---|---|
| No rate limiting on `/api/appointments` or `/api/upload` | Abuse / spam bookings | Add IP-based rate limiting (e.g., upstash/ratelimit or nginx layer) |
| No `NEXT_PUBLIC_APP_URL` documented in `.env.example` | `metadataBase` fallback triggers in layout | Add `NEXT_PUBLIC_APP_URL=https://yourdomain.com` to example |
| BETTER_AUTH_URL and BETTER_AUTH_TRUSTED_ORIGINS are blank | Auth CSRF risk in production | Must be set to the actual deployed domain |
| No health check endpoint configured for Dokploy | Can't auto-recover failed containers | Add `/api/health` returning `{ ok: true }` |

---

## 4. Code Quality Notes

| Area | Status | Note |
|---|---|---|
| Server Actions auth | ✅ Good | All mutations check session before proceeding |
| Zod validation | ✅ Good | All forms and API routes validate with Zod before DB writes |
| Type safety | ✅ Good | Strict TypeScript throughout; `any` usage is isolated to props interop only |
| `revalidatePath` usage | ✅ Good | Consistently applied after all mutations |
| `serviceType` data integrity | ✅ Fixed today | All forms now use unified `SERVICE_TYPES` from `constants.ts` |
| Error handling | 🟡 Partial | `console.error` is used but no error tracking service (Sentry etc.) is configured |
| Comments in code | ✅ Cleaned | No stale comment blocks remaining after today's cleanup |

---

## 5. Known Linting Warnings (Non-Breaking)

| File | Warning | Action |
|---|---|---|
| `globals.css` | Unknown `@custom-variant`, `@theme`, `@apply` at-rules | Tailwind v4-specific — IDE false positives, build is fine |
| `AdminCarManager.tsx:139` | `block` and `flex` conflicting classes | Cosmetic — no functional impact |
| `DeleteAppointmentDialog.tsx:24` | `rounded-[2rem]` → `rounded-4xl` | Low priority |
| `force-drop-columns.ts` | `err` is `unknown` type | Utility script, not in app bundle |
