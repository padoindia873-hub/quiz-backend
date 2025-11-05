import Question from "../models/question.js";

//  GET: All Questions (optionally filter by topic)
export const getAllQuestions = async (req, res) => {
  try {
    const filter = {};
    if (req.query.topic) filter.topic = req.query.topic;
    const questions = await Question.find(filter);
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST: Add New Question
export const addQuestion = async (req, res) => {
  try {
    const { topic, question, options, answer } = req.body;
    const newQuestion = new Question({ topic, question, options, answer });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT: Update Question
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Question.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//  DELETE: Remove Question
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await Question.findByIdAndDelete(id);
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//  New: Add Multiple Questions

export const addMultipleQuestions = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Questions array is required" });
    }

    // Insert all at once
    const inserted = await Question.insertMany(questions);
    res.status(201).json({
      message: `${inserted.length} questions added successfully`,
      data: inserted,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
