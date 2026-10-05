import { type FC, useEffect, useState } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import { type Product } from "../models/Product"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { updateLoading } from "../redux/features/homeSlice"
import SortProducts from "../components/SortProducts"
import PaginatedProducts from "../components/PaginatedProducts"
import { API_ENDPOINTS, getProductImageUrl } from "../api"
import { HiOutlineSearch, HiOutlineTag } from "react-icons/hi"

interface Category {
	slug: string
	name: string
	url: string
	count?: number
}

const SearchPage: FC = () => {
	const [searchParams] = useSearchParams()
	const query = searchParams.get("q") || ""
	const [products, setProducts] = useState<Product[]>([])
	const [categoryResults, setCategoryResults] = useState<Category[]>([])
	const [notFound, setNotFound] = useState(false)
	const dispatch = useAppDispatch()
	const isLoading = useAppSelector((state) => state.homeReducer.isLoading)
	const navigate = useNavigate()

	useEffect(() => {
		const searchProducts = async () => {
			if (!query.trim()) {
				setNotFound(true)
				return
			}

			dispatch(updateLoading(true))
			setNotFound(false)

			try {
				const productsResponse = await fetch(
					`${API_ENDPOINTS.PRODUCTS_SEARCH}?q=${encodeURIComponent(query.trim())}`,
				)
				const data = await productsResponse.json()
				const rawList: any[] = data.products || data.data || []

				const formatted: Product[] = rawList.map((p) => ({
					...p,
					price: Number(p.price),
					thumbnail: getProductImageUrl(p.image || p.thumbnail),
				}))

				if (formatted.length > 0) {
					setProducts(formatted)
					setCategoryResults([])
					setNotFound(false)
				} else {
					// Nếu không có sản phẩm khớp từ khoá, tìm danh mục khớp
					const categoriesResponse = await fetch(API_ENDPOINTS.PRODUCTS_CATEGORIES)
					const categoriesData: Category[] = await categoriesResponse.json()

					const matchedCategories = categoriesData.filter(
						(cat) =>
							cat.name.toLowerCase().includes(query.toLowerCase()) ||
							cat.slug.toLowerCase().includes(query.toLowerCase()),
					)

					if (matchedCategories.length > 0) {
						setCategoryResults(matchedCategories)
						setProducts([])
						setNotFound(false)
					} else {
						setProducts([])
						setCategoryResults([])
						setNotFound(true)
					}
				}
			} catch (error) {
				console.error("Lỗi khi tìm kiếm:", error)
				setNotFound(true)
			} finally {
				dispatch(updateLoading(false))
			}
		}

		searchProducts()
	}, [query, dispatch])

	return (
		<div className="container mx-auto min-h-[85vh] px-4 py-8 font-karla">
			{/* Tiêu đề kết quả & Sắp xếp */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700/60">
				<div>
					<h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
						<HiOutlineSearch className="text-emerald-600" />
						<span>
							Kết quả tìm kiếm cho:{" "}
							<span className="text-emerald-600 dark:text-emerald-400">"{query}"</span>
						</span>
					</h1>
					{products.length > 0 && (
						<p className="text-xs text-slate-400 mt-1">
							Tìm thấy {products.length} sản phẩm phù hợp từ hệ thống
						</p>
					)}
				</div>

				{products.length > 0 && (
					<div className="flex items-center gap-2">
						<span className="text-xs text-slate-400 font-medium">Sắp xếp:</span>
						<SortProducts products={products} onChange={setProducts} />
					</div>
				)}
			</div>

			{/* Trạng thái tải */}
			{isLoading ? (
				<div className="flex items-center justify-center py-24">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
				</div>
			) : notFound ? (
				<div className="text-center py-20 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/60 my-6">
					<div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4 text-slate-400">
						<HiOutlineSearch size={32} />
					</div>
					<h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
						Không tìm thấy sản phẩm nào
					</h2>
					<p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
						Rất tiếc, chúng tôi không tìm thấy kết quả phù hợp với từ khóa "{query}".
						Vui lòng kiểm tra lại chính tả hoặc thử lại với danh mục sản phẩm.
					</p>
					<Link
						to="/products"
						className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition cursor-pointer shadow-sm">
						Xem toàn bộ sản phẩm
					</Link>
				</div>
			) : categoryResults.length > 0 ? (
				<div>
					<p className="text-base text-slate-600 dark:text-slate-300 mb-4 font-medium">
						Không có sản phẩm chính xác, nhưng có các danh mục liên quan:
					</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
						{categoryResults.map((category) => (
							<div
								key={category.slug}
								onClick={() => navigate(`/category/${category.slug}`)}
								className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition cursor-pointer flex items-center justify-between shadow-sm hover:shadow-md">
								<div className="flex items-center gap-3">
									<div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
										<HiOutlineTag size={20} />
									</div>
									<div>
										<h3 className="font-bold text-slate-800 dark:text-white capitalize">
											{category.name}
										</h3>
										<span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
											Xem sản phẩm →
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			) : (
				<PaginatedProducts
					products={products}
					isLoading={isLoading}
					initialRows={5}
				/>
			)}
		</div>
	)
}

export default SearchPage
