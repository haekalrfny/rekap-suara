import React, { useRef, useState } from "react";
import Button from "./Button";

export default function InputImage({ value, setValue, required }) {
  const fileInputRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setValue(file);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setValue(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      onClick={value ? null : handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer overflow-hidden"
    >
      {value ? (
        <>
          {/* Tampilkan gambar preview menggunakan URL dari file */}
          <img
            src={URL.createObjectURL(value)}
            alt="Selected"
            className="object-cover w-full h-full"
          />
          {isHovered && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 ">
              <div className="space-y-2">
                <Button text={"Ganti Foto"} onClick={handleClick} outline />
                <Button
                  text={"Lihat Foto"}
                  onClick={() => alert("Check Image clicked")}
                  outline={true}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-500 text-sm text-center">
          {required && <span className="text-red-500">*</span>} Klik atau seret
          gambar ke sini untuk mengunggah
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
  );
}