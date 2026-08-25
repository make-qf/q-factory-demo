import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

// To use MySQL instead, comment out the Postgres setup above and uncomment
// this (also switch schema.ts to mysql-core and update DATABASE_URL/drizzle.config.ts).
//  import { drizzle } from "drizzle-orm/mysql2";
//  import * as schema from "./schema";
//  import mysql from "mysql2/promise";
//  if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL is not set");
// }
//  const connection = mysql.createPool(process.env.DATABASE_URL);
//  export const db = drizzle(connection, { schema, mode: "default" });
