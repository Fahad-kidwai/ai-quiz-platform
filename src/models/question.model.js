import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema(
  {
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
    text: { type: String, required: true },
    options: [
      {
        type: String,
        // validate: {
        //   validator: function (v) {
        //     return v.length >= 2;
        //   },
        //   message: "A question must have at least two options.",
        // }, CHECK VALIDATION
      },
    ],
    correctAnswer: {
      type: String,
      // validate: {
      //   validator: function (v) {
      //     this.options.includes(v);
      //   },
      //   message: "Correct answer must be one of the options",
      // },
      required: [true, "Correct answer is required"],
    },
  },
  { timestamps: true }
);




export const Question = mongoose.model("Question", questionSchema);
