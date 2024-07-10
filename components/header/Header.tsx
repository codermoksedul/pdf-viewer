import React, { useState } from "react";
import { BsLayoutSidebarInset } from "react-icons/bs";
import { LuZoomIn, LuZoomOut } from "react-icons/lu";

interface HeaderProps {
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleScaleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  scale: number; // Current scale
  pageNumber: number; // Current page number
  numPages: number; // Total number of pages
  setPageNumber: (page: number) => void; // Function to set page number
  handlePageChange: (num: number) => void; // Function to handle page change
}

const Header: React.FC<HeaderProps> = ({
  handleZoomIn,
  handleZoomOut,
  handleScaleChange,
  scale,
  pageNumber,
  numPages,
  setPageNumber,
  handlePageChange,
}) => {
  const [inputPageNumber, setInputPageNumber] = useState(pageNumber);

  return (
    <div className="border border-b border-slate-200 shadow-sm h-[50px] flex flex-row justify-start p-3 items-center gap-5">
      {/* zoom in and zoom out button */}
      <div className="w-full max-w-[200px]">
        <button className="text-xl">
          <BsLayoutSidebarInset />
        </button>
      </div>
      <div className="flex flex-row justify-center items-center gap-5 w-full">
        {/* go page with click go button */}
        <div className="goPage flex items-center gap-2 border border-slate-200 rounded-md overflow-hidden">
          <input
            type="text"
            inputMode="numeric"
            min="1"
            max={numPages}
            value={inputPageNumber}
            onChange={(e) => setInputPageNumber(parseInt(e.target.value))}
            className="p-1 w-10 text-center outline-none"
          />
          <span className="count pr-2">/ {numPages}</span>
          <button
            onClick={() => handlePageChange(inputPageNumber)}
            className="px-3 border-l bg-slate-200 py-1"
          >
            Go
          </button>
        </div>
        <div className="flex flex-row justify-center w-fit items-center gap-3">
          <button onClick={handleZoomOut}>
            <LuZoomOut className="text-xl" />
          </button>
          <button onClick={handleZoomIn}>
            <LuZoomIn className="text-xl" />
          </button>
        </div>
        <div>
          <select
            name="scale"
            id="scale"
            onChange={handleScaleChange}
            value={(scale * 100).toString()}
            className="border border-slate-200 outline-none cursor-pointer rounded-md p-2 px-5 text-sm"
          >
            <option value="25">25%</option>
            <option value="50">50%</option>
            <option value="75">75%</option>
            <option value="100">100%</option>
            <option value="150">150%</option>
            <option value="200">200%</option>
            <option value="300">300%</option>
            <option value="400">400%</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Header;
