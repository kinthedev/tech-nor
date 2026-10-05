import { type FC, type FormEvent, useState } from "react"
import { useAppSelector, useAppDispatch } from "../redux/hooks"
import { loginSuccess, updateModal } from "../redux/features/authSlice"
import { FaLock, FaUserShield, FaUserCheck } from "react-icons/fa"
import { RiLockPasswordLine, RiMailLine, RiUserLine } from "react-icons/ri"
import { RxCross2 } from "react-icons/rx"
import { API_ENDPOINTS } from "../api"
import toast from "react-hot-toast"
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google"

const GOOGLE_ENABLED = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID)

const LoginModal: FC = () => {
	const [isRegister, setIsRegister] = useState(false)
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [name, setName] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState("")

	const dispatch = useAppDispatch()
	const open = useAppSelector((state) => state.authReducer.modalOpen)

	const handleQuickFill = (role: "ADMIN" | "USER") => {
		if (role === "ADMIN") {
			setEmail("admin@technor.com")
			setPassword("admin123")
		} else {
			setEmail("user@technor.com")
			setPassword("user123")
		}
		setError("")
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError("")
		setLoading(true)

		try {
			if (isRegister) {
				// Đăng ký tài khoản
				const res = await fetch(API_ENDPOINTS.AUTH_REGISTER, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password, name }),
				})
				const data = await res.json()

				if (!res.ok) {
					throw new Error(data.message || "Đăng ký thất bại")
				}

				const user = data.user || data.data
				dispatch(loginSuccess(user))
				toast.success(`Đăng ký thành công! Chào mừng ${user.name || user.email}`)
				setIsRegister(false)
			} else {
				// Đăng nhập
				const res = await fetch(API_ENDPOINTS.AUTH_LOGIN, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				})
				const data = await res.json()

				if (!res.ok) {
					throw new Error(data.message || "Tài khoản hoặc mật khẩu không chính xác")
				}

				const user = data.user || data.data
				dispatch(loginSuccess(user))
				toast.success(
					`Đăng nhập thành công với vai trò: ${user.role === "ADMIN" ? "Quản trị viên (ADMIN)" : "Khách hàng (USER)"}`,
					{ duration: 4000 },
				)
			}
		} catch (err: any) {
			setError(err.message || "Đã xảy ra lỗi, vui lòng thử lại")
			toast.error(err.message || "Lỗi đăng nhập")
		} finally {
			setLoading(false)
		}
	}

	/**
	 * Google gọi hàm này sau khi user chọn tài khoản Gmail thành công.
	 * response.credential = ID token (JWT) do Google ký. Frontend KHÔNG tự tin token này,
	 * mà gửi nguyên văn lên backend để backend xác minh với Google rồi mới tạo/tìm user.
	 */
	const handleGoogleSuccess = async (response: CredentialResponse) => {
		if (!response.credential) {
			toast.error("Không nhận được thông tin từ Google")
			return
		}
		setError("")
		setLoading(true)
		try {
			const res = await fetch(API_ENDPOINTS.AUTH_GOOGLE, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ credential: response.credential }),
			})
			const data = await res.json()
			if (!res.ok) {
				throw new Error(data.message || "Đăng nhập Google thất bại")
			}

			const user = data.user || data.data
			dispatch(loginSuccess(user)) // dùng chung action với đăng nhập thường
			toast.success(`Xin chào ${user.name || user.email}! Đăng nhập Google thành công`)
		} catch (err: any) {
			setError(err.message)
			toast.error(err.message)
		} finally {
			setLoading(false)
		}
	}

	if (!open) return null

	return (
		<div className="bg-black/60 backdrop-blur-sm w-full min-h-screen fixed inset-0 z-50 flex items-center justify-center p-4 font-karla transition-all duration-300">
			<div
				className="relative border border-gray-200 dark:border-slate-700 shadow-2xl rounded-2xl p-6 sm:p-8 bg-white max-w-md w-full z-50 dark:bg-slate-800 dark:text-white transform transition-all"
				data-test="login-container">
				{/* Nút đóng */}
				<button
					onClick={() => dispatch(updateModal(false))}
					className="absolute cursor-pointer right-5 top-5 text-gray-400 hover:text-gray-700 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition"
					aria-label="Đóng modal">
					<RxCross2 size={20} />
				</button>

				{/* Header */}
				<div className="text-center mb-6">
					<div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 mb-3">
						<FaLock size={20} />
					</div>
					<h3 className="font-bold text-2xl tracking-tight">
						{isRegister ? "Đăng Ký Tài Khoản" : "Đăng Nhập TechNor"}
					</h3>
					<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
						{isRegister
							? "Tạo tài khoản để trải nghiệm mua sắm công nghệ"
							: "Đăng nhập để xem quyền hạn theo vai trò (Role)"}
					</p>
				</div>

				{/* Phím tắt điền nhanh để test vai trò (Admin / User) */}
				{!isRegister && (
					<div className="mb-5 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
						<span className="text-xs font-semibold text-slate-500 dark:text-slate-300 block mb-2">
							⚡ Chọn nhanh tài khoản kiểm thử:
						</span>
						<div className="grid grid-cols-2 gap-2">
							<button
								type="button"
								onClick={() => handleQuickFill("ADMIN")}
								className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-medium bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 transition cursor-pointer border border-purple-200 dark:border-purple-800">
								<FaUserShield size={12} />
								<span>Admin (Quản trị)</span>
							</button>
							<button
								type="button"
								onClick={() => handleQuickFill("USER")}
								className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-medium bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 transition cursor-pointer border border-blue-200 dark:border-blue-800">
								<FaUserCheck size={12} />
								<span>User (Khách hàng)</span>
							</button>
						</div>
					</div>
				)}

				{/* Thông báo lỗi nếu có */}
				{error && (
					<div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-900">
						{error}
					</div>
				)}

				{/* Form */}
				<form onSubmit={handleSubmit} className="space-y-4">
					{isRegister && (
						<div>
							<label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
								Họ và tên
							</label>
							<div className="relative">
								<input
									type="text"
									placeholder="Nguyễn Văn A"
									className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition text-sm"
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
								<RiUserLine className="absolute left-3 top-3 text-gray-400 text-lg" />
							</div>
						</div>
					)}

					<div>
						<label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
							Email hoặc Tên đăng nhập
						</label>
						<div className="relative">
							<input
								type="text"
								placeholder="admin@technor.com hoặc user@technor.com"
								className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition text-sm"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
							<RiMailLine className="absolute left-3 top-3 text-gray-400 text-lg" />
						</div>
					</div>

					<div>
						<label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
							Mật khẩu
						</label>
						<div className="relative">
							<input
								type="password"
								placeholder="••••••••"
								className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-transparent focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition text-sm"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<RiLockPasswordLine className="absolute left-3 top-3 text-gray-400 text-lg" />
						</div>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-medium text-sm transition shadow-sm hover:shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
						{loading ? "Đang xử lý..." : isRegister ? "Tạo Tài Khoản" : "Đăng Nhập"}
					</button>
				</form>

				{/* ===== Đăng nhập bằng Google ===== */}
				<div className="flex items-center gap-3 my-5">
					<div className="flex-1 h-px bg-gray-200 dark:bg-slate-600" />
					<span className="text-xs text-gray-400">hoặc</span>
					<div className="flex-1 h-px bg-gray-200 dark:bg-slate-600" />
				</div>
				{GOOGLE_ENABLED ? (
					<div className="flex justify-center">
						{/* Nút chính thức của Google: mở popup chọn tài khoản Gmail */}
						<GoogleLogin
							onSuccess={handleGoogleSuccess}
							onError={() => {
								toast.error("Đăng nhập Google bị huỷ hoặc thất bại")
							}}
							text={isRegister ? "signup_with" : "signin_with"}
							shape="pill"
						/>
					</div>
				) : (
					<p className="text-xs text-center text-amber-600 dark:text-amber-400">
						Đăng nhập Google chưa bật: thiếu VITE_GOOGLE_CLIENT_ID trong frontend/.env
					</p>
				)}

				{/* Chuyển đổi Đăng nhập / Đăng ký */}
				<div className="text-center mt-5 text-sm text-gray-500 dark:text-gray-400">
					{isRegister ? (
						<p>
							Đã có tài khoản?{" "}
							<button
								type="button"
								className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer ml-1"
								onClick={() => {
									setIsRegister(false)
									setError("")
								}}>
								Đăng nhập ngay
							</button>
						</p>
					) : (
						<p>
							Chưa có tài khoản?{" "}
							<button
								type="button"
								className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer ml-1"
								onClick={() => {
									setIsRegister(true)
									setError("")
								}}>
								Đăng ký tài khoản
							</button>
						</p>
					)}
				</div>
			</div>
		</div>
	)
}

export default LoginModal
