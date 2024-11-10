import React from "react";
import Button from "./Button";

const getNestedValue = (obj, path) => {
  return path.split(".").reduce((acc, key) => acc && acc[key], obj);
};

export default function Table({ data, config }) {
  return (
    <div className="overflow-x-auto rounded-sm border">
      <table className="w-full bg-white border-gray-200">
        <thead>
          <tr>
            {config.columns.map((col, index) => (
              <th
                key={index}
                className="py-2 px-4 border-b border-r text-sm border-gray-200 text-left font-medium"
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
                    "py-2 px-4 border-b border-gray-200 text-sm text-gray-600 border-r";
                  const booleanClasses = isBoolean
                    ? cellValue
                      ? "bg-green-100 text-green-600 rounded-md text-xs px-3 py-0.5 font-medium"
                      : "bg-red-100 text-red-600 rounded-md px-3 text-xs py-0.5 font-medium"
                    : "";
                  const adminClasses =
                    isAdmin &&
                    "bg-blue-100 text-blue-600 rounded-md text-xs px-3 py-0.5 font-medium";
                  const userClasses =
                    isUser &&
                    "bg-gray-100 text-gray-600 rounded-md text-xs px-3 py-0.5 font-medium";

                  return (
                    <td key={colIndex} className={baseClasses}>
                      {typeof col.render === "function" ? (
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
  );
}
