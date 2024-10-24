import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiErrors.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Quiz } from "../models/quiz.model.js";

const createQuiz = asyncHandler(async (req, res) => {
  const { title, author, topic, difficulty } = req.body;
  if ([title, author, topic].some((field) => field === "")) {
    throw new ApiError(400, "Fill all the fields");
  }

  const quiz = await Quiz.create({
    title,
    author,
    topic,
    difficulty,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, quiz, "Quiz successfuly generated"));
});

export { createQuiz };
