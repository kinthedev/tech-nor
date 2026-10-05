export interface User {
	id?: number
	email: string
	password?: string | null // null nếu tài khoản chỉ đăng nhập bằng Google
	name?: string | null
	address?: string | null
	role?: string
	googleId?: string | null
	avatar?: string | null
	provider?: string
}
