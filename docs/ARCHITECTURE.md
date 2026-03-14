# Technical Architecture: The Drive Center

## 1. System Overview
The Drive Center is built on a modern, full-stack Next.js architecture, prioritizing server-side rendering (SSR) for SEO and client-side interactivity for a premium "Pro Max" feel.

## 2. Infrastructure
- **Hosting**: Vercel (Optimized for Next.js).
- **Database**: Managed PostgreSQL (Supabase/Neon).
- **Media**: Cloudflare R2 (Serverless S3-compatible storage).
- **Edge Runtime**: Utilized for auth and high-performance middleware.

## 3. Data Architecture (Drizzle ORM)
The system uses a relational model designed for consistency and scalability:

- **Auth Layer**: Better Auth manages the `user`, `session`, `account`, and `verification` tables.
- **Core Ops**: 
    - `appointments`: Links users (or guests) to services and cars.
    - `customer_cars`: The central registry for all client vehicles.
    - `service_records`: Atomic logs of work performed on specific `customer_cars`.
- **Engagement Layer**:
    - `cars`: Portfolio items showcasing the center's best work.
    - `car_media`: Gallerized media for portfolio items.
    - `advices`: Dynamic content for user engagement.

## 4. Frontend Architecture
- **Feature-Driven Structure**: Components are grouped by domain (e.g., `features/maintenance`, `features/appointments`).
- **Shared UI Library**: Built on Radix UI and customized with "Pro Max" Tailwind tokens.
- **State Management**: Zero-bundle-size state management using Server Actions and React's `useOptimistic`.
- **Animations**: 
    - `Framer Motion`: For UI transitions and micro-interactions.
    - `GSAP`: For complex scroll-triggered animations (e.g., the landing car animation).

## 5. Deployment & CI/CD
- **Environment Parity**: Strict `.env` management for local and production environments.
- **Type Safety**: End-to-end TypeScript coverage from database schema to frontend props.
- **Asset Pipeline**: Automatic optimization of public assets and on-the-fly media delivery via Cloudflare.
