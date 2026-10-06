import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";

function createDbAdapter() {
  let host = process.env.DATABASE_HOST;
  let port = Number(process.env.DATABASE_PORT) || 4000;
  let user = process.env.DATABASE_USER;
  let password = process.env.DATABASE_PASSWORD;
  let database = process.env.DATABASE_NAME;

  if (process.env.DATABASE_URL) {
    try {
      const parsed = new URL(process.env.DATABASE_URL.replace(/^mysql:\/\//, "http://"));
      host = parsed.hostname;
      port = Number(parsed.port) || 4000;
      user = decodeURIComponent(parsed.username);
      password = decodeURIComponent(parsed.password);
      database = parsed.pathname.replace(/^\//, "");
    } catch {
      // ignore parse error and fallback to individual vars
    }
  }

  if (!host || !user || !database) {
    throw new Error(
      "Database configuration is missing. Please set DATABASE_URL (or DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME) in Render environment variables."
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