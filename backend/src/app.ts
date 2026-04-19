import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middleware/error.middleware";
import { globalLimiter } from "./middleware/rateLimiter.middleware";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options(/.*/, cors());
app.use(express.json({ limit: "1mb" }));
app.use(globalLimiter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "mini-digital-banking-api" });
});

app.use("/api", routes);

app.use(errorHandler);

export default app;
