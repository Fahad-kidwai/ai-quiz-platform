import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Quiz } from "../models/quiz.model.js";

const createQuiz = asyncHandler(async (req, res) => {
  const { title, topic, difficulty = "Medium" } = req.body;
  if ([title, topic].some((field) => !field)) {
    throw new ApiError(400, "Fill all the fields");
  }
  const quiz = await Quiz.create({
    title,
    author: req.user._id,
    topic,
    difficulty,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, quiz, "Quiz successfuly generated"));
});

const getQuizById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const quiz = await Quiz.findById(id).populate("allQuestions"); // CPopulate does not show in response
  // console.log(quiz.allQuestions);
  // console.log("quiz", quiz);
  if (!quiz) throw new ApiError(404, "Quiz not found");

  return res
    .status(201)
    .json(new ApiResponse(201, quiz, "Quiz fetched successfully"));
});

const getQuizzesByAuthor = asyncHandler(async (req, res) => {
  const id = req.user._id;
  const quizzes = await Quiz.find({ author: id });

  if (!quizzes.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No quizzes found for this author"));
  }

  return res
    .status(201)
    .json(new ApiResponse(201, quizzes, "Quizzes fetched successfully"));
});

export { createQuiz, getQuizById, getQuizzesByAuthor };
