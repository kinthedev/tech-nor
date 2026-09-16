import axios from "axios"

const axiosInstance = axios.create({
	baseURL: "http://localhost:5000/api/v1", // URL của Backend Express
	headers: {
		"Content-Type": "application/json",
	},
})
export default axiosInstance
