import React, { createContext, useContext, useEffect, useState } from "react";
import instance from "../api/api";
import Cookies from "js-cookie";
import { useStateContext } from "./StateContext";

const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => {
  const { setLoading } = useStateContext();
  const [tpsData, setTpsData] = useState([]);
  const [suaraByPaslon, setSuaraByPaslon] = useState([]);
  const [paslonData, setPaslonData] = useState([]);

  useEffect(() => {
    setLoading(true);
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
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
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
