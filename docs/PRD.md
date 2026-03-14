# Project Requirements Document: The Drive Center

## 1. Vision & Purpose
"The Drive Center" is a premium, "Pro Max" automotive service management platform designed to bridge the gap between high-end automotive care and a sophisticated digital experience. The platform serves two primary audiences:
- **Clients**: Providing a seamless booking experience and a transparent view of their vehicle's service history.
- **Administrators**: Offering a powerful suite of tools to manage appointments, track customer vehicles, and showcase the center's elite craftsmanship through a curated portfolio.

## 2. Target Audience
- **Car Enthusiasts & Luxury Vehicle Owners**: Users who demand high-quality maintenance and want a digital record of their car's care.
- **Service Center Management**: Admins and technicians responsible for day-to-day operations and business growth.

## 3. Core Features

### 3.1 Client Experience
- **Interactive Booking**: A streamlined, mobile-first booking form with intelligent plate number recognition and service selection.
- **Garage Dashboard**: (In Development) A personal space for users to manage their registered vehicles and view upcoming service needs.
- **Portfolio Showcase**: A high-impact, visual gallery of the center's best work, featuring detailed descriptions and media.

### 3.2 Admin Management
- **Appointment Control Tower**: A central hub to track, update, and manage bookings (Pending, Completed, Cancelled).
- **Customer Vehicle Database**: A professional CRM for tracking every car that enters the center, linked to specific owners and detailed service histories.
- **Service Logging**: Tools to record precise work details (odometer readings, costs, technical descriptions) for every visit.
- **Portfolio Management**: An easy-to-use interface for adding new "Success Stories" with high-quality photos and videos.

### 3.3 Design Philosophy ("Pro Max")
- **OLED Black Foundation**: A sleek, dark-themed aesthetic optimized for premium displays.
- **Glassmorphism**: Subtle blur effects and translucency for a modern, high-end feel.
- **Micro-Animations**: Fluid transitions using GSAP and Framer Motion to enhance the "feeling" of the app.
- **Semantic Theming**: A robust system-wide theme palette ensuring consistency across all components.

## 4. Technical Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS with custom "Pro Max" tokens.
- **Database**: PostgreSQL with Drizzle ORM.
- **Authentication**: Better Auth (supporting Google and traditional methods).
- **Storage**: Cloudflare R2 for high-performance media delivery.
- **Analytics**: PostHog (integrated for user behavior tracking).

## 5. Security & Performance
- **Role-Based Access Control**: Strict separation between user and admin capabilities.
- **Media Optimization**: Dynamic image resizing and performant video streaming via Cloudflare.
- **SEO Optimization**: Fully semantic HTML and complete meta-tagging for maximum search visibility.
