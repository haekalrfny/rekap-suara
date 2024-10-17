import React, { useState, useEffect, useRef } from "react";

export default function Dropdown({
  value,
  setValue,
  name,
  label,
  options,
  required,
  isDisabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative mb-4" ref={dropdownRef}>
      <label htmlFor={name} className="text-sm font-medium mb-1 text-black">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div
          onClick={() => !isDisabled && setIsOpen(!isOpen)}
          className={`border-b text-base md:text-sm border-gray-300 w-full py-2 focus:outline-none ${
            value ? "text-black" : "text-gray-600"
          } focus:border-gray-900 cursor-pointer ${
            isDisabled ? " cursor-not-allowed" : ""
          }`}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : `Pilih ${label}`}
        </div>
        {isOpen && !isDisabled && (
          <div className="absolute overflow-y-auto z-10 max-h-56 bg-white border border-gray-300 w-full rounded mt-1 shadow-lg">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Cari ${label}`}
              className="px-4 py-1.5 w-full border-b border-gray-300 text-base md:text-sm focus:outline-none"
            />
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setValue(option.value);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={`px-4 py-1.5 text-base md:text-sm text-black hover:bg-gray-200 cursor-pointer ${
                    value === option.value ? "bg-gray-300" : ""
                  }`}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-1.5 text-gray-500 text-base md:text-sm">
                Tidak ada hasil
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
