import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import instance from "../api/api";

const Context = createContext();

export const TokenContext = ({ children }) => {
  const [token, setToken] = useState({});
  const id = Cookies.get("_id");
  const [admin, setAdmin] = useState(false);
  const [attending, setAttending] = useState(false);
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    const getDataById = () => {
      let config = {
        method: "get",
        url: `/user/${id}`,
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      };

      instance(config)
        .then((res) => {
          setAttending(res.data.isAttending);
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getDataById();
  }, [id]);

  return (
    <Context.Provider
      value={{
        token,
        setToken,
        admin,
        user,
        attending,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useTokenContext = () => useContext(Context);
