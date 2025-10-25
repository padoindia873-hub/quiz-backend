// routes/questionRoutes.js
import express from "express";
import {
  getAllQuestions,
  getRandomQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";

const router = express.Router();

router.get("/", getAllQuestions);
router.get("/random", getRandomQuestions);
router.post("/", addQuestion);
router.put("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);

export default router;
