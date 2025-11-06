import express from "express";
import { saveResult } from "../controllers/resultController.js";

const router = express.Router();

router.post("/save-result", saveResult);

export default router;
