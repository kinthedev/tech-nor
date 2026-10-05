import { type FC, useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { type Product } from "../models/Product"
import { updateLoading } from "../redux/features/homeSlice"
import SortProducts from "../components/SortProducts"
import PaginatedProducts from "../components/PaginatedProducts"
import { API_ENDPOINTS } from "../api"
import { HiOutlineChevronRight } from "react-icons/hi"

const SingleCategory: FC = () => {
	const dispatch = useAppDispatch()
	const { slug } = useParams()
	const [productList, setProductList] = useState<Product[]>([])
	const isLoading = useAppSelector((state) => state.homeReducer.isLoading)

	useEffect(() => {
		const fetchProducts = async () => {
			if (!slug) return
			dispatch(updateLoading(true))
			try {
				const res = await fetch(
					`${API_ENDPOINTS.PRODUCTS_CATEGORY_ID.replace(":id", slug)}`,
				)
				const data = await res.json()
				const raw = data.products || data.data || []
				const formatted: Product[] = raw.map((p: any) => ({
					...p,
					price: Number(p.price),
					thumbnail: p.thumbnail || p.image,
				}))
				setProductList(formatted)
			} catch (err) {
				console.error("Lỗi khi tải sản phẩm theo danh mục:", err)
			} finally {
				dispatch(updateLoading(false))
			}
		}

		fetchProducts()
	}, [slug, dispatch])

	return (
		<div className="container mx-auto min-h-[85vh] px-4 py-8 font-karla">
			{/* Breadcrumb & Navigation */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700/60">
				<nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
					<Link
						to="/categories"
						className="hover:text-emerald-600 dark:hover:text-emerald-400 transition font-medium">
						Danh mục
					</Link>
					<HiOutlineChevronRight size={14} />
					<span className="font-bold text-slate-800 dark:text-white capitalize">
						{slug}
					</span>
				</nav>

				<div className="flex items-center gap-2">
					<span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
						Sắp xếp:
					</span>
					<SortProducts products={productList} onChange={setProductList} />
				</div>
			</div>

			{/* Tiêu đề & Đếm số lượng */}
			<div className="mb-6">
				<h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight capitalize">
					{slug}
				</h1>
				<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
					Tìm thấy{" "}
					<span className="font-bold text-emerald-600 dark:text-emerald-400">
						{productList.length}
					</span>{" "}
					sản phẩm trong danh mục này
				</p>
			</div>

			{/* Danh sách sản phẩm */}
			<PaginatedProducts
				products={productList}
				isLoading={isLoading}
				initialRows={5}
			/>
		</div>
	)
}

export default SingleCategory
