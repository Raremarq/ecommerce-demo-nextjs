# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

E-commerce demo app built with Next.js 16 (App Router), React 19, TypeScript, SQLite (via better-sqlite3), Drizzle ORM, Zustand for client state, and Tailwind CSS 4.

## Commands

```bash
npm run dev          # Dev server with Turbopack
npm run build        # Production build
npm run start        # Production server
npm run seed         # Seed database with sample data
npm run db:push      # Push Drizzle schema changes to SQLite
npm run db:studio    # Open Drizzle Studio (visual DB browser)
```

No test framework is configured.

## Architecture

### Data Flow
- **All data operations** go through server actions in `src/app/actions.ts` (`"use server"`). There are no API routes.
- Server actions handle: user lookup, product CRUD, cart management, order creation.
- `revalidatePath()` is used after mutations for cache invalidation.

### Client State (Zustand)
- `src/lib/stores/auth.ts` — current user, login modal visibility (mock auth via localStorage)
- `src/lib/stores/cart.ts` — cart drawer open/close
- `src/lib/stores/toast.ts` — toast notifications with auto-dismiss

### Database
- SQLite at `./data/store.db` with WAL mode and foreign keys enabled
- Schema in `src/db/schema.ts`, connection in `src/db/index.ts`
- Tables: `users`, `products`, `cartItems`, `orders`
- Orders store items and shipping address as JSON fields
- Config: `drizzle.config.ts`

### Authentication
Mock auth only — users select a pre-seeded account via a modal. No real auth/middleware.

### Key Directories
- `src/app/` — Pages and layouts (App Router). Admin pages at `src/app/admin/`.
- `src/lib/components/` — Shared components organized by domain (`auth/`, `cart/`, `layout/`, `products/`, `ui/`)
- `src/lib/stores/` — Zustand stores
- `src/lib/utils/` — `cn.ts` (clsx + tailwind-merge), `format-currency.ts`
- `scripts/seed.ts` — Database seeder creating 3 users and 16 products across 4 categories

## Conventions

- Path alias: `@/*` maps to `src/*`
- Prices stored as integers in cents (`priceCents`, `compareAtPriceCents`)
- `"use client"` for interactive components; server components are the default
- Styling: Tailwind CSS 4 with custom `primary` (blue) and `neutral` color scales defined in `src/app/globals.css`
- `next.config.ts` marks `better-sqlite3` as an external server package
- TypeScript strict mode is enabled
