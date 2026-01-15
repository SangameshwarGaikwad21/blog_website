import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://blogging-website-1-y5mf.onrender.com/api/v1",
  withCredentials: true,
});
export default axiosInstance;

