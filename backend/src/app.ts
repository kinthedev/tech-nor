import express, { type Request, type Response } from "express"
import rootRouter from "./routes/index"
import cors from "cors"
const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors())
app.get("/", (req: Request, res: Response) => {
	res.send("Server đang chạy bình thường!")
})
app.use("/api/v1", rootRouter)
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})
