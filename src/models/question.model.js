import mongoose, { Schema } from "mongoose";
import { ApiError } from "../utils/apiErrors.js";

const questionSchema = new Schema(
  {
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    text: { type: String, required: true },
    options: [
      {
        type: String,
        validate: {
          validator: function (v) {
            return v.length >= 2;
          },
          message: "A question must have at least two options.",
        },
      },
    ],
    correctAnswer: {
      type: String,
      required: [true, "Correct answer is required"],
    },
  },
  { timestamps: true }
);

questionSchema.pre("save", function (next) {
  if (!this.options.includes(this.correctAnswer)) {
    return next(new Error("Correct answer must be one of the options"));
  }
  next();
});

questionSchema.methods.isCorrectAnswer = function (answer) {
  return this.correctAnswer === answer;
};

questionSchema.statics.addMultipleQuestions = async function (questionsArray) {
  // questionsArray.forEach((question) => {
  //   if (!question.options.includes(question.correctAnswer))
  //     throw new ApiError(
  //       401,
  //       `Correct answer must be one of the options for question: ${question.text}`
  //     );
  // });
  return await this.insertMany(questionsArray);
};


export const Question = mongoose.model("Question", questionSchema);
