// models/question.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    incorrectAnswers: {
      type: [String],
      validate: [
        (arr) => arr.length === 3,
        "Must have exactly 3 incorrect answers",
      ],
      required: true,
    },
    topic: { type: String, required: true },
  },
  { timestamps: true } //  required for sorting
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
