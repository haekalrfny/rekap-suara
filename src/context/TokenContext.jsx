import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import instance from "../api/api";

const Context = createContext();

export const TokenContext = ({ children }) => {
  const [token, setToken] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      let config = {
        method: "get",
        url: `/user/check`,
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      };

      instance(config)
        .then((res) => {
          setToken(res.data);
          setAdmin(res.data.role === "admin" ? true : false);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    checkToken();
  }, [token]);

  return (
    <Context.Provider
      value={{
        token,
        setToken,
        admin,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useTokenContext = () => useContext(Context);
