import { userRepository } from "../repository/user.repository"
import { type User } from "../models/user.model"
export const authService = {
	login: async (userEmail: string, userPassword: string) => {
		const user = await userRepository.findUser(userEmail)

		if (!user) {
			throw new Error("User not found")
		}
		if (userPassword != user.password) {
			throw new Error("Email or password is incorrect")
		}

		const { password, ...userWithoutPassword } = user
		return userWithoutPassword
	},
}
