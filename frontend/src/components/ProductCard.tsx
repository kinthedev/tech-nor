import { type FC } from "react"
import { type Product } from "../models/Product"
import RatingStar from "./RatingStar"
import { addToCart } from "../redux/features/cartSlice"
import { useAppDispatch } from "../redux/hooks"
import toast from "react-hot-toast"
import { AiOutlineShoppingCart } from "react-icons/ai"
import { Link } from "react-router-dom"
import PriceSection from "./PriceSection"
import useAuth from "../hooks/useAuth"
import { getProductImageUrl } from "../api"

const ProductCard: FC<Product> = ({
	id,
	price,
	thumbnail,
	image,
	title,
	category,
	brand,
	rating,
	discountPercentage,
}) => {
	const dispatch = useAppDispatch()
	const { requireAuth } = useAuth()

	const displayImg = getProductImageUrl(image || thumbnail)

	const addCart = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		requireAuth(() => {
			dispatch(
				addToCart({
					id,
					price,
					title,
					category,
					brand,
					rating,
					thumbnail: displayImg,
					discountPercentage,
				}),
			)
			toast.success("Đã thêm sản phẩm vào giỏ hàng!", {
				duration: 2500,
			})
		})
	}

	return (
		<div
			className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between font-karla"
			data-test="product-card">
			{/* Khung ảnh & Tag giảm giá */}
			<div className="relative overflow-hidden bg-slate-50 dark:bg-slate-900/50 p-4 flex items-center justify-center h-60">
				{discountPercentage && discountPercentage > 0 ? (
					<span className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
						-{Math.round(discountPercentage)}%
					</span>
				) : null}

				<Link
					to={{ pathname: `/product/${id}` }}
					className="w-full h-full flex items-center justify-center">
					<img
						src={displayImg}
						alt={title}
						loading="lazy"
						className="max-h-48 max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
						onError={(e) => {
							// Dự phòng nếu ảnh lỗi
							;(e.target as HTMLImageElement).src = "/placeholder-product.png"
						}}
					/>
				</Link>
			</div>

			{/* Thông tin sản phẩm */}
			<div className="p-4 flex flex-col flex-grow justify-between">
				<div>
					{/* Danh mục & Thương hiệu */}
					<div className="flex items-center justify-between gap-2 mb-1.5">
						<span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
							{category}
						</span>
						{brand && (
							<span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
								{brand}
							</span>
						)}
					</div>

					{/* Tên sản phẩm */}
					<Link
						to={{ pathname: `/product/${id}` }}
						className="font-bold text-slate-800 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 line-clamp-2 text-sm md:text-base leading-snug mb-2 transition-colors"
						title={title}>
						{title}
					</Link>
				</div>

				{/* Đánh giá sao */}
				<div className="flex items-center gap-1.5 mb-3">
					<RatingStar rating={rating} />
					<span className="text-xs text-slate-400 dark:text-slate-400">
						({rating.toFixed(1)})
					</span>
				</div>

				{/* Giá & Nút Thêm vào giỏ */}
				<div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60">
					<PriceSection discountPercentage={discountPercentage ?? 0} price={price} />
					<button
						type="button"
						className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-sm hover:shadow transition-all cursor-pointer"
						onClick={addCart}
						data-test="add-cart-btn"
						title="Thêm vào giỏ hàng"
						aria-label="Thêm vào giỏ hàng">
						<AiOutlineShoppingCart size={20} />
					</button>
				</div>
			</div>
		</div>
	)
}

export default ProductCard
