import express from "express";
import cors from "cors";

const app = express();

// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Mini Digital Banking API Running"
  });
});

export default app;
