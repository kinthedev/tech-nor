import { type FC } from "react"
import { useAppSelector } from "../redux/hooks"
import { FaUserShield, FaUserCheck } from "react-icons/fa"
import { Link } from "react-router-dom"

const Profile: FC = () => {
	const user = useAppSelector((state) => state.authReducer.user)
	const role = useAppSelector((state) => state.authReducer.role)
	const username = useAppSelector((state) => state.authReducer.username)

	const isAdmin = role === "ADMIN"

	return (
		<div className="container mx-auto min-h-[85vh] px-4 py-8 font-karla max-w-4xl">
			<div className="mb-8">
				<h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
					Thông Tin Tài Khoản
				</h1>
				<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
					Xem chi tiết hồ sơ cá nhân và quyền hạn người dùng trên hệ thống
				</p>
			</div>

			<div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 p-6 sm:p-8 shadow-sm">
				{/* Avatar & Tên & Vai trò */}
				<div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-200 dark:border-slate-700/60">
					<div
						className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-sm ${
							isAdmin
								? "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
								: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
						}`}>
						{isAdmin ? <FaUserShield /> : <FaUserCheck />}
					</div>

					<div className="text-center sm:text-left flex-1">
						<div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
							<h2 className="text-2xl font-bold text-slate-800 dark:text-white">
								{user?.name || username || "Người Dùng"}
							</h2>
							<span
								className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
									isAdmin
										? "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-200 dark:border-purple-700"
										: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
								}`}>
								{isAdmin ? "Quản Trị Viên (ADMIN)" : "Khách Hàng (USER)"}
							</span>
						</div>
						<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
							{user?.email || "Chưa có email"}
						</p>

						{isAdmin && (
							<div className="mt-3">
								<Link
									to="/admin"
									className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition">
									Truy cập Bảng Quản Trị (Admin Dashboard) →
								</Link>
							</div>
						)}
					</div>
				</div>

				{/* Bảng thông số chi tiết */}
				<div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
					<div className="space-y-4">
						<h3 className="font-bold text-slate-700 dark:text-slate-200 text-base">
							Thông tin cơ bản
						</h3>
						<div>
							<span className="block text-xs text-slate-400 font-medium">
								Mã tài khoản (ID)
							</span>
							<span className="font-semibold text-slate-800 dark:text-white">
								#{user?.id || 1}
							</span>
						</div>
						<div>
							<span className="block text-xs text-slate-400 font-medium">
								Họ và tên
							</span>
							<span className="font-semibold text-slate-800 dark:text-white">
								{user?.name || "Chưa cập nhật"}
							</span>
						</div>
						<div>
							<span className="block text-xs text-slate-400 font-medium">
								Địa chỉ Email
							</span>
							<span className="font-semibold text-slate-800 dark:text-white">
								{user?.email}
							</span>
						</div>
					</div>

					<div className="space-y-4">
						<h3 className="font-bold text-slate-700 dark:text-slate-200 text-base">
							Quyền hạn & Địa chỉ
						</h3>
						<div>
							<span className="block text-xs text-slate-400 font-medium">
								Vai trò hệ thống (Role)
							</span>
							<span className="font-semibold text-slate-800 dark:text-white">
								{role}
							</span>
						</div>
						<div>
							<span className="block text-xs text-slate-400 font-medium">
								Địa chỉ giao hàng
							</span>
							<span className="font-semibold text-slate-800 dark:text-white">
								{user?.address || "Chưa có địa chỉ mặc định"}
							</span>
						</div>
						<div>
							<span className="block text-xs text-slate-400 font-medium">
								Trạng thái tài khoản
							</span>
							<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
								<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
								Đang hoạt động (Active)
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Profile
