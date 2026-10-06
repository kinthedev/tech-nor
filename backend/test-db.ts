import { prisma } from "./lib/prisma"; // Đổi đường dẫn đúng tới file prisma trong src của bạn
console.log("=== DATABASE ENV DEBUG ===");

console.log({
  DATABASE_URL: Boolean(process.env.DATABASE_URL),
  DATABASE_HOST: Boolean(process.env.DATABASE_HOST),
  DATABASE_NAME: Boolean(process.env.DATABASE_NAME),
  DATABASE_USER: Boolean(process.env.DATABASE_USER),
  DATABASE_PASSWORD: Boolean(process.env.DATABASE_PASSWORD),
  DATABASE_PORT: Boolean(process.env.DATABASE_PORT),
});
async function main() {
  console.log("Đang thử kết nối tới TiDB Cloud...");
  try {
    const products = await prisma.product.findMany({ take: 3 });
    console.log(" Kết nối thành công rực rỡ!");
    console.log("Dữ liệu lấy được:", products);
  } catch (error) {
    console.error(" Kết nối thất bại. Lỗi chi tiết:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

main();