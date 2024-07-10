"use client";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/web/pdf_viewer.css";
import { useCallback, useEffect, useRef, useState } from "react";
import Header from "./header/Header";
import SideBar from "./sidebar/SideBar";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

export default function PDFToPNGView() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const renderTaskRef = useRef<pdfjsLib.PDFRenderTask | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  const renderPage = useCallback(
    async (num: number) => {
      if (!pdfDoc) return;

      const page = await pdfDoc.getPage(num);
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Ensure any previous render task is canceled before starting a new one
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      renderTaskRef.current = page.render(renderContext);
      await renderTaskRef.current.promise;
    },
    [pdfDoc, scale]
  );

  const generateThumbnails = useCallback(
    async (pdf: pdfjsLib.PDFDocumentProxy) => {
      const thumbnailPromises = Array.from(
        { length: pdf.numPages },
        (_, index) => generateThumbnail(pdf, index + 1)
      );
      const thumbnailUrls = await Promise.all(thumbnailPromises);
      setThumbnails(thumbnailUrls);
    },
    []
  );

  const generateThumbnail = async (
    pdf: pdfjsLib.PDFDocumentProxy,
    pageNum: number
  ) => {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 0.2 }); // Adjust the scale for thumbnail size

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) return "";

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    return canvas.toDataURL();
  };

  useEffect(() => {
    const fetchPdf = async () => {
      const pdf = await pdfjsLib.getDocument("/01.pdf").promise;
      setPdfDoc(pdf);
      generateThumbnails(pdf);
    };
    fetchPdf();
  }, [generateThumbnails]);

  useEffect(() => {
    if (pdfDoc) {
      renderPage(pageNumber);
    }
  }, [pdfDoc, pageNumber, renderPage]);

  const handlePageChange = (num: number) => {
    setPageNumber(num);
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />
      <div className="w-full flex flex-row">
        <SideBar
          thumbnails={thumbnails}
          handlePageChange={handlePageChange}
          numPages={pdfDoc?.numPages ?? 0}
        />
        <div className="flex-1 p-4 overflow-auto pdfBody">
          <div className="relative w-full">
            <canvas
              ref={canvasRef}
              className="border border-gray-300 mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
