import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  addMultipleQuestions,
  addQuestion,
  getAllQuestionById,
} from "../controllers/question.controller.js";

const router = Router();

router.route("/add").post(verifyJwt, addQuestion);
router.route("/add-multiple").post(verifyJwt, addMultipleQuestions);
router.route("/get-all-questions/:quizId").get(verifyJwt, getAllQuestionById);

export default router;
