"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const LOG_DIR = path_1.default.join(__dirname, "..", "logs");
const LOG_FILE = path_1.default.join(LOG_DIR, "email-sim.log");
function ensureLogFile() {
    if (!fs_1.default.existsSync(LOG_DIR)) {
        fs_1.default.mkdirSync(LOG_DIR, { recursive: true });
    }
}
/**
 * Simulated email delivery — appends to a log file (no SMTP).
 */
class EmailService {
    send(to, subject, body) {
        ensureLogFile();
        const line = `[${new Date().toISOString()}] TO: ${to} | ${subject}\n${body}\n---\n`;
        fs_1.default.appendFileSync(LOG_FILE, line, "utf8");
    }
    notifyTransaction(to, kind, amount, accountNumber) {
        this.send(to, `Transaction: ${kind}`, `Your account ${accountNumber} had a ${kind} of ${amount.toFixed(2)}.`);
    }
}
exports.EmailService = EmailService;
