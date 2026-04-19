import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middleware/error.middleware";
import { globalLimiter } from "./middleware/rateLimiter.middleware";

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (
      origin.startsWith("http://localhost") ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }

    callback(null, false);
  },
  credentials: true
}));

app.options(/.*/, cors());
app.use(express.json({ limit: "1mb" }));
app.use(globalLimiter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "mini-digital-banking-api" });
});

app.use("/api", routes);

app.use(errorHandler);

export default app;
