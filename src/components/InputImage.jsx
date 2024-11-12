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
        onClick={value ? null : handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex items-center justify-center w-full h-64 border-2 mt-3 border-dashed border-gray-300 rounded-lg cursor-pointer overflow-hidden"
      >
        {value ? (
          <>
            <img
              src={URL.createObjectURL(value)}
              alt="Selected"
              className="object-cover w-full h-full"
            />
            {isHovered && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 ">
                <div className="space-y-2">
                  <Button
                    text={"Ganti Foto"}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleClick();
                    }}
                    outline
                  />
                  <Button
                    text={"Lihat Foto"}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowImage(true);
                    }}
                    outline={true}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-sm text-center">
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
        />
      </div>
      {showImage && <Image url={value} onCancel={() => setShowImage(false)} />}
    </div>
  );
}
