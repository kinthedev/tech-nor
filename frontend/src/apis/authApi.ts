import axiosInstance from "../config/axios"
import type { UserProfile } from "../models/AuthSlice"

export interface LoginDTO {
	email?: string
	username?: string
	password?: string
}

export const authApi = {
	login: async (credentials: LoginDTO): Promise<UserProfile | null> => {
		const response = await axiosInstance.post<UserProfile>(
			"/auth/login",
			credentials,
		)
		return response.data
	},
}
