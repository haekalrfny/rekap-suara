import React, { useEffect, useState } from "react";

export default function Image({ url, onCancel }) {
  const [displayUrl, setDisplayUrl] = useState(null);

  useEffect(() => {
    let objectUrl = null;

    if (url instanceof File || url instanceof Blob) {
      objectUrl = URL.createObjectURL(url);
      setDisplayUrl(objectUrl);
    } else {
      setDisplayUrl(url);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [url]);

  return (
    <div
      className="w-full h-screen flex items-center justify-center fixed z-10 inset-0 bg-black bg-opacity-50"
      onClick={onCancel}
    >
      {displayUrl && (
        <img
          src={displayUrl}
          alt="Preview"
          className="max-w-[90%] max-h-[90%] object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </div>
  );
}
