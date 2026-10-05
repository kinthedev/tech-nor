import { authService } from "../services/auth.service"
import { type Request, type Response } from "express"

export const authController = {
	login: async (req: Request, res: Response): Promise<void> => {
		try {
			const identifier = req.body.email || req.body.username
			const { password } = req.body

			if (!identifier || !password) {
				res.status(400).json({
					success: false,
					message: "Vui lòng nhập đầy đủ email/username và mật khẩu",
				})
				return
			}

			const user = await authService.login(identifier, password)
			res.status(200).json({
				success: true,
				data: user,
				user: user,
				role: user.role,
				message: "Đăng nhập thành công",
			})
		} catch (error: any) {
			res.status(401).json({
				success: false,
				message: error.message || "Đăng nhập thất bại",
			})
		}
	},

	// POST /api/v1/auth/google   body: { credential: "<ID token JWT từ Google>" }
	google: async (req: Request, res: Response): Promise<void> => {
		try {
			const { credential } = req.body
			if (!credential || typeof credential !== "string") {
				res.status(400).json({ success: false, message: "Thiếu credential từ Google" })
				return
			}

			const user = await authService.googleLogin(credential)
			res.status(200).json({
				success: true,
				data: user,
				user: user,
				role: user.role,
				message: "Đăng nhập Google thành công",
			})
		} catch (error: any) {
			res.status(401).json({
				success: false,
				message: error.message || "Đăng nhập Google thất bại",
			})
		}
	},

	register: async (req: Request, res: Response): Promise<void> => {
		try {
			const { email, password, name, address, role } = req.body
			if (!email || !password) {
				res.status(400).json({
					success: false,
					message: "Vui lòng cung cấp email và mật khẩu",
				})
				return
			}

			const newUser = await authService.register({
				email,
				password,
				name,
				address,
				role: role || "USER",
			})

			res.status(201).json({
				success: true,
				data: newUser,
				user: newUser,
				role: newUser.role,
				message: "Đăng ký tài khoản thành công",
			})
		} catch (error: any) {
			res.status(400).json({
				success: false,
				message: error.message || "Đăng ký thất bại",
			})
		}
	},

	me: async (req: Request, res: Response): Promise<void> => {
		try {
			const id = Number(req.query.id || 1)
			const user = await authService.getProfile(id)
			res.status(200).json({
				success: true,
				data: user,
			})
		} catch (error: any) {
			res.status(404).json({
				success: false,
				message: error.message || "Không tìm thấy người dùng",
			})
		}
	},
}
