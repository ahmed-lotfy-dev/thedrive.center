# The Drive Center 🏎️

> مركز متخصص في ضبط الزوايا والترصيص والفحص الشامل للسيارات — المركز الأول في المحلة الكبرى.

---

## About

**The Drive Center** is a premium automotive service platform built for a specialized wheel alignment, balancing, and vehicle inspection center in **Al Mahalla Al Kubra, Gharbia Governorate, Egypt**.

The platform handles everything from online appointment booking and client garage management to a full admin control panel for managing vehicles, service history, and a visual portfolio of completed work.

---

## Documentation

| File | Description |
|---|---|
| [PRD.md](docs/PRD.md) | Business overview, services, features, and tech stack |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Infrastructure, database schema, and system design |
| [ERD.md](docs/ERD.md) | Full Mermaid Entity Relationship Diagram |
| [CASE_STUDY.md](docs/CASE_STUDY.md) | Non-technical case study (English) — portfolio ready |
| [INTRO_ARABIC.md](docs/INTRO_ARABIC.md) | Arabic project introduction — for local clients |

---

## Services Handled

- ضبط زوايا وترصيص (Wheel Alignment & Balancing)
- فحص شامل قبل البيع والشراء (Pre-Purchase Comprehensive Inspection)
- تكويد طارة (Power Steering Coding)
- إصلاح عفشة (Suspension Repair)
- خدمة إطارات (Tire Service)

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (self-hosted via Dokploy) |
| ORM | Drizzle ORM |
| Auth | Better Auth |
| Hosting | Self-hosted VPS (Dokploy Docker PaaS) |
| Media | Cloudflare R2 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion + GSAP |
| Analytics | PostHog |

---

## Getting Started

```bash
# Install dependencies
bun install

# Copy environment variables
cp .env.example .env
# Fill in: DATABASE_URL, BETTER_AUTH_SECRET, R2 credentials, etc.

# Run dev server
bun dev
```

---

## Contact

- 📍 منشية البكري، ٨ شارع طلعت النجار، المحلة الكبرى
- 📞 010 1713 1414
- 🕐 يومياً ٩ص – ١٠م
- 💬 [WhatsApp](https://wa.me/201017131414)

---

*Designed & Developed by [Ahmed Shoman](https://ahmedlotfy.site)*
