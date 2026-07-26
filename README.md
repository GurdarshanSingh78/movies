<div align="center">

# 🎬 Drama Discovery

### One platform. Every screen. Hollywood blockbusters and Pakistani drama serials, unified.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

*A hybrid streaming aggregator that fuses the TMDB catalog with a self-hosted, auto-synced index of Pakistani drama serials pulled straight from official YouTube networks.*

</div>

---

## 📖 Table of Contents

- [Why Drama Discovery](#-why-drama-discovery)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Seeding the Drama Index](#-seeding-the-drama-index)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [Author](#-author)

---

## 🌍 Why Drama Discovery

Global aggregators like TMDB have no concept of regional serial content — Pakistani dramas simply don't exist in their catalogs. Drama Discovery closes that gap by running **two content pipelines in parallel** and merging them behind a single, unified interface: one query, one watchlist, one experience — whether the title is a Marvel release or a 40-episode serial from a regional network.

## ✨ Features

| | |
|---|---|
| 🌐 **Global Content Engine** | Real-time movie & TV data fetched live from the TMDB API |
| 📺 **Curated Local Ecosystem** | Automated YouTube Data API v3 crawler that indexes full serial playlists from premier Pakistani networks |
| 🔀 **Hybrid Data Architecture** | Transparently routes global titles to TMDB and local dramas to a synced Supabase/PostgreSQL store |
| 🔐 **Secure Auth** | Server-side rendered authentication via Supabase Auth + Google OAuth |
| ⭐ **Personalized Watchlists** | Unified watchlist across both content sources, persisted through Prisma ORM |
| 🎨 **Cinematic UI** | Fully responsive, dark-mode-first interface built with Tailwind CSS |

## 🏗 Architecture

```
┌─────────────────┐        ┌──────────────────────┐
│   Next.js App    │──────▶│      TMDB API         │  → Movies & Series (global)
│   (App Router)    │        └──────────────────────┘
│                   │        ┌──────────────────────┐
│   Unified Search  │──────▶│   YouTube Data API v3  │──┐
│   & Watchlist UI  │        └──────────────────────┘  │
│                   │                                   ▼
│                   │                        ┌────────────────────┐
│                   │◀──────────────────────│  Supabase Postgres   │
└─────────────────┘   Prisma ORM            │  (Title, Watchlist)  │
                                              └────────────────────┘
```

The seed route crawls YouTube network playlists on demand, normalizes episode metadata, and writes it into the same relational schema that powers watchlists for global titles — so the frontend never needs to know which pipeline a given title came from.

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL via [Supabase](https://supabase.com/) |
| ORM | Prisma |
| Auth | Supabase Auth (Google OAuth & Email/Password) |
| External APIs | TMDB API, YouTube Data API v3 |

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- An active Supabase project with **connection pooling enabled (IPv4)**
- TMDB API key and YouTube Data API v3 key

### 1. Clone the repository
```bash
git clone https://github.com/GurdarshanSingh78/movies.git
cd movies
```

### 2. Install dependencies
```bash
npm install
```

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
# TMDB & YouTube
TMDB_API_KEY="your_tmdb_api_key"
YOUTUBE_API_KEY="your_youtube_api_key"

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"

# Prisma Database URLs (connection pooling required)
DATABASE_URL="postgres://postgres.[PROJECT_REF]:[PASSWORD]@[POOLER_HOST]:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgres://postgres.[PROJECT_REF]:[PASSWORD]@[POOLER_HOST]:5432/postgres"
```

> **Note:** Replace `[PROJECT_REF]`, `[PASSWORD]`, and `[POOLER_HOST]` with the values from your Supabase project's connection settings.

## 🗄 Database Setup

Push the Prisma schema to construct the `Title` and `Watchlist` tables:

```bash
npx prisma db push
```

## 📼 Seeding the Drama Index

Start the dev server:

```bash
npm run dev
```

Then trigger the crawler by visiting:

```
http://localhost:3000/api/seed-dramas
```

This runs the YouTube scraping engine and populates the local drama index for the first time.

## 📁 Project Structure

```
movies/
├── app/                  # Next.js App Router pages & API routes
│   └── api/
│       └── seed-dramas/  # YouTube playlist crawler endpoint
├── lib/                  # Prisma client, Supabase client, TMDB/YouTube helpers
├── prisma/
│   └── schema.prisma     # Title & Watchlist models
└── components/           # UI components (Tailwind)
```

## 🗺 Roadmap

- [ ] Turkish & Korean drama networks integration
- [ ] Episode-level watch progress tracking
- [ ] Recommendation engine across hybrid catalog
- [ ] Mobile app (React Native)

## 👨‍💻 Author

**Gurdarshan Singh**
Full-Stack Engineering / Machine Learning
[GitHub](https://github.com/GurdarshanSingh78)

---

> **Deployment note:** When deploying to Vercel or similar platforms, ensure every environment variable above is mapped in the project settings before triggering the build.