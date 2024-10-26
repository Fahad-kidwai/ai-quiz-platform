import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJwt = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies.accesstoken ||
      req.headers("Authorization")?.replace("Bearer", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    if (!user) throw new ApiError(401, "Invalid access token");
    req.user = user;
    console.log("id", req.user);
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
