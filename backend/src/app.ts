import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middleware/error.middleware";
import { globalLimiter } from "./middleware/rateLimiter.middleware";

const app = express();

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
  "https://mini-digital-banking.vercel.app"
]);
if (process.env.CLIENT_ORIGIN) {
  allowedOrigins.add(process.env.CLIENT_ORIGIN);
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const isLocal = allowedOrigins.has(origin);
      const isVercelPreview = origin.includes(".vercel.app");

      if (isLocal || isVercelPreview) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.options("*", cors());
app.use(globalLimiter);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "mini-digital-banking-api" });
});

app.use("/api", routes);

app.use(errorHandler);

export default app;
