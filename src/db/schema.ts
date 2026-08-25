import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

//To use MySQL instead, comment out the Postgres table above and uncomment
//this (also switch src/db/index.ts and drizzle.config.ts to MySQL).
// import { mysqlTable, int, varchar, timestamp as mysqlTimestamp } from "drizzle-orm/mysql-core";

// export const users = mysqlTable("users", {
//   id: int("id").autoincrement().primaryKey(),
//   name: varchar("name", { length: 255 }).notNull(),
//   email: varchar("email", { length: 255 }).notNull().unique(),
//   createdAt: mysqlTimestamp("created_at").notNull().defaultNow(),
// });
