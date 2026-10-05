import { type Request, type Response } from "express"
import { productService } from "../services/product.service"

// Helper chuẩn hoá dữ liệu sản phẩm tương thích cho cả frontend mới và cũ
const formatProduct = (p: any) => ({
	...p,
	price: Number(p.price),
	thumbnail: p.image || "/uploads/10056304-dien-thoai-iphone-plus.webp",
	images: p.image ? [p.image] : [],
})

export const productController = {
	// 1. GET /api/v1/products (hỗ trợ lọc theo category, search, sort, limit)
	getAll: async (req: Request, res: Response) => {
		try {
			const { category, brand, search, q, limit, skip, sort, order } = req.query

			const products = await productService.getAllProducts({
				category: category ? String(category) : undefined,
				brand: brand ? String(brand) : undefined,
				search: search ? String(search) : q ? String(q) : undefined,
				limit: limit ? Number(limit) : undefined,
				skip: skip ? Number(skip) : undefined,
				sort: sort ? String(sort) : undefined,
				order: order === "desc" ? "desc" : "asc",
			})

			const formatted = products.map(formatProduct)

			return res.status(200).json({
				success: true,
				total: formatted.length,
				products: formatted, // Giữ key products cho tương thích ngược
				data: formatted,
			})
		} catch (error: any) {
			return res.status(500).json({
				success: false,
				message: error.message || "Lỗi server khi lấy danh sách sản phẩm",
			})
		}
	},

	// 2. GET /api/v1/products/categories
	getCategories: async (req: Request, res: Response) => {
		try {
			const categories = await productService.getCategories()
			return res.status(200).json(categories)
		} catch (error: any) {
			return res.status(500).json({
				success: false,
				message: error.message || "Lỗi khi lấy danh mục sản phẩm",
			})
		}
	},

	// 3. GET /api/v1/products/category/:category
	getByCategory: async (req: Request, res: Response) => {
		try {
			const category = String(req.params.category)
			const products = await productService.getProductsByCategory(category)
			const formatted = products.map(formatProduct)

			return res.status(200).json({
				success: true,
				category,
				total: formatted.length,
				products: formatted,
				data: formatted,
			})
		} catch (error: any) {
			return res.status(500).json({
				success: false,
				message: error.message || "Lỗi khi lấy sản phẩm theo danh mục",
			})
		}
	},

	// 4. GET /api/v1/products/search?q=...
	search: async (req: Request, res: Response) => {
		try {
			const query = String(req.query.q || req.query.search || "")
			const products = await productService.searchProducts(query)
			const formatted = products.map(formatProduct)

			return res.status(200).json({
				success: true,
				query,
				total: formatted.length,
				products: formatted,
				data: formatted,
			})
		} catch (error: any) {
			return res.status(500).json({
				success: false,
				message: error.message || "Lỗi khi tìm kiếm sản phẩm",
			})
		}
	},

	// 5. GET /api/v1/products/:id
	getById: async (req: Request, res: Response) => {
		try {
			const id = Number(req.params.id)
			if (isNaN(id)) {
				return res.status(400).json({ success: false, message: "ID không hợp lệ" })
			}

			const product = await productService.getProductById(id)
			const formatted = formatProduct(product)

			return res.status(200).json({
				success: true,
				...formatted,
				data: formatted,
			})
		} catch (error: any) {
			return res.status(404).json({
				success: false,
				message: error.message,
			})
		}
	},

	// 6. POST /api/v1/products
	create: async (req: Request, res: Response) => {
		try {
			const newProduct = await productService.createProduct(req.body)
			const formatted = formatProduct(newProduct)
			return res.status(201).json({
				success: true,
				data: formatted,
			})
		} catch (error: any) {
			return res.status(400).json({
				success: false,
				message: error.message,
			})
		}
	},

	// 7. PUT /api/v1/products/:id
	update: async (req: Request, res: Response) => {
		try {
			const id = Number(req.params.id)
			if (isNaN(id)) {
				return res.status(400).json({ success: false, message: "ID không hợp lệ" })
			}

			const updatedProduct = await productService.updateProduct(id, req.body)
			const formatted = formatProduct(updatedProduct)
			return res.status(200).json({
				success: true,
				data: formatted,
			})
		} catch (error: any) {
			return res.status(400).json({
				success: false,
				message: error.message,
			})
		}
	},

	// 8. DELETE /api/v1/products/:id
	delete: async (req: Request, res: Response) => {
		try {
			const id = Number(req.params.id)
			if (isNaN(id)) {
				return res.status(400).json({ success: false, message: "ID không hợp lệ" })
			}

			await productService.deleteProduct(id)
			return res.status(200).json({
				success: true,
				message: "Xoá sản phẩm thành công",
			})
		} catch (error: any) {
			return res.status(400).json({
				success: false,
				message: error.message,
			})
		}
	},
}
