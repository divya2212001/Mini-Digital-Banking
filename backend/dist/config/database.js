"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnectionManager = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Singleton database connection manager — ensures a single Mongoose connection lifecycle.
 */
class DatabaseConnectionManager {
    constructor() { }
    static getInstance() {
        if (!DatabaseConnectionManager.instance) {
            DatabaseConnectionManager.instance = new DatabaseConnectionManager();
        }
        return DatabaseConnectionManager.instance;
    }
    async connect(uri) {
        await mongoose_1.default.connect(uri);
    }
    getConnection() {
        return mongoose_1.default;
    }
}
exports.DatabaseConnectionManager = DatabaseConnectionManager;
