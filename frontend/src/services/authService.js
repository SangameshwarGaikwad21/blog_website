import axiosInstance from "./axios";

export const registerUser = async (data) => {
  const res = await axiosInstance.post("/users/register", data);
  return res.data;
};


export const loginUser=async(data)=>{
  const res=await axiosInstance.post("/users/login",data)
  return res.data;
}

export const logout=async(data)=>{
  const res=await axiosInstance.post("/users/logout",data)
  return res.data;
}

export const getProfile=async(data)=>{
  const res=await axiosInstance.get("/users/me",data)
  return res.data;
}


export const changeDetails=async(data)=>{
  const res=await axiosInstance.patch("/users/change-details",data)
  return res.data
}

export const changeAvatar=async(data)=>{
  const res=await axiosInstance.post("/users/change-avatar",data)
  return res.data
}

