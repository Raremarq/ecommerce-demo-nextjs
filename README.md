# Auction Now API E-Commerce Demo

This demo storefront shows how the Auction Now API can be integrated with an e-commerce platform. It's built with Next.js 16, React 19, and TypeScript, and backed by a local SQLite database.

## Tech Stack

- **Next.js 16** with App Router and Turbopack
- **React 19** with Server Components and Server Actions
- **TypeScript**
- **Tailwind CSS 4**
- **Drizzle ORM** with SQLite (better-sqlite3)
- **Zustand** for client-side state management

## Getting Started

### Get Your Auction Now API Key

To run the demo yourself, you'll need an Auction Now API key. Sign up for a free account at [auctionnow.io](https://auctionnow.io). To get your api key, click on your avatar in the top right corner and select "Manage account" -> "API keys" -> "Add new key".

Alternatively, you can email jacob@auctionnow.io to request access.

Once you have your API key, create a `.env` file in the root of the project (you can copy the `.env.example` file to get started) and add your key:

```
AUCTION_NOW_API_KEY=<your api key>
```

### Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/) (or npm or yarn if you prefer)

### Setup

```bash
# Install dependencies
pnpm install (or npm install or yarn install)

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

| Script           | Description                            |
| ---------------- | -------------------------------------- |
| `pnpm dev`       | Start dev server with Turbopack        |
| `pnpm build`     | Production build                       |
| `pnpm start`     | Start production server                |
| `pnpm seed`      | Populate database with sample data     |
| `pnpm db:push`   | Push schema changes to the database    |
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
