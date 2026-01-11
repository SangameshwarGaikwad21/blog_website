import axiosInstance from "./axios";


export const createBlog = async (data) => {
  const res = await axiosInstance.post("/posts/createPost", data);
  console.log("DATA:",data)
  return res.data;
}


export const getSingleBlog = async (postId) => {
  try {
    const res = await axiosInstance.get(`/posts/${postId}`);
    console.log("Fetched blog:", res.data);
     return res.data.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw error;
  }
};


export const updateBlog=async()=>{
  try {
    const res=await axiosInstance.patch(`/posts/${postId}`)
    return res.data.data;
  } 
  catch (error) {
    console.logg("Update Blog Error",error)
  }
}


export const getAllBlog=async()=>{
  try {
    const res=await axiosInstance.get("/posts")
    return res.data;
  } 
  catch (error) {
      console.log("Not getting the data from frontend",error)
  }
}