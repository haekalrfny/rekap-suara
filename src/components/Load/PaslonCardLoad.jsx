import React from "react";

export default function PaslonCardLoad() {
  return (
    <div className="w-full p-6 flex flex-col justify-between gap-3 h-60 bg-gray-200 animate-pulse rounded-xl">
      <div className="flex flex-col gap-3">
        <div className=" rounded-xl w-20 h-5 bg-gray-300 animate-pulse" />
        <div className=" rounded-xl w-full h-12 bg-gray-300 animate-pulse" />
        <div className=" rounded-xl w-36 h-6 bg-gray-300 animate-pulse" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gray-300 animate-pulse" />
          <div className="w-9 h-9 rounded-full bg-gray-300 animate-pulse" />
        </div>
        <div className="w-20 h-10 rounded-xl bg-gray-300 animate-pulse" />
      </div>
    </div>
  );
}
