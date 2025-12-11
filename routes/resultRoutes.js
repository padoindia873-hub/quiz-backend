import express from "express";
import { saveResult, getResultByRoll ,getRankings} from "../controllers/resultController.js";

const router = express.Router();

router.post("/save-result", saveResult);

//  New API to fetch result by roll number https://quiz-backend-aixd.onrender.com/api/result
router.get("/result/:roll", getResultByRoll);

router.get("/rankings", getRankings);

export default router;
