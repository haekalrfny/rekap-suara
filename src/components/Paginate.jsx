import React from "react";
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";
import ReactPaginate from "react-paginate";

export default function Paginate({ handlePageClick, data, page, pages, rows }) {
  return (
    <div
      className={` flex-col-reverse md:flex-row items-center gap-3 md:justify-between ${
        !data ? "hidden" : "flex"
      }`}
    >
      <div className="flex gap-2 text-base md:text-sm">
        <p>
          Page :{" "}
          <span className="font-medium">
            {rows ? page + 1 : 0} of {pages}
          </span>
        </p>
        <p>|</p>
        <p>
          Total Rows : <span className="font-medium">{rows}</span>
        </p>
      </div>
      <ReactPaginate
        previousLabel={<PiCaretLeftBold />}
        nextLabel={<PiCaretRightBold />}
        pageCount={pages}
        marginPagesDisplayed={1}
        pageRangeDisplayed={2}
        onPageChange={handlePageClick}
        containerClassName="flex space-x-3 justify-center md:justify-start items-center text-base md:text-sm"
        pageLinkClassName="px-2 py-1 hover:bg-gray-200 hover:text-black rounded-md duration-150"
        previousLinkClassName="px-2 py-1 text-black duration-150"
        nextLinkClassName="px-2 md:px-3 py-1 text-black duration-150"
        activeLinkClassName="px-2 py-1 bg-black text-gray-200 rounded-md hover:bg-black"
      />
    </div>
  );
}
