import express, { type Request, type Response } from "express"
import rootRouter from "./routes/index.js"
import cors from "cors"
import path from "path"
const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors())
const publicPath = path.resolve(process.cwd(), "public")
app.use(express.static(publicPath))
app.use("/uploads", express.static(path.join(publicPath, "uploads")))
app.get("/", (req: Request, res: Response) => {
	res.send("Server đang chạy bình thường!")
})
app.use("/api/v1", rootRouter)

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})
