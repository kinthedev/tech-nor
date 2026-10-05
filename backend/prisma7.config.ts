import { defineConfig } from "prisma/config"

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        // Gọi thẳng biến môi trường của hệ thống Render (process.env) 
        // thay vì dùng thư viện đọc file
        url: process.env.DATABASE_URL as string, 
    },
})