import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createQuiz } from "../controllers/quiz.controller.js";

const router = Router();

router.route("/create-quiz").post(verifyJwt, createQuiz);

export default router;
