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
}
