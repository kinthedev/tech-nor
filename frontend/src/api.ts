export const BACKEND_URL = "https://tech-nor.onrender.com"
const BASE_URL = `${BACKEND_URL}/api/v1`

export const API_ENDPOINTS = {
	PRODUCTS: `${BASE_URL}/products`,
	PRODUCTS_CATEGORIES: `${BASE_URL}/products/categories`,
	PRODUCTS_SEARCH: `${BASE_URL}/products/search`,
	PRODUCTS_CATEGORY: `${BASE_URL}/products/category`,
	PRODUCTS_ID: `${BASE_URL}/products/:id`,
	PRODUCTS_CATEGORY_ID: `${BASE_URL}/products/category/:id`,
	PRODUCTS_CATEGORY_ID_PRODUCTS: `${BASE_URL}/products/category/:id`,
	PRODUCTS_CATEGORY_ID_PRODUCTS_ID: `${BASE_URL}/products/:id`,
	PRODUCTS_CATEGORY_ID_PRODUCTS_ID_PRODUCTS: `${BASE_URL}/products/category/:id`,
	USER: `${BASE_URL}/auth/me?id=:id`,
	AUTH_LOGIN: `${BASE_URL}/auth/login`,
	AUTH_REGISTER: `${BASE_URL}/auth/register`,
	AUTH_GOOGLE: `${BASE_URL}/auth/google`,
	AUTH_ME: `${BASE_URL}/auth/me`,
}

/**
 * Helper chuẩn hóa link ảnh từ database:
 * - Nếu link bắt đầu bằng "/uploads/", trả về link đầy đủ tới Backend hoặc link tương đối được Vite proxy
 */
export const getProductImageUrl = (imagePath?: string | null): string => {
	if (!imagePath) return "/placeholder-product.png"
	if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
		return imagePath
	}
	// Đảm bảo có dấu / phía trước
	const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`
	return `${BACKEND_URL}${cleanPath}`
}
