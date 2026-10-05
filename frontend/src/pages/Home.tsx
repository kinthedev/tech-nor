import { type FC, useEffect } from "react"
import HeroSection from "../components/HeroSection"
import Features from "../components/Features"
import TrendingProducts from "../components/TrendingProducts"
import { useAppDispatch } from "../redux/hooks"
import {
	updateNewList,
	updateFeaturedList,
	addCategories,
} from "../redux/features/productSlice"
import { type Product } from "../models/Product"
import LatestProducts from "../components/LatestProducts"
import Banner from "../components/Banner"
import { API_ENDPOINTS } from "../api"

const Home: FC = () => {
	const dispatch = useAppDispatch()

	useEffect(() => {
		const fetchProductsAndCategories = async () => {
			try {
				// Lấy sản phẩm từ Backend Database
				const prodRes = await fetch(`${API_ENDPOINTS.PRODUCTS}?limit=24`)
				const prodData = await prodRes.json()
				const rawProducts = prodData.products || prodData.data || []

				const productList: Product[] = rawProducts.map((p: any) => ({
					id: p.id,
					title: p.title,
					image: p.image,
					price: Number(p.price),
					rating: p.rating,
					thumbnail: p.thumbnail || p.image,
					description: p.description,
					category: p.category,
					brand: p.brand,
					stock: p.stock,
					discountPercentage: p.discountPercentage,
				}))

				dispatch(updateFeaturedList(productList.slice(0, 8)))
				dispatch(updateNewList(productList.slice(8, 16)))

				// Lấy danh mục từ Backend Database
				const catRes = await fetch(API_ENDPOINTS.PRODUCTS_CATEGORIES)
				const catData = await catRes.json()
				if (Array.isArray(catData)) {
					dispatch(addCategories(catData))
				}
			} catch (err) {
				console.error("Lỗi khi tải dữ liệu trang chủ:", err)
			}
		}

		fetchProductsAndCategories()
	}, [dispatch])

	return (
		<div className="dark:bg-slate-900 transition-colors duration-300">
			<HeroSection />
			<Features />
			<TrendingProducts />
			<Banner />
			<LatestProducts />
			<div className="py-4" />
		</div>
	)
}

export default Home
