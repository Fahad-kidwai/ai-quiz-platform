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
    topic: { type: String, required: true, trim: true },
    difficulty: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
  },
  { timestamps: true },
  { toJSON: { virtual: true } },
  { toObject: { virtual: true } }
);

quizSchema.virtual("allQuestions", {
  ref: "Question", // The model to populate
  localField: "_id", // The field in the quiz schema (foreign key)
  foreignField: "quizId", // The field in the User schema (primary key)
});

quizSchema.virtual("questionCount", {
  ref: "Question",
  localField: "_id",
  foreignField: "quizId",
  count: true, // this will only return the count of documents
});

// quizSchema.methods.
quizSchema.methods.getTotalQuestions = async function () {
  const questionCount = await mongoose.model("Question").countDocuments({
    quizId: this._id,
  });
  return questionCount;
};

quizSchema.statics.findByTopic = function (topic) {
  return this.find({ topic });
};

quizSchema.post("remove", async function (doc) {
  await mongoose.model("Question").deleteMany({ quizId: doc._id });
});

export const Quiz = mongoose.model("Quiz", quizSchema);
