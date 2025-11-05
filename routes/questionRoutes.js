import express from "express";
import {
  getAllQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";

const router = express.Router();

router.get("/", getAllQuestions);       // GET /api/questions?topic=GK
router.post("/", addQuestion);          // POST /api/questions
router.put("/:id", updateQuestion);     // PUT /api/questions/:id
router.delete("/:id", deleteQuestion);  // DELETE /api/questions/:id

export default router;
