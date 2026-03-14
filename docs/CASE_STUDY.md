# Case Study: The Drive Center

**Category**: Automotive Service / SaaS Platform
**Type**: Full-Stack Web Application
**Stack**: Next.js 16 · TypeScript · PostgreSQL · Drizzle ORM · Tailwind CSS · Cloudflare R2

---

## The Problem

The Drive Center is a specialized car service center in **Al Mahalla Al Kubra, Gharbia Governorate, Egypt** — the city's number-one destination for wheel alignment, balancing, and pre-purchase vehicle inspection. Despite the quality of their service, all operations were manual: appointments by phone, car records on paper, and no digital showcase of their work.

The result: missed bookings, zero service history traceability, and no online presence that matched the quality of their physical work.

---

## What I Built

A complete operational web platform replacing all manual processes with a premium digital experience:

**For clients:**
- Online appointment booking with Arabic license plate recognition, service type selection, and date scheduling — no account required
- A cinematic portfolio gallery ("سجل التميز") showcasing finished work with hi-res images and video per car
- A personal garage dashboard to track their vehicle's service history (in development)

**For the admin team:**
- A full appointments control panel — view, confirm, update status, and delete bookings
- A vehicle CRM tracking every car by plate number, linked to its complete service history (dates, costs, odometer)
- Content management for the portfolio and client advice tips

---

## Services Managed by the Platform

| Service | Arabic |
|---|---|
| Wheel Alignment & Balancing | ضبط زوايا وترصيص |
| Comprehensive Pre-Purchase Inspection | فحص شامل |
| Power Steering Coding | تكويد طارة |
| Suspension Repair | إصلاح عفشة |
| Tire Service | خدمة إطارات |

---

## Technical Decisions

**Self-hosted infrastructure (no vendor lock-in):**
The entire system — app server and PostgreSQL database — runs on a private VPS managed via **Dokploy** (Docker-based PaaS). This keeps infrastructure costs low and data fully on-premise. Deployments are automated on every push to `main`.

**Server Actions over API routes:**
All data mutations (create booking, delete car, add service record) use Next.js Server Actions directly, eliminating the need for a traditional REST API layer and reducing latency.

**Media at the edge:**
Car photos and videos are stored on **Cloudflare R2** (S3-compatible) and delivered globally with zero egress fees.

---

## Business Impact

- Appointments are now captured digitally, with real-time status updates for the admin
- Every vehicle entering the center gets a permanent, searchable record
- A professional portfolio increases trust and showcases craftsmanship to potential new clients
- 4.6/5 on Google with 34+ verified reviews — the platform now reinforces this reputation digitally
