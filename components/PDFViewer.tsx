"use client";
import CloudPdfViewer from "@cloudpdf/viewer";
import { useEffect, useRef } from "react";

export default function PDFViewer() {
  const viewer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (viewer.current) {
      CloudPdfViewer(
        {
          documentId: "6b7aecd2-2c0c-4b9f-b3a7-ae8d127a41dd",
          darkMode: true,
        },
        viewer.current
      )
        .then((instance) => {
          // Additional setup or cleanup can be done here
        })
        .catch((error) => {
          console.error("Failed to initialize CloudPdfViewer:", error);
        });
    }
  }, []);

  return (
    <div className="pdf-viewer">
      <div className="h-screen" ref={viewer}></div>
    </div>
  );
}
