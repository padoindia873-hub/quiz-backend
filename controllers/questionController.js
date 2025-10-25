// controllers/questionController.js
import Question from "../models/question.js";

// Get paginated questions
export const getAllQuestions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.topic) filter.topic = req.query.topic;

    const total = await Question.countDocuments(filter);

    const questions = await Question.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      questions,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get random questions
export const getRandomQuestions = async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 10;
    const questions = await Question.aggregate([{ $sample: { size: count } }]);
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Add new question
export const addQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json({ message: "Question added", question });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update question
export const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!question) return res.status(404).json({ message: "Not found" });

    res.status(200).json({ message: "Updated", question });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete question
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);

    if (!question) return res.status(404).json({ message: "Not found" });

    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
