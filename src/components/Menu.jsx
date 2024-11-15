import React from "react";
import { NavLink } from "react-router-dom";
import { useStateContext } from "../context/StateContext";
import MenuLoading from "./Load/MenuLoading";

export default function Menu({ data, isFull = false, type = "link" }) {
  return (
    <div className="flex flex-col  items-center gap-4 w-full">
      <div
        className={`flex flex-col gap-1 w-full ${
          isFull ? "md:w-full" : "md:w-2/3"
        }`}
      >
        {data.map((button, index) => (
          <React.Fragment key={index}>
            {type === "link" ? (
              <NavLink
                to={button.link}
                className="hover:bg-gray-100 py-2 px-3 rounded-md flex items-center justify-between"
              >
                <p>{button.label}</p>
                {button.icon}
              </NavLink>
            ) : (
              <button
                onClick={button.link}
                className="hover:bg-gray-100 py-2 px-3 rounded-md flex items-center justify-between"
              >
                <p>{button.label}</p>
                {button.icon && button.icon}
              </button>
            )}
            {index < 3 && <hr />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
