"use client";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/web/pdf_viewer.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "./header/Header";
import Pagination from "./Pagination";
import ProtectionOptions from "./ProtectionOptions";
import SideBar from "./sidebar/SideBar";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

const PDFView: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [loadingThumbnails, setLoadingThumbnails] = useState(true); // Thumbnail loading state

  const renderPage = useCallback(
    async (num: number) => {
      if (!pdfDoc) return;

      setLoading(true); // Set loading state to true when rendering starts

      const page = await pdfDoc.getPage(num);
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      setLoading(false); // Set loading state to false when rendering finishes
    },
    [pdfDoc, scale]
  );

  const generateThumbnails = useCallback(
    async (pdf: pdfjsLib.PDFDocumentProxy) => {
      setLoadingThumbnails(true); // Set thumbnail loading state to true
      const thumbnailPromises = Array.from(
        { length: pdf.numPages },
        (_, index) => generateThumbnail(pdf, index + 1)
      );
      const thumbnailUrls = await Promise.all(thumbnailPromises);
      setThumbnails(thumbnailUrls);
      setLoadingThumbnails(false); // Set thumbnail loading state to false
    },
    []
  );

  const generateThumbnail = async (
    pdf: pdfjsLib.PDFDocumentProxy,
    pageNum: number
  ): Promise<string> => {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 0.2 });

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
      try {
        const loadingTask = pdfjsLib.getDocument({
          url: "/01.pdf",
          password: "123456",
        } as any); // Use 'any' type assertion here
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        generateThumbnails(pdf);
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
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

  const handleZoomIn = () => {
    setScale((prevScale) => {
      const newScale = Math.min(prevScale + 0.25, 4.0);
      return newScale;
    });
  };

  const handleZoomOut = () => {
    setScale((prevScale) => {
      const newScale = Math.max(prevScale - 0.25, 0.25);
      return newScale;
    });
  };

  const handleScaleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setScale(parseFloat(event.target.value) / 100);
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleScaleChange={handleScaleChange}
        scale={scale} // Pass current scale to Header
      />
      <div className="w-full flex flex-row">
        <SideBar
          thumbnails={thumbnails}
          handlePageChange={handlePageChange}
          numPages={pdfDoc?.numPages ?? 0}
          loadingThumbnails={loadingThumbnails} // Pass the loading state to SideBar
          activePage={pageNumber} // Pass active page number
        />
        <div
          className="flex-1 p-4 overflow-auto pdfBody relative"
          style={{
            height: "calc(100vh - 50px)",
            width: "calc(100vw - 200px)",
          }}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
              <span className="text-lg font-semibold text-gray-700">
                Loading...
              </span>
            </div>
          )}
          <div className="relative w-full">
            <canvas
              ref={canvasRef}
              className="border border-gray-300 mx-auto"
            />
          </div>
          <Pagination
            pageNumber={pageNumber}
            numPages={pdfDoc?.numPages || 0}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <ProtectionOptions />
    </div>
  );
};

export default PDFView;
