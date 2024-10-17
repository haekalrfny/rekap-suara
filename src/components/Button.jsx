import React from "react";
import { useStateContext } from "../context/StateContext";
import Loading from "./Loading";

export default function Button({
  size,
  text,
  onClick,
  outline,
  isFull = true,
  isCancel = false,
}) {
  const { loadingButton } = useStateContext();
  return (
    <button
      onClick={onClick}
      className={`border font-medium w-${isFull ? "full" : "auto"} ${
        isCancel
          ? "bg-red-500 text-white border-red-500 hover:bg-red-600"
          : outline
          ? "bg-white text-black border hover:bg-gray-100"
          : "bg-black text-white border-black hover:bg-white hover:text-black"
      } rounded-lg py-2 px-3.5 text-${!size ? "base" : size}`}
    >
      {loadingButton ? <Loading /> : text}
    </button>
  );
}
