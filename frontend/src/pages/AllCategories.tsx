import { type FC, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { addCategories } from "../redux/features/productSlice"
import { Link } from "react-router-dom"
import { updateLoading } from "../redux/features/homeSlice"
import { API_ENDPOINTS } from "../api"
import {
	HiOutlineDevicePhoneMobile,
	HiOutlineComputerDesktop,
	HiOutlineClock,
	HiOutlineHome,
} from "react-icons/hi2"
import { MdOutlineTabletMac, MdOutlineHeadphones } from "react-icons/md"
import { BsArrowRight } from "react-icons/bs"

interface CategoryWithCount {
	name: string
	slug: string
	count?: number
	url?: string
}

const getCategoryIcon = (slug: string) => {
	switch (slug.toLowerCase()) {
		case "smartphones":
			return <HiOutlineDevicePhoneMobile size={28} className="text-emerald-500" />
		case "laptops":
			return <HiOutlineComputerDesktop size={28} className="text-blue-500" />
		case "smartwatches":
			return <HiOutlineClock size={28} className="text-purple-500" />
		case "tablets":
			return <MdOutlineTabletMac size={28} className="text-pink-500" />
		case "accessories":
			return <MdOutlineHeadphones size={28} className="text-amber-500" />
		case "smart-home":
			return <HiOutlineHome size={28} className="text-teal-500" />
		default:
			return <HiOutlineDevicePhoneMobile size={28} className="text-emerald-500" />
	}
}

const AllCategories: FC = () => {
	const dispatch = useAppDispatch()
	const allCategories = useAppSelector(
		(state) => state.productReducer.categories,
	) as CategoryWithCount[]
	const isLoading = useAppSelector((state) => state.homeReducer.isLoading)

	useEffect(() => {
		const fetchCategories = async () => {
			dispatch(updateLoading(true))
			try {
				const res = await fetch(API_ENDPOINTS.PRODUCTS_CATEGORIES)
				const data = await res.json()
				if (Array.isArray(data)) {
					dispatch(addCategories(data))
				}
			} catch (err) {
				console.error("Lỗi tải danh mục:", err)
			} finally {
				dispatch(updateLoading(false))
			}
		}

		fetchCategories()
	}, [dispatch])

	return (
		<div className="container mx-auto min-h-[85vh] px-4 py-8 font-karla">
			<div className="mb-8">
				<h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
					Danh Mục Sản Phẩm
				</h1>
				<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
					Tìm kiếm thiết bị theo từng nhóm công nghệ chuyên biệt
				</p>
			</div>

			{isLoading ? (
				<div className="flex items-center justify-center py-24">
					<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
					{allCategories.map((category) => (
						<Link
							key={category.slug}
							to={`/category/${category.slug}`}
							className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform duration-300">
									{getCategoryIcon(category.slug)}
								</div>
								<div>
									<h2 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
										{category.name}
									</h2>
									<span className="text-xs text-slate-500 dark:text-slate-400">
										{category.count !== undefined
											? `${category.count} sản phẩm có sẵn`
											: "Xem sản phẩm"}
									</span>
								</div>
							</div>

							<div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
								<BsArrowRight size={18} />
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	)
}

export default AllCategories
