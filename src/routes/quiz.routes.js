import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createQuiz,
  getQuizById,
  getQuizzesByAuthor,
} from "../controllers/quiz.controller.js";

const router = Router();

router.route("/create").post(verifyJwt, createQuiz);
router.route("/get-by-id:id").get(verifyJwt, getQuizById);
router.route("/get-by-author").get(verifyJwt, getQuizzesByAuthor);

export default router;
