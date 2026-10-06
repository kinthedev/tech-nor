import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";

function createDbAdapter() {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    throw new Error("DATABASE_URL is not defined in environment variables");
  }

  const parsed = new URL(rawUrl.replace(/^mysql:\/\//, "http://"));

  return new PrismaMariaDb({
    host: parsed.hostname,
    port: Number(parsed.port) || 4000,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ""),
    ssl: {
      rejectUnauthorized: true,
    },
    connectTimeout: 15000,
  });
}

const adapter = createDbAdapter();
export const prisma = new PrismaClient({ adapter });