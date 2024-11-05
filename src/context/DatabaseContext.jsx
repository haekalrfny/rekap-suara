import React, { createContext, useContext, useEffect, useState } from "react";
import instance from "../api/api";
import Cookies from "js-cookie";

const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => {
  const [tpsData, setTpsData] = useState([]);
  const [suaraByPaslon, setSuaraByPaslon] = useState([]);
  const [paslonData, setPaslonData] = useState([]);
  const [suaraByDapil, setSuaraByDapil] = useState([]);

  const fetchData = async (endpoint, setter) => {
    try {
      const res = await instance.get(endpoint, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      setter(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      if (tpsData.length === 0) await fetchData("/tps", setTpsData);
      if (paslonData.length === 0) await fetchData("/paslon", setPaslonData);
      if (suaraByPaslon.length === 0)
        await fetchData("/suara/byPaslon", setSuaraByPaslon);
      if (suaraByDapil.length === 0)
        await fetchData("/tps/dapil", setSuaraByDapil);
    };

    fetchAllData();
  }, []);

  return (
    <DatabaseContext.Provider
      value={{
        tpsData,
        paslonData,
        suaraByPaslon,
        suaraByDapil,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabaseContext = () => useContext(DatabaseContext);
