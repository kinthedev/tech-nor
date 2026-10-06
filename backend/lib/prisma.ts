import "dotenv/config";
import mariadb from "mariadb";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";

function createDbPool() {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    throw new Error("DATABASE_URL is not defined in environment variables");
  }

  const parsed = new URL(rawUrl.replace(/^mysql:\/\//, "http://"));

  return mariadb.createPool({
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

const pool = createDbPool();
const adapter = new PrismaMariaDb(pool);
export const prisma = new PrismaClient({ adapter });