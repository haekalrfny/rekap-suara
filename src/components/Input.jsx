import React, { useState } from "react";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { BsUpload } from "react-icons/bs";

export default function Input({
  value,
  setValue,
  name,
  label,
  type,
  placeholder,
  required,
  isMobile,
}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [fileName, setFileName] = useState("");

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setValue && setValue(file);
    setFileName(file ? file.name : "Tidak ada file yang dipilih");
  };

  return (
    <div>
      <label
        htmlFor={name}
        className={`${
          isMobile ? "text-xl md:text-sm uppercase" : "text-sm"
        } font-medium mb-1 text-black`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative mb-4">
        {type === "file" ? (
          <>
            <input
              id={name}
              type="file"
              onChange={handleFileChange}
              required={required}
              className="hidden"
            />
            <label
              htmlFor={name}
              className="border-b text-base md:text-sm border-gray-300 w-full py-2 flex justify-between items-center cursor-pointer focus:outline-none focus:border-gray-900"
            >
              <span className={`${fileName ? "text-black" : "text-gray-600"}`}>
                {fileName || "Pilih file"}
              </span>
              <span className="text-black">
                <BsUpload className="" />
              </span>
            </label>
          </>
        ) : (
          <input
            value={value}
            onChange={(e) => setValue && setValue(e.target.value)}
            id={name}
            type={
              type === "password"
                ? passwordVisible
                  ? "text"
                  : "password"
                : type
            }
            placeholder={placeholder}
            required={required}
            className="border-b text-base md:text-sm border-gray-300 w-full py-2 focus:outline-none focus:border-gray-900"
          />
        )}
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-3.5 text-lg"
          >
            {passwordVisible ? <GoEyeClosed /> : <GoEye />}
          </button>
        )}
      </div>
    </div>
  );
}
