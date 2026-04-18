"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const rateLimiter_middleware_1 = require("./middleware/rateLimiter.middleware");
const app = (0, express_1.default)();
const allowedOrigins = new Set([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]);
if (process.env.CLIENT_ORIGIN) {
    allowedOrigins.add(process.env.CLIENT_ORIGIN);
}
app.use((0, cors_1.default)({
    origin(origin, callback) {
        if (!origin) {
            callback(null, true);
            return;
        }
        callback(null, allowedOrigins.has(origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(rateLimiter_middleware_1.globalLimiter);
app.use(express_1.default.json({ limit: "1mb" }));
app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "mini-digital-banking-api" });
});
app.use("/api", routes_1.default);
app.use(error_middleware_1.errorHandler);
exports.default = app;
