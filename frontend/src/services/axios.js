import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const axiosInstance = axios.create({
  baseURL:process.env.VITE_URL,
  withCredentials: true,
});
export default axiosInstance;

