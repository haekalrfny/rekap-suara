import React from "react";

export default function ChartLoading() {
  return (
    <div className="w-full h-[300px] flex flex-col gap-4">
      <div className="animate-pulse rounded-xl w-52 h-6 bg-gray-200" />
      <div className="animate-pulse rounded-xl w-64 h-4 bg-gray-200" />
      <div className="animate-pulse rounded-xl w-full h-44 bg-gray-200" />
    </div>
  );
}
