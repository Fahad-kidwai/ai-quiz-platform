import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createQuiz,
  getQuizById,
  getQuizzesByAuthor,
} from "../controllers/quiz.controller.js";

const router = Router();

router.route("/create-quiz").post(verifyJwt, createQuiz);
router.route("/get-quiz:id").get(verifyJwt, getQuizById);
router.route("/get-quiz-by-author").get(verifyJwt, getQuizzesByAuthor);

export default router;
