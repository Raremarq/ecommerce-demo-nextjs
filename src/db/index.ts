import { type BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import * as schema from "./schema";

type Db = BaseSQLiteDatabase<"sync" | "async", unknown, typeof schema>;

let _db: Db | null = null;

function getDb(): Db {
  if (!_db) {
    const tursoUrl = process.env.TURSO_DATABASE_URL;
    const tursoToken = process.env.TURSO_AUTH_TOKEN;

    if (tursoUrl) {
      // Production / hosted: use Turso (libsql)
      const { createClient } = require("@libsql/client");
      const { drizzle } = require("drizzle-orm/libsql");
      const client = createClient({
        url: tursoUrl,
        authToken: tursoToken,
      });
      _db = drizzle(client, { schema }) as Db;
    } else {
      // Local development: use SQLite file
      const Database = require("better-sqlite3");
      const { drizzle } = require("drizzle-orm/better-sqlite3");
      const fs = require("node:fs");
      const path = require("node:path");

      const dbPath = path.join(process.cwd(), "data", "store.db");
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
      const sqlite = new Database(dbPath);
      sqlite.pragma("journal_mode = WAL");
      sqlite.pragma("foreign_keys = ON");
      _db = drizzle(sqlite, { schema }) as Db;
    }
  }
  return _db;
}

export const db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    const realDb = getDb();
    const value = Reflect.get(realDb, prop, receiver);
    return typeof value === "function" ? value.bind(realDb) : value;
  },
});
