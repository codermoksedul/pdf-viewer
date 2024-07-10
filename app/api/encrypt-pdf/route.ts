import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

export const GET = async () => {
  try {
    const pdfPath = path.join(process.cwd(), "public", "01.pdf"); // Path to your existing PDF file
    const pdfBytes = fs.readFileSync(pdfPath);
    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
      },
    });
  } catch (error) {
    console.error("Error loading PDF:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
