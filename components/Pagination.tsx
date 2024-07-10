import React from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface PaginationProps {
  pageNumber: number;
  numPages: number;
  onPageChange: (num: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  pageNumber,
  numPages,
  onPageChange,
}) => {
  return (
    <div className="pagination bottom-5 flex flex-col justify-center items-center left-0 fixed w-full">
      <div className="bg-white/80 backdrop-blur-sm rounded-md overflow-hidden border border-slate-200 flex flex-row justify-center items-center gap-2">
        {/* prev button */}
        <button
          onClick={() => onPageChange(pageNumber - 1)}
          disabled={pageNumber <= 1}
          className="p-2"
        >
          <LuChevronLeft className="text-xl" />
        </button>
        <span>
          {pageNumber} / {numPages || 0}
        </span>
        {/* next button */}
        <button
          onClick={() => onPageChange(pageNumber + 1)}
          disabled={pageNumber >= numPages}
          className="p-2"
        >
          <LuChevronRight className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
