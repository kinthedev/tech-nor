import { type Product } from "../models/product.model"
import {
	productRepository,
	type ProductFilters,
	type CategorySummary,
} from "../repository/product.repository"

export const productService = {
	// 1. Lấy danh sách sản phẩm (hỗ trợ filter category, search, sort, pagination)
	getAllProducts: async (filters: ProductFilters = {}): Promise<Product[]> => {
		return await productRepository.getAll(filters)
	},

	// 2. Lấy chi tiết 1 sản phẩm (kiểm tra tồn tại)
	getProductById: async (id: number): Promise<Product> => {
		const product = await productRepository.getById(id)
		if (!product) {
			throw new Error(`Sản phẩm với ID ${id} không tồn tại`)
		}
		return product
	},

	// 3. Lấy sản phẩm theo Category
	getProductsByCategory: async (category: string): Promise<Product[]> => {
		return await productRepository.getByCategory(category)
	},

	// 4. Tìm kiếm sản phẩm
	searchProducts: async (query: string): Promise<Product[]> => {
		if (!query || query.trim() === "") {
			return await productRepository.getAll({ limit: 50 })
		}
		return await productRepository.search(query.trim())
	},

	// 5. Lấy danh sách danh mục
	getCategories: async (): Promise<CategorySummary[]> => {
		return await productRepository.getCategories()
	},

	// 6. Tạo sản phẩm mới
	createProduct: async (
		data: Omit<Product, "id" | "createdAt" | "updatedAt">,
	): Promise<Product> => {
		if (Number(data.price) < 0) {
			throw new Error("Giá sản phẩm không được nhỏ hơn 0")
		}
		return await productRepository.create(data)
	},

	// 7. Cập nhật sản phẩm
	updateProduct: async (
		id: number,
		data: Partial<Product>,
	): Promise<Product> => {
		const existingProduct = await productRepository.getById(id)
		if (!existingProduct) {
			throw new Error(`Không tìm thấy sản phẩm ${id} để cập nhật`)
		}

		return await productRepository.update(id, data)
	},

	// 8. Xoá sản phẩm
	deleteProduct: async (id: number): Promise<Product> => {
		const existingProduct = await productRepository.getById(id)
		if (!existingProduct) {
			throw new Error(`Không tìm thấy sản phẩm ${id} để xoá`)
		}

		return await productRepository.delete(id)
	},
}
