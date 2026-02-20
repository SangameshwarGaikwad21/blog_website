
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) throw new Error("File path is required");

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto", // works for images/videos
    });

    return result;

  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
};

export {uploadOnCloudinary}