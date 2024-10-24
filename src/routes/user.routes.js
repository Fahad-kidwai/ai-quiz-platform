import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/current-user").get(verifyJwt, getCurrentUser);
router.route("/refresh-access-token").post(verifyJwt, refreshAccessToken);

export default router;
