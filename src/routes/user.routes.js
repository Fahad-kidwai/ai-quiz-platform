import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import {
  loginUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/user.controller";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-access-token").post(verifyJwt, refreshAccessToken);

export default router;
