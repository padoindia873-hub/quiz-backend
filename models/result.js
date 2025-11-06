import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    name: String,
    roll: { type: String, required: true },
    topic: String,
    score: Number,
    total: Number,
    percentage: Number,
    timeSpent: String,
    answers: [
      {
        question: String,
        selected: String,
        correct: String,
        isCorrect: Boolean,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Result", resultSchema);
