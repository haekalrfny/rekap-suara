import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import instance from "../api/api";

const Context = createContext();

export const TokenContext = ({ children }) => {
  const [token, setToken] = useState({});

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
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useTokenContext = () => useContext(Context);
