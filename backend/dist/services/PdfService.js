"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
class PdfService {
    buildTransactionStatement(title, accountNumber, rows) {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ margin: 50 });
            const chunks = [];
            doc.on("data", (c) => chunks.push(c));
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);
            doc.fontSize(18).text(title, { align: "center" });
            doc.moveDown();
            doc.fontSize(12).text(`Account: ${accountNumber}`);
            doc.moveDown();
            rows.forEach((r) => {
                const flag = r.suspicious ? " [FLAGGED]" : "";
                doc.text(`${r.date} | ${r.type} | ${r.amount} | ${r.status}${flag}`);
            });
            doc.end();
        });
    }
}
exports.PdfService = PdfService;
