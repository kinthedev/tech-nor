// src/routes/index.ts
import { Router } from "express"
import authRouter from "./auth.route"

import productRouter from "./product.route"
// import userRouter from "./user.route"
// import productRouter from "./product.route"; // Ví dụ sau này có thêm route khác

const rootRouter = Router()

// Định nghĩa tiền tố API và gắn từng route con vào
rootRouter.use("/auth", authRouter) // Mọi route trong authRouter sẽ có dạng: /api/v1/auth/...
// rootRouter.use("/users", userRouter) // Mọi route trong userRouter sẽ có dạng: /api/v1/users/...
// rootRouter.use("/products", productRouter);
rootRouter.use("/products", productRouter)
export default rootRouter
