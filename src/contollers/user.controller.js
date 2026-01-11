import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generaAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    // console.log(accessToken)
    return {
      refreshToken,
      accessToken,
    };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
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
  const { fullName, email, username, password } = req.body;
  // console.log(email)

  // if(fullName===""){
  //     throw new ApiError(400,"fullname is required")
  // }
  const fields = [fullName, email, username, password];
  if (fields.some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required!!");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username exists!!");
  }
  // console.log(existedUser)
  // req.files?.avatar[0]?.path
  // console.log(req.files)
  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  // console.log(avatarLocalPath)
  // console.log(coverImageLocalPath)
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  // console.log("Avatar : ",avatar)
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required here");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while registering the user!!"
    );
  }
  console.log("User created successfully!!");
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully!!"));
});

const loginUser = asyncHandler(async (req, res) => {
  //take username/email and password from user
  //validation- not empty
  //username exist or not
  //then check password corresponding to it
  //accesstoken and refresh token
  //if matched then return response

  const { email, username, password } = req.body;
  if (!email && !username) {
    throw new ApiError(400, "Any of Username or Email is required ");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!existedUser) {
    throw new ApiError(404, "User does not exists");
  }
  if (!password) {
    throw new ApiError(400, "Password is required!!");
  }
  const passwordMatched = await existedUser.isPasswordCorrect(password);
  if (!passwordMatched) {
    throw new ApiError(400, "Password is incorrect");
  }
  // console.log("Valid User");
  // const user = existedUser.select(" -password")
  //select works only with mongo functions
  const { refreshToken, accessToken } = await generaAccessAndRefreshTokens(
    existedUser._id
  );
  const loggedInUser = await User.findById(existedUser._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { newRefreshToken, accessToken } = await generaAccessAndRefreshTokens(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed!"
        )
      );
  } catch (error) {
    throw new ApiError(401,error?.message ||"Invalid refresh token")
  }
});

export { registerUser, loginUser, logoutUser,refreshAccessToken };
