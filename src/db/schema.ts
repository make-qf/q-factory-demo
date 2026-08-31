/*
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
*/

//To use MySQL instead, comment out the Postgres table above and uncomment
//this (also switch src/db/index.ts and drizzle.config.ts to MySQL).
import { mysqlTable, int, varchar, timestamp as mysqlTimestamp } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: mysqlTimestamp("created_at").notNull().defaultNow(),
});

export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  content: varchar("content", { length: 255 }).notNull(),
  createdAt: mysqlTimestamp("created_at").notNull().defaultNow(),
  updatedAt: mysqlTimestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
