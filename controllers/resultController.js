import Result from "../models/result.js";

export const saveResult = async (req, res) => {
  try {
    const result = new Result(req.body);
    await result.save();
    res.status(201).json({ message: "Result saved successfully!", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
