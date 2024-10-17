import React, { createContext, useContext, useEffect, useState } from "react";
import instance from "../api/api";
import Cookies from "js-cookie";

const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => {
  const [tpsData, setTpsData] = useState([]);
  const [suaraByPaslon, setSuaraByPaslon] = useState([]);
  const [paslonData, setPaslonData] = useState([]);

  useEffect(() => {
    fetchData("/tps", setTpsData);
    fetchData("/paslon", setPaslonData);
    fetchData("/suara/byPaslon", setSuaraByPaslon);
  }, []);

  const fetchData = (endpoint, setter) => {
    instance
      .get(endpoint, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      })
      .then((res) => setter(res.data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  return (
    <DatabaseContext.Provider
      value={{
        tpsData,
        paslonData,
        suaraByPaslon,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabaseContext = () => useContext(DatabaseContext);
