import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import {
  createQuestion,
  getAllQuestionById,
} from "../controllers/question.controller";

const router = Router();

router.route("/create").post(verifyJwt, createQuestion);
router.route("/get-all-questions/:quizId").get(verifyJwt, getAllQuestionById);

export default router;
