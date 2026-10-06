import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";

function clean(val?: string) {
  if (!val) return undefined;
  return val.trim().replace(/^["']|["']$/g, "").trim();
}

function createDbAdapter() {
  const rawUrl = clean(process.env.DATABASE_URL);
  let host = clean(process.env.DATABASE_HOST);
  let port = Number(clean(process.env.DATABASE_PORT)) || 4000;
  let user = clean(process.env.DATABASE_USER);
  let password = clean(process.env.DATABASE_PASSWORD);
  let database = clean(process.env.DATABASE_NAME);

  if (rawUrl) {
    try {
      const urlToParse = rawUrl.replace(/^mysql:\/\//, "http://").replace(/^mariadb:\/\//, "http://");
      const parsed = new URL(urlToParse);
      host = parsed.hostname;
      port = Number(parsed.port) || 4000;
      user = decodeURIComponent(parsed.username);
      password = decodeURIComponent(parsed.password);
      database = parsed.pathname.replace(/^\//, "");
    } catch (e) {
      console.warn("Could not parse DATABASE_URL, falling back to individual variables:", e);
    }
  }

  console.log("DB connection params:", {
    host: host ? "✓ present" : "✗ missing",
    port,
    user: user ? "✓ present" : "✗ missing",
    database: database ? "✓ present" : "✗ missing",
  });

  if (!host || !user || !database) {
    throw new Error(
      "Database configuration is missing. Please ensure DATABASE_URL or (DATABASE_HOST, DATABASE_USER, DATABASE_NAME) are properly set in Render Environment Variables."
    );
  }

  return new PrismaMariaDb({
    host,
    port,
    user,
    password: password || "",
    database,
    ssl: {
      rejectUnauthorized: true,
    },
    connectTimeout: 15000,
  });
}

const adapter = createDbAdapter();
export const prisma = new PrismaClient({ adapter });