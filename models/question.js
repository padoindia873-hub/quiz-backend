import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    enum: ["GK", "Academic"], // topic type
  },
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const Question = mongoose.model("question", questionSchema);
export default Question;
