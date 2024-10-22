import React, { useState, useEffect } from "react";
import { calculatePercentage } from "../utils/formatPercent";

const ProgressBar = ({ text, current, total, size }) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const newPercentage = calculatePercentage(current, total);
    const timeout = setTimeout(() => {
      setPercentage(newPercentage);
    }, 100);

    return () => clearTimeout(timeout);
  }, [current, total]);

  const textColor = percentage > 50 ? "text-white" : "text-gray-500";

  return (
    <div className="w-full space-y-1">
      <p className={`${size === "xs" ? "text-xs" : "text-base"} text-gray-600`}>
        {text}
        <span className={`ml-1 ${size === "xs" ? "text-[7px]" : "text-xs"}`}>
          ({current} / {total})
        </span>
      </p>

      <div
        className={`relative w-full bg-gray-300 rounded-full overflow-hidden ${
          size === "xs" ? "h-3" : "h-4"
        }`}
      >
        <div
          className={`bg-black ${
            size === "xs" ? "h-3" : "h-4"
          } rounded-full transition-all duration-1000 flex items-center justify-center`}
          style={{ width: `${percentage}%` }}
        >
          <span
            className={`absolute inset-0 ${
              size === "xs" ? "-top-0.5" : ""
            }  text-center ${textColor} ${
              size === "xs" ? "text-[7px]" : "text-xs"
            }`}
          >
            {percentage.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
