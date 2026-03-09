import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	role: text("role", { enum: ["customer", "admin"] })
		.notNull()
		.default("customer"),
	avatarUrl: text("avatar_url"),
});

export const products = sqliteTable("products", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	title: text("title").notNull(),
	slug: text("slug").notNull().unique(),
	description: text("description").notNull(),
	priceCents: integer("price_cents").notNull(),
	compareAtPriceCents: integer("compare_at_price_cents"),
	category: text("category").notNull(),
	imageUrl: text("image_url").notNull(),
	stock: integer("stock").notNull().default(0),
	featured: integer("featured", { mode: "boolean" }).default(false),
	status: text("status", { enum: ["ACTIVE", "DRAFT", "ARCHIVED"] })
		.notNull()
		.default("ACTIVE"),
});

export const cartItems = sqliteTable("cart_items", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id),
	productId: integer("product_id")
		.notNull()
		.references(() => products.id),
	quantity: integer("quantity").notNull().default(1),
});

export const orders = sqliteTable("orders", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id),
	status: text("status", {
		enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"],
	})
		.notNull()
		.default("PENDING"),
	items: text("items", { mode: "json" }).notNull().$type<
		Array<{
			productId: number;
			title: string;
			priceCents: number;
			quantity: number;
			imageUrl: string;
		}>
	>(),
	subTotalCents: integer("sub_total_cents").notNull(),
	shippingCents: integer("shipping_cents").notNull(),
	taxCents: integer("tax_cents").notNull(),
	totalCents: integer("total_cents").notNull(),
	shippingAddress: text("shipping_address", { mode: "json" }).notNull().$type<{
		fullName: string;
		line1: string;
		line2?: string;
		city: string;
		state: string;
		zip: string;
		country: string;
	}>(),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
