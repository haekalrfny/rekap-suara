import React from "react";

export default function Switch({ value, setValue, menu }) {
  return (
    <div className="flex">
      {menu.map((item) => (
        <button
          key={item.value}
          onClick={() => setValue(item.value)}
          className={`pr-4 pl-4 py-2 font-medium transition-colors duration-200 ${
            value === item.value
              ? "border-b-2 border-black text-black"
              : "border-b text-gray-500 hover:text-black"
          }`}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}
