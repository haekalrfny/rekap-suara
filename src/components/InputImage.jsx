import React, { useRef, useState } from "react";
import Button from "./Button";
import Image from "./Image";
import imageCompression from "browser-image-compression";

export default function InputImage({
  value,
  setValue,
  isMobile,
  label,
  required,
  isDisabled = false,
}) {
  const fileInputRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(file, options);
      setValue(compressedFile);
    } catch (error) {
      console.error("Error compressing image", error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (isDisabled) return;
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      compressImage(file);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      compressImage(file);
    }
  };

  const handleClick = () => {
    if (isDisabled) return;
    fileInputRef.current.click();
  };

  return (
    <div>
      <label
        className={`${
          isMobile ? "text-xl md:text-sm uppercase" : "text-sm"
        } font-medium text-black`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        onClick={value || isDisabled ? null : handleClick}
        onDragOver={isDisabled ? null : handleDragOver}
        onDrop={isDisabled ? null : handleDrop}
        onMouseEnter={() => setIsHovered(!isDisabled && true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative flex items-center justify-center w-full h-64 border-2 mt-3 border-dashed rounded-lg overflow-hidden ${
          isDisabled
            ? "border-gray-200 bg-gray-100 cursor-not-allowed"
            : "border-gray-300 cursor-pointer"
        }`}
      >
        {value ? (
          <>
            <img
              src={URL.createObjectURL(value)}
              alt="Selected"
              className="object-cover w-full h-full"
            />
            {isHovered && !isDisabled && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
                <div className="space-y-2">
                  <Button
                    text={"Ganti Foto"}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleClick();
                    }}
                    outline
                    disabled={isDisabled}
                  />
                  <Button
                    text={"Lihat Foto"}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowImage(true);
                    }}
                    outline
                    disabled={isDisabled}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <p
            className={`text-gray-500 text-sm text-center ${
              isDisabled ? "text-gray-400" : ""
            }`}
          >
            {required && <span className="text-red-500">*</span>} Klik atau
            seret gambar ke sini untuk mengunggah
          </p>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleChange}
          className="hidden"
          accept="image/*"
          required={required}
          disabled={isDisabled}
        />
      </div>
      {showImage && <Image url={value} onCancel={() => setShowImage(false)} />}
    </div>
  );
}
