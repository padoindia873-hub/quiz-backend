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


// Get results with ranking (1st, 2nd, 3rd...)
export const getRankings = async (req, res) => {
  try {
    // Sort by highest score → lowest
    const results = await Result.find().sort({ score: -1 });

    if (!results.length) {
      return res.status(404).json({ message: "No results found" });
    }

    // Add rank number
    const rankedResults = results.map((item, index) => ({
      ...item._doc,
      rank: index + 1   // 1st → 2nd → 3rd → ...
    }));

    res.json({ success: true, rankedResults });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

