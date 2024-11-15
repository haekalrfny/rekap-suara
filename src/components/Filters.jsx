import React, { useState, useEffect, useRef } from "react";
import Button from "./Button";

export default function Filters({
  filters,
  setFilters,
  filterConfig,
  setShowModal,
  title,
  button,
  simple,
  handleSelect,
}) {
  const [localFilters, setLocalFilters] = useState(filters);
  const firstInputRef = useRef(null);

  const handleFilterChange = (e, key) => {
    const { value } = e.target;
    setLocalFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value || undefined,
    }));
    if (simple) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [key]: value || undefined,
      }));
    }
  };

  const handleReset = () => {
    setLocalFilters({});
    setFilters({});
    setShowModal(false);
  };

  const handleSubmit = () => {
    setFilters(localFilters);
    setShowModal(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
      if (firstInputRef.current.tagName === "INPUT") {
        firstInputRef.current.select();
      }
    }
  }, [setShowModal]);

  return (
    <div className="w-full h-screen flex items-center justify-center fixed z-10 inset-0 bg-black bg-opacity-30">
      <div className="w-[90%] md:w-[50%] lg:w-1/3 bg-white rounded-lg flex flex-col gap-3 p-6">
        <div>
          <h1 className="font-semibold text-xl">{title ? title : "Filters"}</h1>
          <p className="text-sm text-gray-600">Pilih kriteria untuk filter</p>
        </div>

        <form
          onKeyDown={handleKeyDown}
          onSubmit={(e) => e.preventDefault()}
          className="space-y-3"
        >
          {filterConfig.map((filter, index) => {
            const { label, type, key, options, disabled } = filter;

            if (type === "select") {
              return (
                <div key={key} className="text-base md:text-sm">
                  <label htmlFor={key} className="block font-medium mb-1">
                    {label}
                  </label>
                  <select
                    id={key}
                    name={key}
                    value={localFilters[key] || ""}
                    onChange={(e) => handleFilterChange(e, key)}
                    className="p-2 border rounded-md w-full"
                    ref={index === 0 ? firstInputRef : null}
                    disabled={disabled}
                  >
                    <option value="">Semua {label}</option>
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            if (type === "array") {
              return (
                <div key={key} className="text-base md:text-sm">
                  <label htmlFor={key} className="block font-medium mb-1">
                    {label}
                  </label>
                  <select
                    id={key}
                    name={key}
                    value={localFilters[key] || ""}
                    onChange={(e) => handleFilterChange(e, key)}
                    className="p-2 border rounded-md w-full"
                    ref={index === 0 ? firstInputRef : null}
                    disabled={disabled}
                  >
                    <option value="">Semua {label}</option>
                    {options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            if (type === "text") {
              return (
                <div key={key} className="text-base md:text-sm">
                  <label htmlFor={key} className="block font-medium mb-1">
                    {label}
                  </label>
                  <input
                    id={key}
                    type="text"
                    name={key}
                    value={localFilters[key] || ""}
                    onChange={(e) => handleFilterChange(e, key)}
                    className="py-2 px-3 border rounded-md w-full"
                    placeholder="Masukkan kata kunci"
                    ref={index === 0 ? firstInputRef : null}
                    disabled={disabled}
                  />
                </div>
              );
            }

            return null;
          })}

          <div className="flex gap-1.5 mt-4">
            <Button
              text={"Batal"}
              onClick={handleReset}
              size={"sm"}
              outline={true}
            />
            <Button
              text={button ? button : "Filters"}
              onClick={handleSelect ? handleSelect : handleSubmit}
              size={"sm"}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
