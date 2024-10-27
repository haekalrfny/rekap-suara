import React from "react";
import { PiCaretLeftBold, PiCaretRightBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

export default function BackButton({ url, anotherUrl, textAnother }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={() => navigate(url)}
        className="text-base font-medium text-gray-500 hover:text-gray-700 flex items-center gap-2"
      >
        <PiCaretLeftBold className="text-lg" />
        Kembali
      </button>
      {textAnother && (
        <button
          onClick={() => navigate(anotherUrl)}
          className="text-base font-medium text-gray-500 hover:text-gray-700 flex items-center gap-2"
        >
          {textAnother}
          <PiCaretRightBold className="text-lg" />
        </button>
      )}
    </div>
  );
}
