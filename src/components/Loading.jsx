import React from "react";
import { AiOutlineLoading } from "react-icons/ai";

export default function Loading() {
  return (
    <div className=" flex items-center justify-center animate-spin w-full h-full">
      <AiOutlineLoading  className="text-xl"/>
    </div>
  );
}
