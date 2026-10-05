import { OAuth2Client } from "google-auth-library"
import { userRepository } from "../repository/user.repository"

// Tạo 1 lần dùng chung: client này cache public key của Google để verify token nhanh hơn
const googleClient = new OAuth2Client()

export const authService = {
	login: async (identifier: string, userPassword: string) => {
		// Tìm theo email
		let user = await userRepository.findUser(identifier)

		// Nếu không tìm thấy bằng email, thử tìm user đầu tiên có email chứa identifier hoặc name khớp
		if (!user) {
			const all = await userRepository.findAllUser()
			user =
				all.find(
					(u) =>
						u.email.toLowerCase() === identifier.toLowerCase() ||
						(u.name && u.name.toLowerCase() === identifier.toLowerCase()),
				) || null
		}

		if (!user) {
			throw new Error("Không tìm thấy tài khoản người dùng")
		}

		// Tài khoản tạo bằng Google không có mật khẩu -> không cho đăng nhập bằng form
		if (!user.password) {
			throw new Error(
				"Tài khoản này được tạo bằng Google. Vui lòng bấm 'Đăng nhập với Google'",
			)
		}

		if (userPassword !== user.password) {
			throw new Error("Mật khẩu không chính xác")
		}

		const { password, ...userWithoutPassword } = user
		return userWithoutPassword
	},

	/**
	 * Đăng nhập bằng Google.
	 * @param credential  ID token (JWT) mà Google trả cho frontend sau khi user chọn tài khoản Gmail
	 */
	googleLogin: async (credential: string) => {
		const clientId = process.env.GOOGLE_CLIENT_ID
		if (!clientId) {
			throw new Error("Server chưa cấu hình GOOGLE_CLIENT_ID trong file .env")
		}

		// 1. XÁC MINH TOKEN với Google:
		//    - kiểm tra chữ ký JWT bằng public key của Google (tự tải & cache từ googleapis.com)
		//    - kiểm tra token chưa hết hạn (exp), đúng issuer (accounts.google.com)
		//    - kiểm tra "aud" = clientId của CHÍNH app mình (chống dùng token của app khác)
		const ticket = await googleClient
			.verifyIdToken({ idToken: credential, audience: clientId })
			.catch(() => {
				throw new Error("Token Google không hợp lệ hoặc đã hết hạn")
			})

		const payload = ticket.getPayload()
		if (!payload || !payload.email || !payload.sub) {
			throw new Error("Không lấy được thông tin tài khoản Google")
		}
		if (!payload.email_verified) {
			throw new Error("Email Google chưa được xác minh")
		}

		const googleId = payload.sub // ID duy nhất & vĩnh viễn của tài khoản Google
		const email = payload.email
		const name = payload.name || email.split("@")[0] || null
		const avatar = payload.picture || null

		// 2. TÌM HOẶC TẠO USER trong MySQL
		// 2a. Đã từng đăng nhập Google -> tìm theo googleId
		let user = await userRepository.findByGoogleId(googleId)

		if (!user) {
			// 2b. Chưa có googleId, nhưng email đã đăng ký bằng form -> LIÊN KẾT tài khoản
			const existing = await userRepository.findUser(email)
			if (existing && existing.id) {
				user = await userRepository.linkGoogleAccount(existing.id, {
					googleId,
					avatar: existing.avatar || avatar,
					provider: existing.password ? "LOCAL_GOOGLE" : "GOOGLE",
				})
			} else {
				// 2c. Hoàn toàn mới -> tạo user mới, role USER, không mật khẩu
				user = await userRepository.createGoogleUser({ email, name, avatar, googleId })
			}
		}

		// 3. Trả user (bỏ password) giống hệt API /login thường để frontend xử lý chung
		const { password, ...userWithoutPassword } = user
		return userWithoutPassword
	},

	register: async (data: {
		email: string
		password: string
		name?: string | undefined
		address?: string | undefined
		role?: string | undefined
	}) => {
		const existingUser = await userRepository.findUser(data.email)
		if (existingUser) {
			throw new Error("Email đã được đăng ký trong hệ thống")
		}

		const newUser = await userRepository.createUser({
			email: data.email,
			password: data.password,
			name: data.name || data.email.split("@")[0],
			address: data.address || "",
			role: data.role || "USER",
		})

		const { password, ...userWithoutPassword } = newUser
		return userWithoutPassword
	},

	getProfile: async (id: number) => {
		const user = await userRepository.findById(id)
		if (!user) {
			throw new Error("Không tìm thấy thông tin tài khoản")
		}
		const { password, ...userWithoutPassword } = user
		return userWithoutPassword
	},
}
