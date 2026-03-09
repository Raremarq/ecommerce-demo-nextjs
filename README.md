# E-Commerce Demo

A full-featured e-commerce storefront built with Next.js 16, React 19, and TypeScript. Browse products, manage a shopping cart, and complete checkout — all backed by a local SQLite database.

## Tech Stack

- **Next.js 16** with App Router and Turbopack
- **React 19** with Server Components and Server Actions
- **TypeScript**
- **Tailwind CSS 4**
- **Drizzle ORM** with SQLite (better-sqlite3)
- **Zustand** for client-side state management

## Features

- Product catalog with category filtering (Electronics, Clothing, Home & Kitchen, Accessories)
- Product detail pages with pricing and stock info
- Shopping cart with add/remove/update quantities
- Cart drawer sidebar for quick access
- Checkout flow with shipping address collection
- Order confirmation and order history
- User account pages
- Admin dashboard for product management (create/edit)
- Toast notifications
- Responsive, mobile-first design

## Getting Started

### Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/)

### Setup

```bash
# Install dependencies
pnpm install

# Push the database schema and seed with sample data
pnpm db:push
pnpm seed

# Start the development server
pnpm dev
```

The app will be running at [http://localhost:3000](http://localhost:3000).

### Sample Data

The seed script creates:

- 3 users (Alice, Bob, and an Admin)
- 16 products across 4 categories
- Realistic pricing with compare-at prices for discount display

## Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm seed` | Populate database with sample data |
| `pnpm db:push` | Push schema changes to the database |
| `pnpm db:studio` | Open Drizzle Studio (visual DB editor) |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── actions.ts          # Server Actions for all data operations
│   ├── products/           # Product listing and detail pages
│   ├── admin/              # Admin dashboard and product management
│   ├── cart/               # Shopping cart page
│   ├── checkout/           # Checkout and order confirmation
│   └── account/            # User account and order history
├── db/
│   ├── schema.ts           # Drizzle ORM schema (users, products, carts, orders)
│   └── index.ts            # Database connection
├── lib/
│   ├── components/         # React components (auth, cart, layout, products, ui)
│   ├── stores/             # Zustand stores (auth, cart, toast)
│   └── utils/              # Helpers (currency formatting, cn utility)
└── globals.css             # Tailwind and global styles
```
