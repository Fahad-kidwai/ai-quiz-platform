import mongoose, { Schema } from "mongoose";

const quizSchema = new Schema(
  {
    title: { type: String, required: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: true,
    }, // make sure this is required to prevent orphan quizzes
    topic: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
  },
  { timestamps: true }
);

// quizSchema.methods.

export const Quiz = mongoose.model("Quiz", quizSchema);
