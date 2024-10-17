import React from "react";

export default function SaksiTextLoading() {
  return (
    <div className="w-full flex items-center justify-center gap-1.5">
      <div className="bg-gray-200 animate-pulse rounded -xl w-4 h-4" />
      <div className="bg-gray-200 animate-pulse rounded-xl w-52 md:w-60 h-4" />
      <div className="bg-gray-200 animate-pulse rounded-xl w-32 h-4" />
    </div>
  );
}
