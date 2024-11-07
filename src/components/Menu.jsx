import React from "react";
import { NavLink } from "react-router-dom";

export default function Menu({ data }) {
  return (
    <div className="flex flex-col  items-center gap-4 w-full">
      <div className="flex flex-col gap-1 w-full md:w-2/3">
        {data.map((button, index) => (
          <React.Fragment key={index}>
            <NavLink
              to={button.link}
              className="hover:bg-gray-100 py-2 px-3 rounded-md flex items-center justify-between"
            >
              <p>{button.label}</p>
              {button.icon}
            </NavLink>
            {index < 3 && <hr />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
