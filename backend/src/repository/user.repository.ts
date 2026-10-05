import { prisma } from "../../lib/prisma"
import { type User } from "../models/user.model"

export const userRepository = {
	findUser: async (email: string): Promise<User | null> => {
		const user = await prisma.user.findUnique({
			where: { email: email },
		})
		if (!user) return null
		return user
	},

	findById: async (id: number): Promise<User | null> => {
		const user = await prisma.user.findUnique({
			where: { id },
		})
		if (!user) return null
		return user
	},

	createUser: async (data: {
		email: string
		password: string
		name?: string | undefined
		address?: string | undefined
		role?: string | undefined
	}): Promise<User> => {
		return await prisma.user.create({
			data: {
				email: data.email,
				password: data.password,
				name: data.name || null,
				address: data.address || null,
				role: data.role || "USER",
			},
		})
	},

	findAllUser: async (): Promise<User[]> => {
		return await prisma.user.findMany()
	},

	// ===== Google Login =====

	// SELECT * FROM users WHERE googleId = ? LIMIT 1
	findByGoogleId: async (googleId: string): Promise<User | null> => {
		return await prisma.user.findUnique({
			where: { googleId },
		})
	},

	// INSERT INTO users (email, name, avatar, googleId, provider, role, password) VALUES (...)
	createGoogleUser: async (data: {
		email: string
		name: string | null
		avatar: string | null
		googleId: string
	}): Promise<User> => {
		return await prisma.user.create({
			data: {
				email: data.email,
				name: data.name,
				avatar: data.avatar,
				googleId: data.googleId,
				provider: "GOOGLE",
				role: "USER", // user Google mới luôn là USER
				password: null, // không có mật khẩu
			},
		})
	},

	// UPDATE users SET googleId = ?, avatar = ?, provider = ? WHERE id = ?
	linkGoogleAccount: async (
		id: number,
		data: { googleId: string; avatar: string | null; provider: string },
	): Promise<User> => {
		return await prisma.user.update({
			where: { id },
			data,
		})
	},
}

