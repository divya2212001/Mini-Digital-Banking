import PDFDocument from "pdfkit";

export interface TransactionRow {
  date: string;
  type: string;
  amount: string;
  status: string;
  suspicious?: boolean;
}

export class PdfService {
  buildTransactionStatement(
    title: string,
    accountNumber: string,
    rows: TransactionRow[]
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];
      doc.on("data", (c) => chunks.push(c as Buffer));
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
