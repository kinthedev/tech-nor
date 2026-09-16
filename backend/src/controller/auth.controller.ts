import { authService } from "../services/auth.service"
import { type Request, type Response } from "express"
export const authController = {
	login: async (req: Request, res: Response): Promise<void> => {
		try {
			const { email, password } = req.body
			if (!email || !password) {
				res.status(400).json({
					success: false,
					message: "Please enter email or password",
				})
				return
			}
			const result = await authService.login(email, password)
			res.status(200).json({
				success: true,
				data: result,
			})
		} catch (error: any) {
			res.status(401).json({
				success: false,
				message: error.message,
			})
		}
	},
}
