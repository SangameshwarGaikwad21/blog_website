import axiosInstance from "./axios";


export const createBlog = async (data) => {
  const res = await axiosInstance.post("/posts/createPost", data);
  console.log("DATA:",data)
  return res.data;
}
