# Project Requirements Document — The Drive Center

## 1. Business Overview

**The Drive Center** (`المركز الهندسى`) is a specialized automotive service center located at:
> منشية البكري، ٨ شارع طلعت النجار، **المحلة الكبرى**، محافظة الغربية، مصر

- **Phone / WhatsApp**: 010 1713 1414
- **Working Hours**: يومياً ٩ ص – ١٠ م (Daily 9 AM – 10 PM)
- **Google Rating**: 4.6 / 5 (34+ verified reviews)
- **TikTok**: @thedrive
- **Schema Type**: `AutoRepair` (Google Schema.org)

The center is **المركز الأول في المحلة الكبرى** for precision wheel alignment, balancing, and comprehensive pre-sale vehicle inspection using world-class equipment.

---

## 2. Services Offered

These are the exact services taken from `src/lib/constants.ts` and `Services.tsx`:

| Value | Label (Arabic) | Description |
|---|---|---|
| `alignment_balancing` | ضبط زوايا وترصيص | Computer-based precision alignment and balancing |
| `inspection` | فحص شامل | Comprehensive inspection before vehicle purchase/sale |
| `steering_coding` | تكويد طارة | Electronic power steering programming/calibration |
| `suspension_repair` | إصلاح عفشة | Suspension system repair and calibration |
| `tire_service` | خدمة إطارات | Tire services |
| `other` | أخرى | Other services |

### Inspection Tools Used
- **قلم فحص البوية** — Basic paint inspection tool for quick surface checks
- **جهاز قياس سمك الدهان** — Digital professional micron-level paint thickness gauge
- **ماسح الأشعة (UV)** — Exclusive UV scanner that reveals hidden repairs and damage

---

## 3. Platform Purpose

A full-stack web platform that digitizes the center's operations:

### Client-Facing
- **Appointment Booking** (`/book`): Online booking form with license plate recognition, service and vehicle type selection, and date picker.
- **Portfolio Gallery** (`/cars`, `/cars/[slug]`): Visual showcase of completed work with images and video per car.
- **Sign In / Onboarding** (`/sign-in`, `/onboarding`): Account registration linking a user to their cars.
- **Garage Dashboard** (`/dashboard/garage`): Personal space for registered users to see their car's service history.

### Admin Panel (`/admin/*`)
- **Appointments**: View, update status, and delete appointment requests.
- **Customer Cars**: Full CRM for all vehicles registered in the system, with service history per car.
- **Portfolio Management**: Add, edit, and manage portfolio entries (the "سجل التميز").
- **Advices**: Manage dynamic tips shown to users.
- **Hero Image**: Update the landing page hero image.
- **Admin Dashboard**: Overview with booking charts and recent activity.

---

## 4. Technical Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript (end-to-end strict)
- **Database**: PostgreSQL (self-hosted via Dokploy) + Drizzle ORM
- **Authentication**: Better Auth (email/password + Google OAuth)
- **Hosting**: Self-hosted VPS, containerized via **Dokploy** (Docker PaaS)
- **Styling**: Tailwind CSS v4 with semantic "Pro Max" tokens
- **Media Storage**: Cloudflare R2 (S3-compatible)
- **Fonts**: Cairo (Arabic) from Google Fonts
- **Animations**: Framer Motion (`motion/react`) + GSAP (scroll animations)
- **Analytics**: PostHog

---

## 5. Security & Access Control

- **Roles**: `user`, `admin`, `owner` — strictly enforced on all server actions.
- **Session-based auth** via Better Auth; all mutations require verified session.
- **Guest booking** supported (no account required for booking appointments).
- **Admin actions** (delete, update, archive) require `admin` or `owner` role check server-side.
