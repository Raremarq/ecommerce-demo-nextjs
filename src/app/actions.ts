"use server";

import { db } from "@/db";
import { users, products, cartItems, orders } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ── Users ──

export async function getUsers() {
  return db.select().from(users).all();
}

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user ?? null;
}

export async function getUserById(id: number) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user ?? null;
}

// ── Products ──

export async function getProducts(category?: string) {
  if (category) {
    return db
      .select()
      .from(products)
      .where(and(eq(products.status, "ACTIVE"), eq(products.category, category)))
      .all();
  }
  return db.select().from(products).where(eq(products.status, "ACTIVE")).all();
}

export async function getAllProducts() {
  return db.select().from(products).all();
}

export async function getProductBySlug(slug: string) {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug));
  return product ?? null;
}

export async function getProductById(id: number) {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, id));
  return product ?? null;
}

export async function getFeaturedProducts() {
  return db
    .select()
    .from(products)
    .where(and(eq(products.status, "ACTIVE"), eq(products.featured, true)))
    .all();
}

export async function getCategories() {
  const rows = await db
    .selectDistinct({ category: products.category })
    .from(products)
    .where(eq(products.status, "ACTIVE"));
  return rows.map((r) => r.category);
}

export async function createProduct(data: {
  title: string;
  slug: string;
  description: string;
  priceCents: number;
  compareAtPriceCents?: number;
  category: string;
  imageUrl: string;
  stock: number;
  featured?: boolean;
  status?: "ACTIVE" | "DRAFT" | "ARCHIVED";
}) {
  db.insert(products).values(data).run();
  revalidatePath("/admin");
  revalidatePath("/products");
}

export async function updateProduct(
  id: number,
  data: Partial<{
    title: string;
    slug: string;
    description: string;
    priceCents: number;
    compareAtPriceCents: number | null;
    category: string;
    imageUrl: string;
    stock: number;
    featured: boolean;
    status: "ACTIVE" | "DRAFT" | "ARCHIVED";
  }>
) {
  db.update(products).set(data).where(eq(products.id, id)).run();
  revalidatePath("/admin");
  revalidatePath("/products");
}

// ── Cart ──

export async function getCartItems(userId: number) {
  return db
    .select({
      id: cartItems.id,
      quantity: cartItems.quantity,
      product: {
        id: products.id,
        title: products.title,
        slug: products.slug,
        priceCents: products.priceCents,
        imageUrl: products.imageUrl,
        stock: products.stock,
      },
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId))
    .all();
}

export async function getCartCount(userId: number) {
  const [result] = await db
    .select({ total: sql<number>`COALESCE(SUM(${cartItems.quantity}), 0)` })
    .from(cartItems)
    .where(eq(cartItems.userId, userId));
  return result?.total ?? 0;
}

export async function addToCart(
  userId: number,
  productId: number,
  quantity: number = 1
) {
  const [existing] = await db
    .select()
    .from(cartItems)
    .where(
      and(eq(cartItems.userId, userId), eq(cartItems.productId, productId))
    );

  if (existing) {
    db.update(cartItems)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItems.id, existing.id))
      .run();
  } else {
    db.insert(cartItems).values({ userId, productId, quantity }).run();
  }
  revalidatePath("/cart");
}

export async function updateCartItemQuantity(id: number, quantity: number) {
  if (quantity <= 0) {
    db.delete(cartItems).where(eq(cartItems.id, id)).run();
  } else {
    db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id)).run();
  }
  revalidatePath("/cart");
}

export async function removeCartItem(id: number) {
  db.delete(cartItems).where(eq(cartItems.id, id)).run();
  revalidatePath("/cart");
}

export async function clearCart(userId: number) {
  db.delete(cartItems).where(eq(cartItems.userId, userId)).run();
  revalidatePath("/cart");
}

// ── Orders ──

export async function createOrder(
  userId: number,
  shippingAddress: {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }
) {
  const items = await getCartItems(userId);
  if (items.length === 0) throw new Error("Cart is empty");

  const subTotalCents = items.reduce(
    (sum, item) => sum + item.product.priceCents * item.quantity,
    0
  );
  const shippingCents = 599;
  const taxCents = Math.round(subTotalCents * 0.08);
  const totalCents = subTotalCents + shippingCents + taxCents;

  const orderItems = items.map((item) => ({
    productId: item.product.id,
    title: item.product.title,
    priceCents: item.product.priceCents,
    quantity: item.quantity,
    imageUrl: item.product.imageUrl,
  }));

  // Decrement stock
  for (const item of items) {
    db.update(products)
      .set({ stock: sql`${products.stock} - ${item.quantity}` })
      .where(eq(products.id, item.product.id))
      .run();
  }

  const result = db
    .insert(orders)
    .values({
      userId,
      status: "CONFIRMED",
      items: orderItems,
      subTotalCents,
      shippingCents,
      taxCents,
      totalCents,
      shippingAddress,
      createdAt: new Date(),
    })
    .returning()
    .all();
  const order = result[0];

  // Clear cart
  db.delete(cartItems).where(eq(cartItems.userId, userId)).run();
  revalidatePath("/cart");
  revalidatePath("/account");

  return order;
}

export async function getOrdersByUserId(userId: number) {
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(sql`${orders.createdAt} DESC`)
    .all();
}

export async function getOrderById(id: number) {
  const [order] = await db.select().from(orders).where(eq(orders.id, id));
  return order ?? null;
}
