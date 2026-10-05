import { Router } from "express"
import { authController } from "../controller/auth.controller"

const authRouter = Router()

authRouter.post("/login", authController.login)
authRouter.post("/register", authController.register)
authRouter.post("/google", authController.google)
authRouter.get("/me", authController.me)

export default authRouter
