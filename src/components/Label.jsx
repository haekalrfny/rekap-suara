import React from "react";

export default function Label({ title, value, isAuto, isMobile }) {
  return (
    <div>
      <label
        htmlFor={title}
        className={` font-medium uppercase mb-1 text-black ${
          isMobile ? "text-xl md:text-sm " : "text-sm"
        }`}
      >
        {title}{" "}
        {isAuto && (
          <span className=" ml-2 px-2 bg-gray-100 text-gray-500 rounded-xl text-xs ">
            otomatis
          </span>
        )}
      </label>
      <p className="border-b text-base md:text-sm border-gray-300 w-full py-2 focus:outline-none focus:border-gray-900">
        {value}
      </p>
    </div>
  );
}
