import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});

// To use MySQL instead, comment out the config above and uncomment this one
// (also update DATABASE_URL in .env and see src/db/index.ts / src/db/schema.ts).
// export default defineConfig({
//   out: "./drizzle",
//   schema: "./src/db/schema.ts",
//   dialect: "mysql",
//   dbCredentials: {
//     url: process.env.DATABASE_URL,
//   },
// });
