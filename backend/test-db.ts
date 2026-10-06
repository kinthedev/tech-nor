import { prisma } from "./lib/prisma"; // Đổi đường dẫn đúng tới file prisma trong src của bạn

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