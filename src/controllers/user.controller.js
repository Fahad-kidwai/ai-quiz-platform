// import { json } from "express";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  console.log({ req });
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => field.trim() === "")) {
    throw new ApiError(400, "Fill all the fields");
  }

  const existedUser = await User.findOne({ email: email });
  if (existedUser) throw new ApiError(409, "User with email already existed");

  const user = await User.create({
    name,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser)
    throw new ApiError(500, "Something went wrong while registring user");

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  const { email, password } = req.body;

  if (!email && !password) {
    throw new ApiError(400, "Credentiantials are required");
  }
  const user = await User.findOne({ email });

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) throw new ApiError(401, "incorrect password");

  const { refreshToken, accessToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  user.accessToken = accessToken; // did not fetch user from db to minimize time

  user.password = undefined; // hide password in user respone
  user.refreshToken = undefined;

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accesstoken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user, refreshToken, accessToken },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accesstoken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) throw new ApiError(401, "unauthorized request");

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = User.findById(decodedToken._id);

    if (!user) throw new ApiError(401, "Invalid refresh token");

    if (incomingRefreshToken !== user.refreshToken)
      throw new ApiError(401, "Refresh token is expired");

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(201)
      .cookie("accessToken", accessToken)
      .json(new ApiResponse(201, { accessToken }, "Access Token refreshed"));
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User fetched successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
};
