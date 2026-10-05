import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { type AuthSlice, type UserProfile } from "../../models/AuthSlice"

const storedUserStr = localStorage.getItem("user")
let storedUser: UserProfile | null = null
if (storedUserStr) {
	try {
		storedUser = JSON.parse(storedUserStr)
	} catch (e) {
		storedUser = null
	}
}

const storedRole = localStorage.getItem("role") || storedUser?.role || "USER"
const storedUsername =
	localStorage.getItem("username") || storedUser?.name || storedUser?.email || ""

const initialState: AuthSlice = {
	isLoggedIn: !!storedUsername,
	modalOpen: false,
	username: storedUsername,
	role: storedRole,
	user: storedUser,
}

export const authSlice = createSlice({
	name: "authSlice",
	initialState,
	reducers: {
		updateModal: (state, action: PayloadAction<boolean>) => {
			return { ...state, modalOpen: action.payload }
		},

		loginSuccess: (state, action: PayloadAction<UserProfile>) => {
			const user = action.payload
			const role = user.role || "USER"
			const username = user.name || user.email

			localStorage.setItem("username", username)
			localStorage.setItem("role", role)
			localStorage.setItem("user", JSON.stringify(user))

			return {
				...state,
				isLoggedIn: true,
				modalOpen: false,
				username,
				role,
				user,
			}
		},

		doLogout: (state) => {
			localStorage.removeItem("username")
			localStorage.removeItem("role")
			localStorage.removeItem("user")

			return {
				...state,
				username: "",
				role: "USER",
				user: null,
				isLoggedIn: false,
			}
		},
	},
})

export const { updateModal, loginSuccess, doLogout } = authSlice.actions
export default authSlice.reducer
