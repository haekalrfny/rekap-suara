import React from "react";

export default function Image({ url, onCancel }) {
  return (
    <div
      className="w-full h-screen flex items-center justify-center fixed z-10 inset-0 bg-black bg-opacity-50"
      onClick={onCancel}
    >
      <img
        src={url}
        alt={url}
        className="max-w-[90%]"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
