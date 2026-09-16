import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import path from "path"
import react from "@vitejs/plugin-react"

export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			// Thay thế __dirname bằng import.meta.dirname
			"@": path.resolve(import.meta.dirname, "./src"),
		},
	},
})
