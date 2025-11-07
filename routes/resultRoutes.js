import express from "express";
import { saveResult, getResultByRoll } from "../controllers/resultController.js";

const router = express.Router();

router.post("/save-result", saveResult);

//  New API to fetch result by roll number
router.get("/result/:roll", getResultByRoll);

export default router;
