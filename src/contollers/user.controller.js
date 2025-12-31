import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req,res)=>{
    // res.status(200).json({
    //     message:"ok"
    // })
    //take data from user - username,pass,etc..
    //check not empty fields & whether user already exists or not(username,email)
    //check for images,avatar
    //upload them to cloudinary,avatar
    //create user object - create entry in db
    //remove password and refresh token field from response 
    //check for user creation
    //return response 
    // console.log(req.body)
    const {fullName,email,username,password} = req.body;
    // console.log(email)
    
    // if(fullName===""){
    //     throw new ApiError(400,"fullname is required")
    // }
    const fields = [fullName,email,username,password]
    if(fields.some(field=>field?.trim()==="")){
        throw new ApiError(400,"All fields are required!!")
    }
    
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username exists!!")
    }
    // console.log(existedUser)
    // req.files?.avatar[0]?.path
    // console.log(req.files)
    const avatarLocalPath = req.files?.avatar[0]?.path
    let  coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0 ){
        coverImageLocalPath = req.files.coverImage[0].path
    }
    // console.log(avatarLocalPath)
    // console.log(coverImageLocalPath)
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    // console.log("Avatar : ",avatar)
    if(!avatar){
        throw new ApiError(400,"Avatar file is required here")
    }

    const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        password,
        username
    })
    
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user!!")
    }
    console.log("User created successfully!!")
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully!!")
    )

})

export {registerUser}