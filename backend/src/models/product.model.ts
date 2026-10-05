import type { Decimal } from "@prisma/client/runtime/client"

export interface Product {
	id: number
	title: string
	image?: string | null
	price: Decimal
	rating: number
	description?: string | null
	category: string
	brand?: string | null
	stock?: number | null
	discountPercentage?: number | null
}
