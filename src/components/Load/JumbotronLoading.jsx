import React from "react";

export default function JumbotronLoading() {
  return (
    <div className="flex flex-col  justify-center items-center gap-6 md:gap-10">
      <div className="flex gap-4">
        <div className="w-48 md:w-56 h-11 md:h-16 animate-pulse rounded-xl bg-gray-200" />
      </div>
      <div className="flex flex-col gap-3 items-center">
        <div className="w-80 md:w-[650px] h-24 md:h-4 animate-pulse rounded-xl bg-gray-200" />
        <div className="hidden md:block w-[150px] h-4 animate-pulse rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}
