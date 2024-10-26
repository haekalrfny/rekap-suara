import React from "react";
import { PiCaretLeftBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

export default function BackButton({ url }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(url)}
      className="text-base font-medium text-gray-500 hover:text-gray-700 flex items-center gap-2"
    >
      <PiCaretLeftBold className="text-lg" />
      Kembali
    </button>
  );
}
