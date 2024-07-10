import Image from "next/image";
import { useEffect, useRef } from "react";

interface SideBarProps {
  thumbnails: string[];
  handlePageChange: (num: number) => void;
  numPages: number | null;
  loadingThumbnails: boolean;
  activePage: number;
}

const SideBar: React.FC<SideBarProps> = ({
  thumbnails,
  handlePageChange,
  numPages,
  loadingThumbnails,
  activePage,
}) => {
  const activePageRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (activePageRef.current) {
      activePageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activePage]);

  return (
    <div
      className="w-full max-w-[200px] border-r p-3 border-slate-200 overflow-y-auto"
      style={{ height: "calc(100vh - 70px)" }}
    >
      <h3 className="font-semibold mb-4 text-slate-700">
        Total Pages ({numPages ?? 0})
      </h3>
      {loadingThumbnails ? (
        <div className="flex items-center justify-center h-full">
          <span className="text-lg font-semibold text-gray-700">
            Loading...
          </span>
        </div>
      ) : (
        thumbnails.map((thumbnail, index) => (
          <button
            key={index}
            ref={index + 1 === activePage ? activePageRef : null}
            className={`mb-2 w-full relative border p-2 border-slate-100 rounded-md ${
              index + 1 === activePage ? "bg-blue-100 border-red-500" : ""
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            <Image
              width={128}
              height={128}
              src={thumbnail}
              alt={`Page ${index + 1}`}
              className="w-full h-auto"
            />
            <span className="pageCount">Page {index + 1}</span>
          </button>
        ))
      )}
    </div>
  );
};

export default SideBar;
