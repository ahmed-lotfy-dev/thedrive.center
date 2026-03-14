# The Drive Center 🏎️💎

A premium, "Pro Max" automotive service management platform built for elite service centers and their clients.

## 🌟 Project Overview
The Drive Center is a high-performance digital ecosystem designed to manage the entire lifecycle of luxury automotive care. From intelligent booking to detailed service history tracking and a cinematic portfolio showcase, every aspect of the platform is engineered for excellence.

## 📖 Documentation Suite
We have completely overhauled our documentation to ensure maximum clarity for both human developers and AI assistants:

- [**PRD (Project Requirements Document)**](docs/PRD.md): The vision, core features, and technical foundation.
- [**Technical Architecture**](docs/ARCHITECTURE.md): Deep dive into the system design, infrastructure, and front-end philosophy.
- [**Database ERD**](docs/ERD.md): Detailed Mermaid diagram of the project's data relationships.
- [**Case Study**](docs/CASE_STUDY.md): A professional summary of the problem, solution, and impact for portfolio showcase.
- [**المركز الهندسى (Intro Arabic)**](docs/INTRO_ARABIC.md): A complete introduction for our Arabic-speaking clients and partners.

## 🛠️ Tech Stack
- **Framework**: Next.js 15
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: Better Auth
- **Storage**: Cloudflare R2
- **Styling**: Tailwind CSS (Pro Max Semantic Tokens)
- **Animations**: GSAP & Framer Motion

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (Recommended) or Node.js 20+
- PostgreSQL Database
- Cloudflare R2 Credentials (Optional for local dev)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ahmed-lotfy-dev/thedrive.center.git
   ```
2. Install dependencies:
   ```bash
   bun install
   ```
3. Set up your environment variables:
   ```bash
   cp .env.example .env
   # Fill in your database and auth credentials
   ```
4. Run the development server:
   ```bash
   bun dev
   ```

## 🏗️ Development Principles
- **Feature-Driven Design**: Components are modular and grouped by domain.
- **Micro-Animations**: Fluid transitions using GSAP and Framer Motion.
- **OLED Black UI**: Optimized for high-end displays with semantic tokens.
- **Security First**: Role-based access and secure data mutations.

---
*Built with passion for the automotive world.* 🏁
