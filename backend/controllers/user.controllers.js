import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import asyncHandler from "../utils/asyncHandler.js"
import { User } from "../models/userModels.js"

const registerUser = asyncHandler(async (req, res) => {

    const { username, email, password } = req.body

    if (!username || !email || !password) {
        throw new ApiError(400, "All fields are required")
    }

    const userExisted = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (userExisted) {
        throw new ApiError(409, "User already registered")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar?.url) {
        throw new ApiError(500, "Avatar upload failed")
    }

    const user = await User.create({
        username,
        email,
        password,
        avatar: avatar.url
    })

    const createdUser = await User.findById(user._id)
        .select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "User registration failed")
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    )
})


export { registerUser }
