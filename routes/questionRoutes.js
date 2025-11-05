import express from "express";
import {
  getAllQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  addMultipleQuestions
} from "../controllers/questionController.js";

const router = express.Router();

router.get("/", getAllQuestions);       // GET /api/questions?topic=GK
router.post("/", addQuestion);          // POST /api/questions
router.post("/bulk", addMultipleQuestions); //  new route for multi-add
router.put("/:id", updateQuestion);     // PUT /api/questions/:id
router.delete("/:id", deleteQuestion);  // DELETE /api/questions/:id

export default router;
