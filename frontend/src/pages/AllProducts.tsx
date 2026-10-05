import { type FC, useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "../redux/hooks"
import { addProducts, addCategories } from "../redux/features/productSlice"
import { type Product } from "../models/Product"
import { type Category } from "../models/Category"
import { updateLoading } from "../redux/features/homeSlice"
import SortProducts from "../components/SortProducts"
import PaginatedProducts from "../components/PaginatedProducts"
import { API_ENDPOINTS } from "../api"
import { HiOutlineFilter } from "react-icons/hi"

interface CategoryWithCount extends Category {
	count?: number
}

const AllProducts: FC = () => {
	const dispatch = useAppDispatch()
	const allProducts = useAppSelector((state) => state.productReducer.allProducts)
	const categories = useAppSelector(
		(state) => state.productReducer.categories,
	) as CategoryWithCount[]
	const isLoading = useAppSelector((state) => state.homeReducer.isLoading)

	const [selectedCategory, setSelectedCategory] = useState<string>("all")
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

	// 1. Tải danh mục từ backend nếu chưa có
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await fetch(API_ENDPOINTS.PRODUCTS_CATEGORIES)
				const data = await res.json()
				if (Array.isArray(data)) {
					dispatch(addCategories(data))
				}
			} catch (err) {
				console.error("Lỗi khi tải danh mục:", err)
			}
		}

		if (categories.length === 0) {
			fetchCategories()
		}
	}, [categories.length, dispatch])

	// 2. Tải tất cả sản phẩm từ backend
	useEffect(() => {
		const fetchProducts = async () => {
			dispatch(updateLoading(true))
			try {
				const res = await fetch(API_ENDPOINTS.PRODUCTS)
				const data = await res.json()
				const list = data.products || data.data || []
				dispatch(addProducts(list))
			} catch (err) {
				console.error("Lỗi khi tải danh sách sản phẩm:", err)
			} finally {
				dispatch(updateLoading(false))
			}
		}

		fetchProducts()
	}, [dispatch])

	// 3. Lọc sản phẩm theo Category đã chọn
	useEffect(() => {
		if (selectedCategory === "all") {
			setFilteredProducts(allProducts)
		} else {
			setFilteredProducts(
				allProducts.filter(
					(p) => p.category?.toLowerCase() === selectedCategory.toLowerCase(),
				),
			)
		}
	}, [selectedCategory, allProducts])

	return (
		<div className="container mx-auto min-h-[85vh] px-4 py-8 font-karla">
			{/* Tiêu đề trang */}
			<div className="mb-6">
				<h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
					Tất Cả Sản Phẩm
				</h1>
				<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
					Khám phá các thiết bị công nghệ chính hãng từ cơ sở dữ liệu TechNor
				</p>
			</div>

			{/* Thanh Lọc Danh Mục (Category Filter Bar) */}
			<div className="mb-8 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
				<div className="flex items-center gap-2 mb-3 text-slate-600 dark:text-slate-300 font-semibold text-sm">
					<HiOutlineFilter className="text-emerald-600 text-base" />
					<span>Lọc theo danh mục:</span>
				</div>

				<div className="flex flex-wrap gap-2">
					{/* Nút Tất cả */}
					<button
						type="button"
						onClick={() => setSelectedCategory("all")}
						className={`px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
							selectedCategory === "all"
								? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
								: "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600"
						}`}>
						<span>Tất cả</span>
						<span
							className={`text-xs px-1.5 py-0.2 rounded-full ${
								selectedCategory === "all"
									? "bg-emerald-700 text-emerald-100"
									: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300"
							}`}>
							{allProducts.length}
						</span>
					</button>

					{/* Danh sách danh mục từ Database */}
					{categories.map((cat) => {
						const isSelected = selectedCategory === cat.slug
						return (
							<button
								key={cat.slug}
								type="button"
								onClick={() => setSelectedCategory(cat.slug)}
								className={`px-4 py-2 rounded-xl text-xs md:text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
									isSelected
										? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
										: "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600"
								}`}>
								<span>{cat.name}</span>
								{cat.count !== undefined && (
									<span
										className={`text-xs px-1.5 py-0.2 rounded-full ${
											isSelected
												? "bg-emerald-700 text-emerald-100"
												: "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300"
										}`}>
										{cat.count}
									</span>
								)}
							</button>
						)
					})}
				</div>
			</div>

			{/* Thanh điều khiển kết quả: Số lượng & Sắp xếp */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700/60">
				<div className="text-sm text-slate-500 dark:text-slate-400">
					Hiển thị{" "}
					<span className="font-bold text-slate-800 dark:text-white">
						{filteredProducts.length}
					</span>{" "}
					sản phẩm
					{selectedCategory !== "all" && (
						<span>
							{" "}
							trong danh mục{" "}
							<span className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
								{selectedCategory}
							</span>
						</span>
					)}
				</div>

				<div className="flex items-center gap-2">
					<span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
						Sắp xếp:
					</span>
					<SortProducts products={filteredProducts} onChange={setFilteredProducts} />
				</div>
			</div>

			{/* Danh sách sản phẩm phân trang */}
			<PaginatedProducts
				products={filteredProducts}
				isLoading={isLoading}
				initialRows={5}
			/>
		</div>
	)
}

export default AllProducts
