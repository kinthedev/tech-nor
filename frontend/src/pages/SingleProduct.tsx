import { type FC, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAppDispatch } from "../redux/hooks"
import { addToCart, setCartState } from "../redux/features/cartSlice"
import { type Product } from "../models/Product"
import RatingStar from "../components/RatingStar"
import PriceSection from "../components/PriceSection"
import toast from "react-hot-toast"
import { AiOutlineShoppingCart } from "react-icons/ai"
import { FaHandHoldingDollar } from "react-icons/fa6"
import ProductList from "../components/ProductList"
import { MdFavoriteBorder } from "react-icons/md"
import { addToWishlist } from "../redux/features/productSlice"
import Reviews from "../components/Reviews"
import useAuth from "../hooks/useAuth"
import { useAppSelector } from "../redux/hooks"
import { updateLoading } from "../redux/features/homeSlice"
import { API_ENDPOINTS, getProductImageUrl } from "../api"
import { HiOutlineArrowLeft } from "react-icons/hi"

const SingleProduct: FC = () => {
	const dispatch = useAppDispatch()
	const { productID } = useParams()
	const [product, setProduct] = useState<Product>()
	const [imgs, setImgs] = useState<string[]>()
	const [selectedImg, setSelectedImg] = useState<string>()
	const [sCategory, setScategory] = useState<string>()
	const [similar, setSimilar] = useState<Product[]>([])
	const { requireAuth } = useAuth()
	const isLoading = useAppSelector((state) => state.homeReducer.isLoading)
	const navigate = useNavigate()

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [productID])

	useEffect(() => {
		const fetchProductDetails = async () => {
			if (!productID) return
			dispatch(updateLoading(true))
			try {
				const res = await fetch(
					`${API_ENDPOINTS.PRODUCTS_ID.replace(":id", productID)}`,
				)
				const data = await res.json()
				const p = data.data || data

				const mainImage = getProductImageUrl(p.image || p.thumbnail)
				const imageList =
					p.images && p.images.length > 0
						? p.images.map(getProductImageUrl)
						: [mainImage]

				setProduct({
					...p,
					price: Number(p.price),
					thumbnail: mainImage,
				})
				setImgs(imageList)
				setScategory(p.category)
				setSelectedImg(mainImage)
			} catch (err) {
				console.error("Lỗi khi tải chi tiết sản phẩm:", err)
			} finally {
				dispatch(updateLoading(false))
			}
		}

		fetchProductDetails()
	}, [productID, dispatch])

	useEffect(() => {
		const fetchPreferences = async (cat: string) => {
			try {
				const res = await fetch(
					`${API_ENDPOINTS.PRODUCTS_CATEGORY_ID.replace(":id", cat)}`,
				)
				const data = await res.json()
				const rawList: any[] = data.products || data.data || []
				const filtered = rawList
					.filter((item) => String(item.id) !== String(productID))
					.map((item) => ({
						...item,
						price: Number(item.price),
						thumbnail: getProductImageUrl(item.image || item.thumbnail),
					}))
				setSimilar(filtered)
			} catch (err) {
				console.error("Lỗi tải sản phẩm tương tự:", err)
			}
		}

		if (sCategory) fetchPreferences(sCategory)
	}, [productID, sCategory])

	const addCart = () => {
		requireAuth(() => {
			if (product) {
				dispatch(
					addToCart({
						id: product.id,
						price: product.price,
						title: product.title,
						category: product.category,
						rating: product.rating,
						thumbnail: selectedImg || product.thumbnail,
						discountPercentage: product.discountPercentage,
					}),
				)
				toast.success("Đã thêm sản phẩm vào giỏ hàng!", {
					duration: 2500,
				})
			}
		})
	}

	const buyNow = () => {
		requireAuth(() => {
			if (product) {
				dispatch(
					addToCart({
						id: product.id,
						price: product.price,
						title: product.title,
						category: product.category,
						rating: product.rating,
						thumbnail: selectedImg || product.thumbnail,
						discountPercentage: product.discountPercentage,
					}),
				)
				dispatch(setCartState(true))
			}
		})
	}

	const addWishlist = () => {
		requireAuth(() => {
			if (product) {
				dispatch(addToWishlist(product))
				toast.success("Đã thêm sản phẩm vào danh sách yêu thích!", {
					duration: 2500,
				})
			}
		})
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[85vh]">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
			</div>
		)
	}

	return (
		<div className="container mx-auto px-4 py-8 dark:text-white font-karla">
			{/* Nút quay lại */}
			<button
				onClick={() => navigate(-1)}
				className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer mb-6">
				<HiOutlineArrowLeft size={16} />
				<span>Quay lại</span>
			</button>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{/* Cột 1: Ảnh sản phẩm */}
				<div className="space-y-4">
					<div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-6 flex items-center justify-center h-80 sm:h-96 shadow-sm">
						<img
							src={selectedImg}
							alt={product?.title || "Product"}
							className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
						/>
					</div>

					{/* Thumbnail list nếu có nhiều ảnh */}
					{imgs && imgs.length > 1 && (
						<div className="flex gap-2 overflow-x-auto pb-2">
							{imgs.map((_img, index) => (
								<button
									key={index}
									type="button"
									onClick={() => setSelectedImg(_img)}
									className={`w-16 h-16 rounded-xl border p-1 bg-white dark:bg-slate-800 overflow-hidden cursor-pointer transition ${
										_img === selectedImg
											? "border-emerald-600 ring-2 ring-emerald-500/20"
											: "border-slate-200 dark:border-slate-700 hover:border-slate-400"
									}`}>
									<img src={_img} alt="thumb" className="w-full h-full object-contain" />
								</button>
							))}
						</div>
					)}
				</div>

				{/* Cột 2: Thông tin chi tiết */}
				<div className="flex flex-col justify-between">
					<div>
						{/* Category badge */}
						<span className="inline-block uppercase tracking-wider text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md mb-2">
							{product?.category}
						</span>

						<h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-3">
							{product?.title}
						</h1>

						{/* Đánh giá */}
						<div className="flex items-center gap-2 mb-4">
							{product?.rating && <RatingStar rating={product.rating} />}
							<span className="text-sm text-slate-400">
								({product?.rating ? product.rating.toFixed(1) : "5.0"})
							</span>
						</div>

						{/* Giá */}
						<div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
							<PriceSection
								discountPercentage={product?.discountPercentage ?? 0}
								price={product?.price ?? 0}
							/>
						</div>

						{/* Bảng thông số */}
						<div className="border-t border-b border-slate-200 dark:border-slate-700/60 py-4 mb-6 space-y-2 text-sm">
							{product?.brand && (
								<div className="flex justify-between">
									<span className="font-semibold text-slate-500 dark:text-slate-400">
										Thương hiệu:
									</span>
									<span className="font-medium text-slate-800 dark:text-white">
										{product.brand}
									</span>
								</div>
							)}
							<div className="flex justify-between">
								<span className="font-semibold text-slate-500 dark:text-slate-400">
									Danh mục:
								</span>
								<span className="font-medium text-slate-800 dark:text-white capitalize">
									{product?.category}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="font-semibold text-slate-500 dark:text-slate-400">
									Tình trạng kho:
								</span>
								<span
									className={`font-semibold ${
										(product?.stock ?? 0) > 0
											? "text-emerald-600 dark:text-emerald-400"
											: "text-rose-500"
									}`}>
									{(product?.stock ?? 0) > 0
										? `Còn hàng (${product?.stock})`
										: "Hết hàng"}
								</span>
							</div>
						</div>

						{/* Mô tả sản phẩm */}
						<div className="mb-6">
							<h3 className="font-bold text-slate-800 dark:text-white mb-2">
								Mô tả sản phẩm
							</h3>
							<p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
								{product?.description}
							</p>
						</div>
					</div>

					{/* Nhóm nút mua hàng */}
					<div className="flex items-center gap-3 pt-4">
						<button
							type="button"
							className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition cursor-pointer active:scale-95"
							onClick={buyNow}
							title="Mua ngay">
							<FaHandHoldingDollar size={18} />
							<span>Mua Ngay</span>
						</button>

						<button
							type="button"
							className="flex items-center justify-center p-3 rounded-xl border border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition cursor-pointer active:scale-95"
							onClick={addCart}
							title="Thêm vào giỏ hàng"
							aria-label="Thêm vào giỏ hàng">
							<AiOutlineShoppingCart size={22} />
						</button>

						<button
							type="button"
							className="flex items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-500 hover:border-rose-500 transition cursor-pointer active:scale-95"
							onClick={addWishlist}
							title="Thêm vào yêu thích"
							aria-label="Thêm vào yêu thích">
							<MdFavoriteBorder size={22} />
						</button>
					</div>
				</div>

				{/* Cột 3: Đánh giá */}
				<div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60">
					{product && <Reviews id={product?.id} />}
				</div>
			</div>

			{/* Sản phẩm tương tự */}
			{similar.length > 0 && (
				<div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700/60">
					<ProductList title="Sản Phẩm Tương Tự" products={similar} />
				</div>
			)}
		</div>
	)
}

export default SingleProduct
