import { type CartItem } from "./CartItem"

export interface CartSlice {
	cartOpen: boolean
	cartItems: CartItem[]
}
