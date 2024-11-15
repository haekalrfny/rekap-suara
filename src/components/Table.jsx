import React from "react";
import Button from "./Button";
import Loading from "./Loading";
import { useStateContext } from "../context/StateContext";

const getNestedValue = (obj, path) => {
  return path.split(".").reduce((acc, key) => {
    if (acc && typeof acc === "object") {
      const arrayMatch = key.match(/^(\w+)\[(\d+)\]$/);
      if (arrayMatch) {
        const prop = arrayMatch[1];
        const index = parseInt(arrayMatch[2], 10);
        return acc[prop] && Array.isArray(acc[prop])
          ? acc[prop][index]
          : undefined;
      }
      return acc[key];
    }
    return undefined;
  }, obj);
};

const formatNomorTPS = (value) => {
  if (typeof value === "number") {
    return `TPS ${value.toString().padStart(3, "0")}`;
  }
  return value;
};

export default function Table({ data, config }) {
  const { loading } = useStateContext();

  return (
    <>
      {loading ? (
        <div className="w-full h-96">
          <Loading />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-sm border">
          <table className="w-full bg-white border-gray-200">
            <thead>
              <tr>
                {config.columns.map((col, index) => (
                  <th
                    key={index}
                    className="py-2 px-2 border-b border-r text-sm border-gray-200 text-center font-medium" // Menambahkan text-center pada th
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={config.columns.length + 1}
                    className="text-center py-4 text-gray-500 text-sm"
                  >
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {config.columns.map((col, colIndex) => {
                      const cellValue = col.key && getNestedValue(row, col.key);
                      const isBoolean = typeof cellValue === "boolean";
                      const isAdmin = cellValue === "admin";
                      const isUser = cellValue === "user";
                      const isAction = col.type === "action";
                      const baseClasses =
                        "py-2 px-2 border-b border-gray-200 text-sm text-gray-600 border-r text-center"; // Menambahkan text-center pada td
                      const booleanClasses = isBoolean
                        ? cellValue
                          ? "bg-green-100 text-green-600 rounded-md text-xs px-2 py-0.5 font-medium"
                          : "bg-red-100 text-red-600 rounded-md px-2 text-xs py-0.5 font-medium"
                        : "";
                      const adminClasses =
                        isAdmin &&
                        "bg-blue-100 text-blue-600 rounded-md text-xs px-2 py-0.5 font-medium";
                      const userClasses =
                        isUser &&
                        "bg-gray-100 text-gray-600 rounded-md text-xs px-2 py-0.5 font-medium";

                      return (
                        <td key={colIndex} className={baseClasses}>
                          {col.label === "Nomor TPS" ? (
                            formatNomorTPS(cellValue)
                          ) : typeof col.render === "function" ? (
                            col.render(cellValue, row)
                          ) : isBoolean ? (
                            <span className={`${booleanClasses} inline-block`}>
                              {cellValue ? "Ya" : "Tidak"}
                            </span>
                          ) : isAdmin ? (
                            <span className={`${adminClasses} inline-block`}>
                              Admin
                            </span>
                          ) : isUser ? (
                            <span className={`${userClasses} inline-block`}>
                              Saksi
                            </span>
                          ) : isAction ? (
                            <Button
                              text={col.key}
                              size={"xs"}
                              isFull={false}
                              onClick={() => col.actions(row[col.primary])}
                            />
                          ) : (
                            cellValue?.toString()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
