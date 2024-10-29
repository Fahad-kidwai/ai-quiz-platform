import { Question } from "../models/question.model.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addQuestion = asyncHandler(async (req, res) => {
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

const addMultipleQuestions = asyncHandler(async (req, res) => {
  const questionsArray = req.body.questions;
  if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
    throw new ApiError(
      400,
      "Questions array is required and should not be empty."
    );
  }
  questionsArray.forEach((question) => {
    const { quizId, text, options, correctAnswer } = question;
    if ([quizId, text, options, correctAnswer].some((f) => !f))
      throw new ApiError(400, "Fill all the fields");
    if (!question.options.includes(correctAnswer)) {
      throw new ApiError(
        400,
        `Correct answer must be one of the options for question: ${question.text}`
      );
    }
  });

  const addedQuestions = await Question.addMultipleQuestions(questionsArray);
  return res
    .status(200)
    .json(new ApiResponse(200, addedQuestions, "Questions Added Succesfully"));
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

const verifyAnswer = asyncHandler(async (req, res) => {
  const { questioId, answer } = req.body;
  const question = Question.findById(questioId);
  if (!question) throw new ApiError(404, "Question not found");
  const isCorrect = question.isCorrectAnswer(answer);

  return res
    .status(200)
    .json(new ApiResponse(200, isCorrect, "Answer verified"));
});

export { addQuestion, getAllQuestionById, addMultipleQuestions, verifyAnswer };
