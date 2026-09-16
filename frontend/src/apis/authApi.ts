import axiosInstance from "../config/axios"
import { type LoginDTO, type User } from "../types/auth.type"
export const authApi = {
	login: async (credentials: LoginDTO): Promise<User | null> => {
		const response = await axiosInstance.post<User>("/auth/login", credentials)
		return response.data
	},
}
