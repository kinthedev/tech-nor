import { type FC, useState } from "react"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import {
	MdFavoriteBorder,
	MdOutlineAccountCircle,
	MdOutlineLogout,
	MdAdminPanelSettings,
} from "react-icons/md"
import { doLogout } from "../redux/features/authSlice"
import { Link } from "react-router-dom"

const CustomPopup: FC = () => {
	const dispatch = useAppDispatch()
	const [isVisible, setVisible] = useState(false)
	const username = useAppSelector((state) => state.authReducer.username)
	const role = useAppSelector((state) => state.authReducer.role)

	const handlePopup = () => {
		setVisible((v) => !v)
	}

	const handleLogout = () => {
		dispatch(doLogout())
		hidePopup()
	}

	const hidePopup = () => {
		setVisible(false)
	}

	return (
		<div className="relative font-karla">
			<div
				className="inline-flex items-center gap-1.5 cursor-pointer hover:opacity-85 dark:text-white"
				onClick={handlePopup}
				data-test="username-popup">
				<span>{username}</span>
				{role === "ADMIN" && (
					<span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
						ADMIN
					</span>
				)}
			</div>
			{isVisible && (
				<div
					className="absolute p-4 left-[-60px] w-48 z-50 mt-2 rounded-xl shadow-2xl bg-white border border-slate-100 dark:border-slate-700 transition-all focus:outline-none dark:bg-slate-700 dark:text-white"
					data-test="popup-content-list">
					<table className="w-full">
						<tbody className="space-y-1">
							{role === "ADMIN" && (
								<tr>
									<td className="text-center w-6 text-indigo-600 dark:text-indigo-400">
										<MdAdminPanelSettings size={20} />
									</td>
									<td className="hover:underline cursor-pointer text-base pl-2 font-bold text-indigo-600 dark:text-indigo-400">
										<Link to="/admin" onClick={hidePopup}>
											Admin Panel
										</Link>
									</td>
								</tr>
							)}
							<tr>
								<td className="text-center w-6">
									<MdOutlineAccountCircle size={20} />
								</td>
								<td className="hover:underline cursor-pointer text-base pl-2">
									<Link to="/account" onClick={hidePopup}>
										Your Account
									</Link>
								</td>
							</tr>
							<tr>
								<td className="text-center">
									<MdFavoriteBorder />
								</td>
								<td
									className="hover:underline cursor-pointer text-lg pl-2"
									data-test="wishlist-container">
									<Link to="/wishlist" onClick={hidePopup}>
										Wishlist
									</Link>
								</td>
							</tr>
							<tr>
								<td className="text-center">
									<MdOutlineLogout />
								</td>
								<td
									className="hover:underline cursor-pointer text-lg pl-2"
									onClick={handleLogout}
									data-test="logout-btn">
									Logout
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			)}
		</div>
	)
}

export default CustomPopup
