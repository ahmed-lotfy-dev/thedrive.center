# The Drive Center 🏎️

> **The #1 specialized automotive service center in Al Mahalla Al Kubra.**
> مركز متخصص في ضبط الزوايا والترصيص والفحص الشامل للسيارات بأحدث الأجهزة الرقمية.

---

## 🌟 Overview

**The Drive Center** is a professional, Arabic-first automotive service platform. It's not just a website; it's a complete operational ecosystem designed to bridge the gap between high-end offline technical expertise and modern digital convenience.

From **online appointments** to a proprietary **Garage Dashboard** for vehicle tracking, the platform streamlines the entire customer journey while providing a powerful command center for business owners.

---

## 🛠️ Technical Architecture

Built with a focus on **performance**, **reliability**, and **maintainability**:

- **Core**: [Next.js 16](https://nextjs.org/) (App Router) for superior SSR and SEO.
- **Data Layer**: [PostgreSQL](https://www.postgresql.org/) (via Neon) managed with [Drizzle ORM](https://orm.drizzle.team/) for end-to-end type safety.
- **Authentication**: [Better Auth](https://better-auth.com/) for secure, modern session management.
- **Media**: [Cloudflare R2](https://browser.cloudflare.com/) with a custom **Client-side Image Resizing** engine to ensure lightning-fast mobile performance.
- **Messaging**: Multichannel notifications via official **WhatsApp API** and **Resend** (Email), implemented using an **Outbox Pattern** for maximum reliability.
- **Deployment**: Self-hosted on a private VPS using **Dokploy** for automated CI/CD and container orchestration.

---

## ✨ Key Features

### 🏁 Public Surface
- **Arabic-First Design**: Premium UI optimized for RTL and Arabic typography.
- **Smart Booking**: Conflict-aware appointment system with immediate digital confirmation.
- **Showcase Gallery**: Dynamic CMS-driven portfolio of luxury vehicle service results.
- **Local SEO**: Strategic JSON-LD structured data and optimized metadata for local discovery.

### 🚗 Customer Garage
- **Secure Onboarding**: Personalized dashboard for vehicle owners.
- **Vehicle Timeline**: Comprehensive service history and maintenance tracking.
- **Proactive Alerts**: Automated reminders for wheel alignment and recurring services.

### 📊 Admin Command Center
- **Operational Dashboard**: Real-time KPIs, booking charts, and engagement metrics.
- **Service Management**: Full control over appointments, customer cars, and service records.
- **Content CMS**: Live management of Hero imagery, advice popups, and site settings.

---

## 📂 Project Documentation

Deep dive into the project's design and strategy:

| Document | Purpose |
|---|---|
| 📜 [Premium Case Study](docs/case-study-premium.md) | Full technical & business breakdown (EN/AR) |
| 🏗️ [Architecture Overview](docs/architecture_review.md) | Infrastructure and system design details |
| 📊 [Database Schema](docs/ERD.md) | Entity Relationship Diagram and data models |
| 📋 [Business Requirements](docs/PRD.md) | Features, goals, and technical specifications |
| 📢 [Social Strategy (EN)](docs/social-media-linkedin-premium.md) | Professional LinkedIn/X marketing content |
| 🛠️ [Social Strategy (AR)](docs/social-media-arabic-technical.md) | Technical Arabic audience engagement |

---

## 🚀 Getting Started

```bash
# Clone and install
bun install

# Configure environment
cp .env.example .env
# Required: DATABASE_URL, BETTER_AUTH_SECRET, R2_BUCKET, RESEND_API_KEY, WHATSAPP_TOKEN

# Development
bun dev

# Database Push
bun run db:push
```

---

## 📞 Connect with Us

- 📍 [Location on Maps](https://www.google.com/maps/place/%D9%85%D8%B1%D9%83%D8%B2+%D9%84%D8%B6%D8%A8%D8%B7+%D8%A7%D9%84%D8%B2%D9%8AW%D8%A7%D9%8A%D8%A7+%D9%88%D8%A7%D9%84%D8%AA%D8%B1%D8%B5%D9%8A%D8%B5+The+Drive%E2%80%AD/@30.9472165,31.155854,17z/data=!3m1!4b1!4m6!3m5!1s0x14f7bb985d243427:0xf849ebdffb23f5da!8m2!3d30.9472165!4d31.155854!16s%2Fg%2F11p0_v62xm) | منشية البكري، ٨ شارع طلعت النجار، المحلة الكبرى
- 📞 [+20 10 1713 1414](tel:+201017131414)
- 💬 [Contact on WhatsApp](https://wa.me/201017131414)

---

*Designed & Developed by [Ahmed Shoman](https://ahmedlotfy.site)*
| Built with ❤️ for the Egyptian Automotive Community*
