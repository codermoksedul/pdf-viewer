import { PDFDocument, rgb } from "pdf-lib";

export const createEncryptedPdf = async (password: string) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);

  page.drawText("Confidential Document", {
    x: 50,
    y: 350,
    size: 30,
    color: rgb(0.95, 0.1, 0.1),
  });

  pdfDoc.encrypt({
    userPassword: password,
    ownerPassword: password,
    permissions: {
      printing: "none",
      modifying: false,
      copying: false,
      annotating: false,
      fillingForms: false,
      contentAccessibility: false,
      documentAssembly: false,
    },
  });

  const pdfBytes = await pdfDoc.save();
  return new Uint8Array(pdfBytes);
};
