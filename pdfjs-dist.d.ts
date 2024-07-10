declare module "pdfjs-dist/build/pdf" {
  export interface PDFDocumentProxy {
    numPages: number;
    getPage: (pageNumber: number) => Promise<PDFPageProxy>;
  }

  export interface PDFPageProxy {
    getViewport: (params: { scale: number }) => PDFPageViewport;
    render: (params: PDFRenderParams) => PDFRenderTask;
  }

  export interface PDFPageViewport {
    width: number;
    height: number;
  }

  export interface PDFRenderParams {
    canvasContext: CanvasRenderingContext2D;
    viewport: PDFPageViewport;
  }

  export interface PDFRenderTask {
    promise: Promise<void>;
    cancel: () => void;
  }

  const pdfjsLib: {
    version: string;
    GlobalWorkerOptions: {
      workerSrc: string;
    };
    getDocument: (src: string | Uint8Array) => {
      promise: Promise<PDFDocumentProxy>;
    };
  };

  export = pdfjsLib;
}
