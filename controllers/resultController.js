import Result from "../models/result.js";

// Save result (already have)
export const saveResult = async (req, res) => {
  try {
    const result = new Result(req.body);
    await result.save();
    res.status(201).json({ message: "Result saved successfully!", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Get result by roll number
export const getResultByRoll = async (req, res) => {
  try {
    const { roll } = req.params;
    
    const results = await Result.find({ roll });

    if (!results.length) {
      return res.status(404).json({ message: "No result found for this roll number" });
    }

    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
