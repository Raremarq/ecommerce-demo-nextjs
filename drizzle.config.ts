import { defineConfig } from "drizzle-kit";

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

export default tursoUrl
  ? defineConfig({
      schema: "./src/db/schema.ts",
      out: "./drizzle",
      dialect: "turso",
      dbCredentials: {
        url: tursoUrl,
        authToken: tursoToken,
      },
    })
  : defineConfig({
      schema: "./src/db/schema.ts",
      out: "./drizzle",
      dialect: "sqlite",
      dbCredentials: {
        url: "./data/store.db",
      },
    });
