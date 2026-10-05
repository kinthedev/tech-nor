export interface UserProfile {
	id?: number
	email: string
	name?: string | null
	address?: string | null
	role?: string
	avatar?: string | null
	provider?: string
}

export interface AuthSlice {
	isLoggedIn: boolean
	modalOpen: boolean
	username: string
	role: string
	user: UserProfile | null
}
