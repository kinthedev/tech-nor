import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";

function clean(val?: string) {
  if (!val) return undefined;
  return val.trim().replace(/^["']|["']$/g, "").trim();
}
console.log("=== DATABASE ENV DEBUG ===");

console.log({
  DATABASE_URL: Boolean(process.env.DATABASE_URL),
  DATABASE_HOST: Boolean(process.env.DATABASE_HOST),
  DATABASE_NAME: Boolean(process.env.DATABASE_NAME),
  DATABASE_USER: Boolean(process.env.DATABASE_USER),
  DATABASE_PASSWORD: Boolean(process.env.DATABASE_PASSWORD),
  DATABASE_PORT: Boolean(process.env.DATABASE_PORT),
});
function createDbAdapter() {
  // Đọc trực tiếp từ biến môi trường hệ thống của Render
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
      console.warn("Không thể parse DATABASE_URL, dùng các biến rời:", e);
    }
  }

  if (!host || !user || !database) {
    const receivedKeys = Object.keys(process.env).filter(
      (k) => !k.startsWith("npm_") && !k.startsWith("NODE_")
    );
    throw new Error(
      `Database configuration is missing!\n` +
      `  • Render Service Name đang chạy: "${process.env.RENDER_SERVICE_NAME || "UNKNOWN"}"\n` +
      `  • Render Service ID: "${process.env.RENDER_SERVICE_ID || "UNKNOWN"}"\n` +
      `  • Các biến môi trường Node nhận được từ Render: [${receivedKeys.join(", ")}]\n` +
      `  • Cảnh báo: Biến DATABASE_URL hoặc (DATABASE_HOST, DATABASE_USER, DATABASE_NAME) chưa có trong Service "${process.env.RENDER_SERVICE_NAME || "này"}"!`
    );
  }

  return new PrismaMariaDb({
    host,
    port,
    user,
    password: password || "",
    database,
    ssl: {
      rejectUnauthorized: true, // TiDB Cloud bắt buộc bật SSL
    },
    connectTimeout: 15000,
  });
}

const adapter = createDbAdapter();
export const prisma = new PrismaClient({ adapter });