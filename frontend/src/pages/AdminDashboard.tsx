import { type FC, useEffect, useState } from "react"
import { useAppSelector } from "../redux/hooks"
import { type Product } from "../models/Product"
import { API_ENDPOINTS, getProductImageUrl } from "../api"
import {
	FaUserShield,
	FaBoxOpen,
	FaTags,
	FaTrash,
	FaPlus,
	FaLock,
	FaEdit,
	FaSearch,
	FaChevronLeft,
	FaChevronRight,
} from "react-icons/fa"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"

const AdminDashboard: FC = () => {
	const role = useAppSelector((state) => state.authReducer.role)
	const user = useAppSelector((state) => state.authReducer.user)
	const isLoggedIn = useAppSelector((state) => state.authReducer.isLoggedIn)

	const [products, setProducts] = useState<Product[]>([])
	const [categories, setCategories] = useState<any[]>([])
	const [loading, setLoading] = useState(true)

	// State cho form thêm sản phẩm
	const [showAddModal, setShowAddModal] = useState(false)
	const [newTitle, setNewTitle] = useState("")
	const [newCategory, setNewCategory] = useState("smartphones")
	const [newBrand, setNewBrand] = useState("")
	const [newPrice, setNewPrice] = useState("")
	const [newStock, setNewStock] = useState("50")
	const [newDescription, setNewDescription] = useState("")

	// State cho form sửa sản phẩm
	const [editingProduct, setEditingProduct] = useState<Product | null>(null)
	const [editTitle, setEditTitle] = useState("")
	const [editCategory, setEditCategory] = useState("smartphones")
	const [editBrand, setEditBrand] = useState("")
	const [editPrice, setEditPrice] = useState("")
	const [editStock, setEditStock] = useState("50")
	const [editRating, setEditRating] = useState("4.5")
	const [editDiscount, setEditDiscount] = useState("0")
	const [editImage, setEditImage] = useState("")
	const [editDescription, setEditDescription] = useState("")

	// State cho tìm kiếm, lọc & phân trang trong bảng Admin
	const [searchTerm, setSearchTerm] = useState("")
	const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all")
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState<number | "all">(20)

	const isAdmin = isLoggedIn && role === "ADMIN"

	const loadData = async () => {
		try {
			setLoading(true)
			const [prodRes, catRes] = await Promise.all([
				fetch(API_ENDPOINTS.PRODUCTS),
				fetch(API_ENDPOINTS.PRODUCTS_CATEGORIES),
			])
			const prodData = await prodRes.json()
			const catData = await catRes.json()

			setProducts(prodData.products || prodData.data || [])
			setCategories(Array.isArray(catData) ? catData : [])
		} catch (err) {
			console.error("Lỗi tải dữ liệu admin:", err)
			toast.error("Không thể tải danh sách sản phẩm")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (isAdmin) {
			loadData()
		}
	}, [isAdmin])

	// Logic tìm kiếm, lọc danh mục & phân trang
	const filteredProducts = products.filter((p) => {
		const matchesSearch =
			!searchTerm.trim() ||
			p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
			String(p.id) === searchTerm.trim()

		const matchesCategory =
			selectedCategoryFilter === "all" || p.category === selectedCategoryFilter

		return matchesSearch && matchesCategory
	})

	const totalItems = filteredProducts.length
	const totalPages =
		itemsPerPage === "all" ? 1 : Math.max(1, Math.ceil(totalItems / itemsPerPage))

	const validPage = Math.min(currentPage, totalPages)

	const displayedProducts =
		itemsPerPage === "all"
			? filteredProducts
			: filteredProducts.slice(
					(validPage - 1) * itemsPerPage,
					validPage * itemsPerPage,
				)

	// Xóa sản phẩm
	const handleDelete = async (id: number, title: string) => {
		if (!window.confirm(`Bạn có chắc chắn muốn xoá sản phẩm "${title}"?`)) return

		try {
			const res = await fetch(`${API_ENDPOINTS.PRODUCTS}/${id}`, {
				method: "DELETE",
			})
			if (res.ok) {
				toast.success(`Đã xoá sản phẩm #${id} thành công!`)
				setProducts((prev) => prev.filter((p) => p.id !== id))
			} else {
				throw new Error("Xoá thất bại")
			}
		} catch (err) {
			toast.error("Không thể xoá sản phẩm")
		}
	}

	// Thêm mới sản phẩm
	const handleCreateProduct = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!newTitle || !newPrice) {
			toast.error("Vui lòng điền tên và giá sản phẩm")
			return
		}

		try {
			const res = await fetch(API_ENDPOINTS.PRODUCTS, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: newTitle,
					category: newCategory,
					brand: newBrand || "TechNor",
					price: Number(newPrice),
					stock: Number(newStock) || 50,
					rating: 4.5,
					discountPercentage: 10,
					description:
						newDescription ||
						"Sản phẩm công nghệ cao cấp mới được thêm bởi quản trị viên.",
					image: "/uploads/10056304-dien-thoai-iphone-plus.webp",
				}),
			})
			const data = await res.json()

			if (res.ok) {
				toast.success("Thêm sản phẩm mới thành công!")
				setShowAddModal(false)
				// Reset form
				setNewTitle("")
				setNewPrice("")
				setNewBrand("")
				setNewDescription("")
				loadData()
			} else {
				throw new Error(data.message || "Thêm thất bại")
			}
		} catch (err: any) {
			toast.error(err.message || "Lỗi khi tạo sản phẩm")
		}
	}

	// Mở modal sửa sản phẩm
	const openEditModal = (p: Product) => {
		setEditingProduct(p)
		setEditTitle(p.title)
		setEditCategory(p.category || "smartphones")
		setEditBrand(p.brand || "")
		setEditPrice(String(p.price))
		setEditStock(String(p.stock ?? 50))
		setEditRating(String(p.rating ?? 4.5))
		setEditDiscount(String(p.discountPercentage ?? 0))
		setEditImage(p.image || p.thumbnail || "")
		setEditDescription(p.description || "")
	}

	// Cập nhật sản phẩm
	const handleUpdateProduct = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!editingProduct) return
		if (!editTitle || !editPrice) {
			toast.error("Vui lòng điền tên và giá sản phẩm")
			return
		}

		try {
			const res = await fetch(`${API_ENDPOINTS.PRODUCTS}/${editingProduct.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: editTitle,
					category: editCategory,
					brand: editBrand,
					price: Number(editPrice),
					stock: Number(editStock),
					rating: Number(editRating),
					discountPercentage: Number(editDiscount),
					description: editDescription,
					image: editImage,
				}),
			})
			const data = await res.json()

			if (res.ok) {
				toast.success(`Cập nhật sản phẩm #${editingProduct.id} thành công!`)
				setEditingProduct(null)
				loadData()
			} else {
				throw new Error(data.message || "Cập nhật thất bại")
			}
		} catch (err: any) {
			toast.error(err.message || "Lỗi khi cập nhật sản phẩm")
		}
	}

	// Nếu không phải ADMIN: Chặn truy cập và hiển thị thông báo phân quyền
	if (!isAdmin) {
		return (
			<div className="container mx-auto min-h-[80vh] px-4 py-16 flex items-center justify-center font-karla">
				<div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl border border-rose-200 dark:border-rose-900/60 p-8 text-center shadow-xl">
					<div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4">
						<FaLock size={28} />
					</div>
					<h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
						Từ Chối Truy Cập (403 Forbidden)
					</h1>
					<p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
						Trang này chỉ dành cho người dùng có vai trò{" "}
						<span className="font-bold text-purple-600 dark:text-purple-400">
							ADMIN (Quản trị viên)
						</span>
						. Tài khoản hiện tại của bạn là{" "}
						<span className="font-semibold">{role || "GUEST"}</span>.
					</p>
					<div className="space-y-2">
						<Link
							to="/"
							className="block w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold transition">
							Quay về trang chủ
						</Link>
						<p className="text-xs text-slate-400 mt-2">
							Mẹo: Đăng xuất và đăng nhập bằng tài khoản <b>admin@technor.com</b> /{" "}
							<b>admin123</b> để kiểm thử vai trò Admin.
						</p>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto min-h-[85vh] px-4 py-8 font-karla">
			{/* Header Admin */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
				<div>
					<div className="flex items-center gap-2 mb-1">
						<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-200 dark:border-purple-700 uppercase tracking-wide">
							<FaUserShield size={12} />
							<span>Admin Portal</span>
						</span>
					</div>
					<h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
						Bảng Điều Khiển Quản Trị
					</h1>
					<p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
						Xin chào, {user?.name || "Quản trị viên"}. Quản lý sản phẩm và danh mục từ
						database TechNor.
					</p>
				</div>

				<button
					type="button"
					onClick={() => setShowAddModal(true)}
					className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition cursor-pointer active:scale-95">
					<FaPlus size={14} />
					<span>Thêm Sản Phẩm Mới</span>
				</button>
			</div>

			{/* Thẻ thống kê (Metric Cards) */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
				<div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center gap-4">
					<div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
						<FaBoxOpen size={24} />
					</div>
					<div>
						<span className="text-xs text-slate-400 font-medium">Tổng sản phẩm</span>
						<h3 className="text-2xl font-black text-slate-800 dark:text-white">
							{products.length}
						</h3>
					</div>
				</div>

				<div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center gap-4">
					<div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
						<FaTags size={24} />
					</div>
					<div>
						<span className="text-xs text-slate-400 font-medium">
							Danh mục hoạt động
						</span>
						<h3 className="text-2xl font-black text-slate-800 dark:text-white">
							{categories.length}
						</h3>
					</div>
				</div>

				<div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center gap-4">
					<div className="p-3.5 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
						<FaUserShield size={24} />
					</div>
					<div>
						<span className="text-xs text-slate-400 font-medium">
							Quyền tài khoản
						</span>
						<h3 className="text-xl font-bold text-purple-600 dark:text-purple-400">
							ADMIN
						</h3>
					</div>
				</div>

				<div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-center gap-4">
					<div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
						<span className="text-xl font-bold">★</span>
					</div>
					<div>
						<span className="text-xs text-slate-400 font-medium">
							Đánh giá trung bình
						</span>
						<h3 className="text-2xl font-black text-slate-800 dark:text-white">
							4.7
						</h3>
					</div>
				</div>
			</div>

			{/* Bảng danh sách sản phẩm có Tìm kiếm, Lọc & Phân trang */}
			<div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm overflow-hidden">
				{/* Header & Toolbar */}
				<div className="p-5 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
							<span>Danh Sách Sản Phẩm trong Database</span>
							<span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
								{totalItems} sản phẩm
							</span>
						</h2>
						<p className="text-xs text-slate-400 mt-0.5">
							Xem, lọc, tìm kiếm và chỉnh sửa trực tiếp sản phẩm trong MySQL
						</p>
					</div>

					{/* Thanh công cụ tìm kiếm và lọc */}
					<div className="flex flex-wrap items-center gap-2.5">
						{/* Ô tìm kiếm */}
						<div className="relative min-w-[220px]">
							<FaSearch
								size={13}
								className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
							/>
							<input
								type="text"
								value={searchTerm}
								onChange={(e) => {
									setSearchTerm(e.target.value)
									setCurrentPage(1)
								}}
								placeholder="Tìm tên, ID, hãng..."
								className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/60 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
							/>
							{searchTerm && (
								<button
									type="button"
									onClick={() => {
										setSearchTerm("")
										setCurrentPage(1)
									}}
									className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600">
									✕
								</button>
							)}
						</div>

						{/* Lọc theo danh mục */}
						<select
							value={selectedCategoryFilter}
							onChange={(e) => {
								setSelectedCategoryFilter(e.target.value)
								setCurrentPage(1)
							}}
							className="px-3 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white outline-none">
							<option value="all">Tất cả danh mục</option>
							<option value="smartphones">Smartphones</option>
							<option value="laptops">Laptops</option>
							<option value="smartwatches">Smartwatches</option>
							<option value="tablets">Tablets</option>
							<option value="audio">Audio</option>
							<option value="gaming">Gaming</option>
							<option value="accessories">Accessories</option>
							<option value="smart-home">Smart Home</option>
						</select>

						{/* Chọn số lượng sản phẩm mỗi trang */}
						<div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
							<span>Hiện:</span>
							<select
								value={itemsPerPage}
								onChange={(e) => {
									const val = e.target.value
									setItemsPerPage(val === "all" ? "all" : Number(val))
									setCurrentPage(1)
								}}
								className="px-2.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-white outline-none cursor-pointer">
								<option value={10}>10 / trang</option>
								<option value={20}>20 / trang</option>
								<option value={50}>50 / trang</option>
								<option value="all">Tất cả ({products.length})</option>
							</select>
						</div>
					</div>
				</div>

				{loading ? (
					<div className="p-12 text-center">
						<div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
							<thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-400 font-semibold">
								<tr>
									<th className="px-4 py-3">ID</th>
									<th className="px-4 py-3">Hình ảnh</th>
									<th className="px-4 py-3">Tên sản phẩm</th>
									<th className="px-4 py-3">Danh mục</th>
									<th className="px-4 py-3">Giá</th>
									<th className="px-4 py-3">Kho</th>
									<th className="px-4 py-3">Đánh giá</th>
									<th className="px-4 py-3 text-right">Thao tác</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
								{displayedProducts.length === 0 ? (
									<tr>
										<td colSpan={8} className="px-4 py-12 text-center text-slate-400">
											Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
										</td>
									</tr>
								) : (
									displayedProducts.map((p) => (
										<tr
											key={p.id}
											className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition">
											<td className="px-4 py-3 font-mono font-bold text-slate-400">
												#{p.id}
											</td>
											<td className="px-4 py-3">
												<img
													src={getProductImageUrl(p.image || p.thumbnail)}
													alt={p.title}
													className="w-12 h-12 object-contain bg-white dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-700"
												/>
											</td>
											<td className="px-4 py-3 font-semibold text-slate-800 dark:text-white max-w-xs truncate">
												<Link
													to={`/product/${p.id}`}
													className="hover:text-purple-600 dark:hover:text-purple-400">
													{p.title}
												</Link>
											</td>
											<td className="px-4 py-3">
												<span className="capitalize px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
													{p.category}
												</span>
											</td>
											<td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">
												${Number(p.price).toFixed(2)}
											</td>
											<td className="px-4 py-3 font-medium">{p.stock ?? 0} chiếc</td>
											<td className="px-4 py-3 font-semibold text-amber-500">
												★ {p.rating}
											</td>
											<td className="px-4 py-3 text-right">
												<div className="flex items-center justify-end gap-1">
													<button
														type="button"
														onClick={() => openEditModal(p)}
														className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition cursor-pointer"
														title="Chỉnh sửa sản phẩm">
														<FaEdit size={15} />
													</button>
													<button
														type="button"
														onClick={() => handleDelete(p.id, p.title)}
														className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
														title="Xoá sản phẩm">
														<FaTrash size={14} />
													</button>
												</div>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>

						{/* Thanh phân trang Footer */}
						{totalItems > 0 && (
							<div className="p-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
								<div>
									{itemsPerPage === "all" ? (
										<span>
											Đang hiển thị <b>toàn bộ {totalItems}</b> sản phẩm
										</span>
									) : (
										<span>
											Hiển thị <b>{(validPage - 1) * (itemsPerPage as number) + 1}</b> -{" "}
											<b>{Math.min(validPage * (itemsPerPage as number), totalItems)}</b>{" "}
											trên tổng số <b>{totalItems}</b> sản phẩm
										</span>
									)}
								</div>

								{/* Các nút bấm trang */}
								{itemsPerPage !== "all" && totalPages > 1 && (
									<div className="flex items-center gap-1.5">
										<button
											type="button"
											onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
											disabled={validPage === 1}
											className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed">
											<FaChevronLeft size={10} />
										</button>

										{Array.from({ length: totalPages }, (_, idx) => idx + 1)
											.filter((page) => {
												// Hiển thị trang đầu, trang cuối, trang hiện tại và các trang liền kề
												return (
													page === 1 ||
													page === totalPages ||
													Math.abs(page - validPage) <= 1
												)
											})
											.map((page, idx, arr) => {
												const prev = arr[idx - 1]
												const hasGap = prev && page - prev > 1
												return (
													<span key={page} className="flex items-center">
														{hasGap && <span className="px-1 text-slate-400">...</span>}
														<button
															type="button"
															onClick={() => setCurrentPage(page)}
															className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
																validPage === page
																	? "bg-purple-600 text-white shadow-sm"
																	: "border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
															}`}>
															{page}
														</button>
													</span>
												)
											})}

										<button
											type="button"
											onClick={() =>
												setCurrentPage((prev) => Math.min(prev + 1, totalPages))
											}
											disabled={validPage === totalPages}
											className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed">
											<FaChevronRight size={10} />
										</button>
									</div>
								)}
							</div>
						)}
					</div>
				)}
			</div>

			{/* Modal Thêm sản phẩm mới */}
			{showAddModal && (
				<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
					<div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-700">
						<h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
							Thêm Sản Phẩm Mới (Database)
						</h2>

						<form onSubmit={handleCreateProduct} className="space-y-4 text-sm">
							<div>
								<label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
									Tên sản phẩm *
								</label>
								<input
									type="text"
									value={newTitle}
									onChange={(e) => setNewTitle(e.target.value)}
									placeholder="VD: Tai nghe Sony WH-1000XM5"
									className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-purple-500"
									required
								/>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div>
									<label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
										Danh mục
									</label>
									<select
										value={newCategory}
										onChange={(e) => setNewCategory(e.target.value)}
										className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 outline-none">
										<option value="smartphones">Smartphones</option>
										<option value="laptops">Laptops</option>
										<option value="smartwatches">Smartwatches</option>
										<option value="tablets">Tablets</option>
										<option value="accessories">Accessories</option>
										<option value="smart-home">Smart Home</option>
									</select>
								</div>

								<div>
									<label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
										Thương hiệu
									</label>
									<input
										type="text"
										value={newBrand}
										onChange={(e) => setNewBrand(e.target.value)}
										placeholder="VD: Sony"
										className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent outline-none"
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div>
									<label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
										Giá ($) *
									</label>
									<input
										type="number"
										step="0.01"
										value={newPrice}
										onChange={(e) => setNewPrice(e.target.value)}
										placeholder="299.99"
										className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent outline-none"
										required
									/>
								</div>

								<div>
									<label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
										Số lượng tồn kho
									</label>
									<input
										type="number"
										value={newStock}
										onChange={(e) => setNewStock(e.target.value)}
										placeholder="50"
										className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent outline-none"
									/>
								</div>
							</div>

							<div>
								<label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
									Mô tả chi tiết
								</label>
								<textarea
									rows={3}
									value={newDescription}
									onChange={(e) => setNewDescription(e.target.value)}
									placeholder="Mô tả các tính năng nổi bật của sản phẩm..."
									className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent outline-none resize-none"
								/>
							</div>

							<div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
								<button
									type="button"
									onClick={() => setShowAddModal(false)}
									className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer font-medium">
									Hủy
								</button>
								<button
									type="submit"
									className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold cursor-pointer shadow-md">
									Lưu Sản Phẩm
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Modal Chỉnh sửa sản phẩm */}
			{editingProduct && (
				<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
					<div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-700 my-8">
						<div className="flex items-center justify-between mb-4">
							<div>
								<span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
									PRODUCT #{editingProduct.id}
								</span>
								<h2 className="text-xl font-bold text-slate-800 dark:text-white">
									Chỉnh Sửa Sản Phẩm
								</h2>
							</div>
							<button
								type="button"
								onClick={() => setEditingProduct(null)}
								className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold">
								✕
							</button>
						</div>

						<form onSubmit={handleUpdateProduct} className="space-y-4 text-sm">
							<div>
								<label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
									Tên sản phẩm *
								</label>
								<input
									type="text"
									value={editTitle}
									onChange={(e) => setEditTitle(e.target.value)}
									placeholder="VD: iPhone 15 Pro Max"
									className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent outline-none focus:ring-2 focus:ring-purple-500"
									required
								/>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div>
									<label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
										Danh mục
									</label>
									<select
										value={editCategory}
										onChange={(e) => setEditCategory(e.target.value)}
										className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 outline-none">
										<option value="smartphones">Smartphones</option>
										<option value="laptops">Laptops</option>
										<option value="smartwatches">Smartwatches</option>
										<option value="tablets">Tablets</option>
										<option value="audio">Audio</option>
										<option value="gaming">Gaming</option>
										<option value="accessories">Accessories</option>
										<option value="smart-home">Smart Home</option>
									</select>
								</div>

								<div>
									<label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
										Thương hiệu
									</label>
									<input
										type="text"
										value={editBrand}
										onChange={(e) => setEditBrand(e.target.value)}
										placeholder="VD: Apple"
										className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent outline-none"
									/>
								</div>
							</div>

							<div className="grid grid-cols-3 gap-3">
								<div>
									<label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
										Giá ($) *
									</label>
									<input
										type="number"
										step="0.01"
										value={editPrice}
										onChange={(e) => setEditPrice(e.target.value)}
										className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent outline-none"
										required
									/>
								</div>

								<div>
									<label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
										Tồn kho
									</label>
									<input
										type="number"
										value={editStock}
										onChange={(e) => setEditStock(e.target.value)}
										className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent outline-none"
									/>
								</div>

								<div>
									<label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
										Giảm giá (%)
									</label>
									<input
										type="number"
										step="0.1"
										value={editDiscount}
										onChange={(e) => setEditDiscount(e.target.value)}
										className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent outline-none"
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div>
									<label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
										Đánh giá (Rating 0-5)
									</label>
									<input
										type="number"
										step="0.1"
										min="0"
										max="5"
										value={editRating}
										onChange={(e) => setEditRating(e.target.value)}
										className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent outline-none"
									/>
								</div>

								<div>
									<label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
										Đường dẫn ảnh
									</label>
									<input
										type="text"
										value={editImage}
										onChange={(e) => setEditImage(e.target.value)}
										placeholder="/uploads/... hoặc URL"
										className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent outline-none"
									/>
								</div>
							</div>

							<div>
								<label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
									Mô tả chi tiết
								</label>
								<textarea
									rows={3}
									value={editDescription}
									onChange={(e) => setEditDescription(e.target.value)}
									placeholder="Mô tả các đặc điểm của sản phẩm..."
									className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-transparent outline-none resize-none"
								/>
							</div>

							<div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
								<button
									type="button"
									onClick={() => setEditingProduct(null)}
									className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer font-medium">
									Hủy bỏ
								</button>
								<button
									type="submit"
									className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold cursor-pointer shadow-md">
									Lưu Thay Đổi
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	)
}

export default AdminDashboard
