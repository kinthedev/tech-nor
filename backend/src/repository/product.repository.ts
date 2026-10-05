import { prisma } from "../../lib/prisma"
import { type Product } from "../models/product.model"

export interface ProductFilters {
	category?: string | undefined
	brand?: string | undefined
	search?: string | undefined
	limit?: number | undefined
	skip?: number | undefined
	sort?: string | undefined
	order?: "asc" | "desc" | undefined
}

export interface CategorySummary {
	name: string
	slug: string
	count: number
	url?: string
}

export const productRepository = {
	// 1. Lấy danh sách sản phẩm có bộ lọc (category, search, pagination, sort)
	getAll: async (filters: ProductFilters = {}): Promise<Product[]> => {
		const { category, brand, search, limit, skip, sort, order = "asc" } = filters

		const where: any = {}

		if (category && category !== "all") {
			where.category = {
				equals: category,
			}
		}

		if (brand) {
			where.brand = {
				equals: brand,
			}
		}

		if (search) {
			where.OR = [
				{ title: { contains: search } },
				{ description: { contains: search } },
				{ brand: { contains: search } },
				{ category: { contains: search } },
			]
		}

		const orderBy: any = {}
		if (sort) {
			orderBy[sort] = order
		} else {
			orderBy.id = "asc"
		}

		const queryArgs: any = { where, orderBy }
		if (limit) queryArgs.take = Number(limit)
		if (skip) queryArgs.skip = Number(skip)

		return await prisma.product.findMany(queryArgs)
	},

	// 2. Lấy chi tiết 1 sản phẩm theo ID
	getById: async (id: number): Promise<Product | null> => {
		return await prisma.product.findUnique({
			where: { id },
		})
	},

	// 3. Lấy sản phẩm theo Category
	getByCategory: async (category: string): Promise<Product[]> => {
		return await prisma.product.findMany({
			where: {
				category: {
					equals: category,
				},
			},
			orderBy: { id: "asc" },
		})
	},

	// 4. Tìm kiếm sản phẩm theo từ khoá
	search: async (query: string): Promise<Product[]> => {
		return await prisma.product.findMany({
			where: {
				OR: [
					{ title: { contains: query } },
					{ description: { contains: query } },
					{ brand: { contains: query } },
					{ category: { contains: query } },
				],
			},
			orderBy: { id: "asc" },
		})
	},

	// 5. Lấy danh sách tất cả các Category cùng số lượng sản phẩm
	getCategories: async (): Promise<CategorySummary[]> => {
		const groups = await prisma.product.groupBy({
			by: ["category"],
			_count: { id: true },
		})

		const categoryNames: Record<string, string> = {
			smartphones: "Smartphones",
			laptops: "Laptops",
			smartwatches: "Smartwatches",
			tablets: "Tablets",
			accessories: "Accessories",
			"smart-home": "Smart Home",
		}

		return groups.map((g) => {
			const slug = g.category
			const name =
				categoryNames[slug] ||
				slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " ")
			return {
				name,
				slug,
				count: g._count.id,
				url: `/category/${slug}`,
			}
		})
	},

	// 6. Thêm mới sản phẩm
	create: async (
		data: Omit<Product, "id" | "createdAt" | "updatedAt">,
	): Promise<Product> => {
		return await prisma.product.create({
			data: {
				...data,
				price: Number(data.price),
			},
		})
	},

	// 7. Sửa sản phẩm
	update: async (id: number, data: Partial<Product>): Promise<Product> => {
		const updateData: any = { ...data }
		if (data.price !== undefined) {
			updateData.price = Number(data.price)
		} else {
			delete updateData.price
		}
		return await prisma.product.update({
			where: { id },
			data: updateData,
		})
	},

	// 8. Xoá sản phẩm
	delete: async (id: number): Promise<Product> => {
		return await prisma.product.delete({
			where: { id },
		})
	},

	// 9. Đếm tổng số sản phẩm
	count: async (where: any = {}): Promise<number> => {
		return await prisma.product.count({ where })
	},
}
