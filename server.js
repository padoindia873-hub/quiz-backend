import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./dbs/dbconnect.js";
import questionRoutes from "./routes/questionRoutes.js";

// Load environment variables
dotenv.config();

// Express app
const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connect
connectDB();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// API Routes
app.use("/api/questions", questionRoutes);

// Root
app.get("/", (req, res) => {
  res.send(" Quiz API Running Successfully");
});

app.listen(PORT, () =>
  console.log(`🚀 Server Running on http://localhost:${PORT}`)
);

//http://localhost:5000/api/questions?page=1&limit=10
//http://localhost:5000/api/questions?page=1&limit=10&topic=Science
// {
//   "total": 25,
//   "page": 1,
//   "limit": 10,
//   "pages": 3,
//   "questions": [
//     {
//       "_id": "671b4acb1a4f5e13a8c12345",
//       "questionText": "What is the capital of France?",
//       "correctAnswer": "Paris",
//       "incorrectAnswers": ["Berlin", "Madrid", "Rome"],
//       "topic": "Geography",
//       "createdAt": "2025-10-25T10:00:00.000Z"
//     }
//   ]
// }

//http://localhost:5000/api/questions/random?count=5
// [
//   {
//     "_id": "671b4acb1a4f5e13a8c12345",
//     "questionText": "What is 2 + 2?",
//     "correctAnswer": "4",
//     "incorrectAnswers": ["3", "5", "6"],
//     "topic": "Math"
//   }
// ]

//http://localhost:5000/api/questions
// {
//   "questionText": "What is the largest planet in our solar system?",
//   "correctAnswer": "Jupiter",
//   "incorrectAnswers": ["Earth", "Mars", "Saturn"],
//   "topic": "Science"
// }

//http://localhost:5000/api/questions/671b4d591a4f5e13a8c12367
// {
//   "topic": "Astronomy"
// }
// http://localhost:5000/api/questions/671b4d591a4f5e13a8c12367
// {
//   "message": "Deleted"
// }