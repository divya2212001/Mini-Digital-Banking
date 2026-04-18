import fs from "fs";
import path from "path";

const LOG_DIR = path.join(__dirname, "..", "logs");
const LOG_FILE = path.join(LOG_DIR, "email-sim.log");

function ensureLogFile(): void {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

/**
 * Simulated email delivery — appends to a log file (no SMTP).
 */
export class EmailService {
  send(to: string, subject: string, body: string): void {
    ensureLogFile();
    const line = `[${new Date().toISOString()}] TO: ${to} | ${subject}\n${body}\n---\n`;
    fs.appendFileSync(LOG_FILE, line, "utf8");
  }

  notifyTransaction(to: string, kind: string, amount: number, accountNumber: string): void {
    this.send(
      to,
      `Transaction: ${kind}`,
      `Your account ${accountNumber} had a ${kind} of ${amount.toFixed(2)}.`
    );
  }
}
