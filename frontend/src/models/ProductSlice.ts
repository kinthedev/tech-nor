import { type Category } from "./Category"
import { type Product } from "./Product"

export interface ProductSlice {
	allProducts: Product[]
	newProducts: Product[]
	featuredProducts: Product[]
	wishlist: Product[]
	categories: Category[]
}
