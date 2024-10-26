import { Question } from "../models/question.model";
import { ApiError } from "../utils/apiErrors";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const createQuestion = asyncHandler(async (req, res) => {
  const { quizId, text, options, correctAnswer } = req.body;
  if ([quizId, text, options, correctAnswer].some((f) => !f))
    throw new ApiError(400, "Fill al the fields");
  if (!options.includes(correctAnswer)) {
    throw new ApiError(
      400,
      "Correct answer must be one of the options provided"
    );
  }
  const question = await Question.create({
    quizId,
    text,
    options,
    correctAnswer,
  });

  return res.status(201).json(new ApiResponse(201, question, ""));
});

const getAllQuestionById = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  if (!quizId) throw new ApiError(401, "Id is required");

  const questions = await Question.find({ quizId });

  if (!questions.length) {
    throw new ApiError(404, "No questions found for this quiz");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, questions, "Questions fetched successfully"));
});

export { createQuestion, getAllQuestionById };
