"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const PORT = Number(process.env.PORT) || 5000;
async function bootstrap() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error("MONGO_URI is not set");
        process.exit(1);
    }
    await database_1.DatabaseConnectionManager.getInstance().connect(uri);
    app_1.default.listen(PORT, () => {
        console.log(`API listening on http://localhost:${PORT}`);
    });
}
bootstrap().catch((err) => {
    console.error(err);
    process.exit(1);
});
