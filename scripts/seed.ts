import { sql } from "drizzle-orm";
import * as schema from "../src/db/schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Db = {
  run: (query: any) => any;
  delete: (table: any) => any;
  insert: (table: any) => any;
};

async function createTables(db: Db) {
  await db.run(sql`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'customer',
    avatar_url TEXT
  )`);

  await db.run(sql`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price_cents INTEGER NOT NULL,
    compare_at_price_cents INTEGER,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    featured INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    auction_url TEXT
  )`);

  await db.run(sql`CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1
  )`);

  await db.run(sql`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    status TEXT NOT NULL DEFAULT 'PENDING',
    items TEXT NOT NULL,
    sub_total_cents INTEGER NOT NULL,
    shipping_cents INTEGER NOT NULL,
    tax_cents INTEGER NOT NULL,
    total_cents INTEGER NOT NULL,
    shipping_address TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )`);
}

async function seedData(db: Db) {
  // Clear existing data (order matters for foreign keys)
  await db.delete(schema.cartItems);
  await db.delete(schema.orders);
  await db.delete(schema.products);
  await db.delete(schema.users);

  // Seed users
  await db.insert(schema.users).values([
    {
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "customer",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    },
    {
      name: "Bob Smith",
      email: "bob@example.com",
      role: "customer",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    },
    {
      name: "Admin User",
      email: "admin@example.com",
      role: "admin",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    },
  ]);

  // Seed products
  await db.insert(schema.products).values([
    // Electronics
    {
      title: "Wireless Noise-Cancelling Headphones",
      slug: "wireless-noise-cancelling-headphones",
      description:
        "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and ultra-comfortable memory foam ear cushions. Perfect for travel, work, or immersive listening.",
      priceCents: 7999,
      compareAtPriceCents: 9999,
      category: "Electronics",
      imageUrl:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
      stock: 25,
      featured: true,
      status: "ACTIVE",
    },
    {
      title: "Smart Fitness Watch",
      slug: "smart-fitness-watch",
      description:
        "Track your health and fitness with this advanced smartwatch featuring heart rate monitoring, GPS, sleep tracking, and 7-day battery life. Water-resistant to 50 meters.",
      priceCents: 12999,
      category: "Electronics",
      imageUrl:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
      stock: 15,
      featured: true,
      status: "ACTIVE",
    },
    {
      title: "Portable Bluetooth Speaker",
      slug: "portable-bluetooth-speaker",
      description:
        "Compact yet powerful speaker with 360-degree sound, IPX7 waterproof rating, and 12-hour playtime. Take your music anywhere.",
      priceCents: 4999,
      category: "Electronics",
      imageUrl:
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
      stock: 40,
      status: "ACTIVE",
    },
    {
      title: "USB-C Hub 7-in-1",
      slug: "usb-c-hub-7-in-1",
      description:
        "Expand your laptop's connectivity with HDMI 4K, USB 3.0, SD card reader, and 100W power delivery pass-through. Sleek aluminum design.",
      priceCents: 3499,
      category: "Electronics",
      imageUrl:
        "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&q=80",
      stock: 60,
      status: "ACTIVE",
    },
    // Clothing
    {
      title: "Classic Denim Jacket",
      slug: "classic-denim-jacket",
      description:
        "Timeless medium-wash denim jacket with a modern slim fit. Features brass buttons, chest pockets, and adjustable waist tabs. A wardrobe essential.",
      priceCents: 8999,
      compareAtPriceCents: 11999,
      category: "Clothing",
      imageUrl:
        "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80",
      stock: 20,
      featured: true,
      status: "ACTIVE",
    },
    {
      title: "Merino Wool Crew Sweater",
      slug: "merino-wool-crew-sweater",
      description:
        "Luxuriously soft 100% merino wool sweater. Naturally temperature-regulating, moisture-wicking, and odor-resistant. Available in multiple colors.",
      priceCents: 6999,
      category: "Clothing",
      imageUrl:
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
      stock: 30,
      status: "ACTIVE",
    },
    {
      title: "Performance Running Tee",
      slug: "performance-running-tee",
      description:
        "Lightweight, breathable running shirt with moisture-wicking fabric and reflective details. Flatlock seams prevent chafing during long runs.",
      priceCents: 3499,
      category: "Clothing",
      imageUrl:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
      stock: 50,
      status: "ACTIVE",
    },
    {
      title: "Minimalist Leather Sneakers",
      slug: "minimalist-leather-sneakers",
      description:
        "Clean, versatile leather sneakers with a cushioned insole and durable rubber outsole. Pairs perfectly with casual or smart-casual outfits.",
      priceCents: 9999,
      category: "Clothing",
      imageUrl:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
      stock: 18,
      featured: true,
      status: "ACTIVE",
    },
    // Home & Kitchen
    {
      title: "Pour-Over Coffee Maker",
      slug: "pour-over-coffee-maker",
      description:
        "Elegant glass pour-over coffee maker with reusable stainless steel filter. Brews 4 cups of perfectly extracted coffee every time.",
      priceCents: 3999,
      category: "Home & Kitchen",
      imageUrl:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
      stock: 35,
      status: "ACTIVE",
    },
    {
      title: "Bamboo Cutting Board Set",
      slug: "bamboo-cutting-board-set",
      description:
        "Set of 3 premium bamboo cutting boards in different sizes. Naturally antimicrobial, knife-friendly, and built to last.",
      priceCents: 2999,
      category: "Home & Kitchen",
      imageUrl:
        "https://images.unsplash.com/photo-1594226801341-41427b4e5c22?w=600&q=80",
      stock: 45,
      status: "ACTIVE",
    },
    {
      title: "Soy Wax Candle Collection",
      slug: "soy-wax-candle-collection",
      description:
        "Hand-poured soy wax candles in 3 calming scents: lavender fields, vanilla bean, and ocean breeze. 40-hour burn time each.",
      priceCents: 2499,
      compareAtPriceCents: 3499,
      category: "Home & Kitchen",
      imageUrl:
        "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&q=80",
      stock: 55,
      status: "ACTIVE",
    },
    {
      title: "Cast Iron Skillet 12-inch",
      slug: "cast-iron-skillet-12-inch",
      description:
        "Pre-seasoned cast iron skillet perfect for searing, baking, and frying. Distributes heat evenly and improves with every use.",
      priceCents: 4499,
      category: "Home & Kitchen",
      imageUrl:
        "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80",
      stock: 22,
      status: "ACTIVE",
    },
    // Accessories
    {
      title: "Leather Bifold Wallet",
      slug: "leather-bifold-wallet",
      description:
        "Handcrafted full-grain leather wallet with RFID blocking. Features 8 card slots, 2 bill compartments, and a slim profile.",
      priceCents: 4999,
      category: "Accessories",
      imageUrl:
        "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80",
      stock: 28,
      status: "ACTIVE",
    },
    {
      title: "Polarized Aviator Sunglasses",
      slug: "polarized-aviator-sunglasses",
      description:
        "Classic aviator frames with polarized UV400 lenses. Lightweight titanium frame with adjustable nose pads for a perfect fit.",
      priceCents: 5999,
      compareAtPriceCents: 7999,
      category: "Accessories",
      imageUrl:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80",
      stock: 32,
      status: "ACTIVE",
    },
    {
      title: "Canvas Daypack",
      slug: "canvas-daypack",
      description:
        "Durable waxed canvas backpack with padded laptop sleeve, multiple organizer pockets, and comfortable padded straps. 25L capacity.",
      priceCents: 6999,
      category: "Accessories",
      imageUrl:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
      stock: 20,
      status: "ACTIVE",
    },
    {
      title: "Insulated Water Bottle",
      slug: "insulated-water-bottle",
      description:
        "Double-wall vacuum insulated stainless steel bottle. Keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, 750ml capacity.",
      priceCents: 2999,
      category: "Accessories",
      imageUrl:
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
      stock: 70,
      status: "ACTIVE",
    },
  ]);
}

async function main() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  let db: Db;
  let cleanup: (() => void) | undefined;

  if (tursoUrl) {
    const { createClient } = await import("@libsql/client");
    const { drizzle } = await import("drizzle-orm/libsql");
    const client = createClient({ url: tursoUrl, authToken: tursoToken });
    db = drizzle(client, { schema }) as Db;
    console.log(`Seeding Turso database: ${tursoUrl}`);
  } else {
    const betterSqlite3 = await import("better-sqlite3");
    const Database = (
      "default" in betterSqlite3 ? betterSqlite3.default : betterSqlite3
    ) as typeof import("better-sqlite3");
    const { drizzle } = await import("drizzle-orm/better-sqlite3");
    const path = await import("node:path");
    const fs = await import("node:fs");

    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    const dbPath = path.join(dataDir, "store.db");
    const sqlite = new Database(dbPath);
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");
    db = drizzle(sqlite, { schema }) as Db;
    cleanup = () => {
      console.log(`Database location: ${dbPath}`);
      sqlite.close();
    };
    console.log(`Seeding local database: ${dbPath}`);
  }

  await createTables(db);
  await seedData(db);

  console.log("Database seeded successfully!");
  cleanup?.();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
