import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import PaslonCard from "../components/Paslon/PaslonCard";
import { useTokenContext } from "../context/TokenContext";
import { useStateContext } from "../context/StateContext";
import HeadingLoad from "../components/Load/HeadingLoad";
import Button from "../components/Button";
import Cookies from "js-cookie";
import instance from "../api/api";
import { useNotif } from "../context/NotifContext";
import {
  fetchPaslonData,
  fetchUserId,
  fetchPilgubPaslon,
} from "../functions/fetchData";
import Switch from "../components/Switch";

export default function Paslon() {
  const { token } = useTokenContext();
  const { loading, setLoadingButton, setLoading } = useStateContext();
  const [user, setUser] = useState(null);
  const [type, setType] = useState("pilgub");
  const [paslon, setPaslon] = useState([]);
  const [pilgub, setPilgub] = useState([]);
  const showNotification = useNotif();

  useEffect(() => {
    if (!token && !Cookies.get("token")) {
      showNotification("Anda harus login terlebih dahulu", "error");
    }
  }, [token, showNotification]);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const [paslonData, pilgubData, userData] = await Promise.all([
          fetchPaslonData(),
          fetchPilgubPaslon(),
          fetchUserId(),
        ]);
        setPaslon(paslonData);
        setPilgub(pilgubData);
        setUser(userData.data);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [setLoading]);

  const downloadPaslonByTPS = () => {
    setLoadingButton(true);
    const config = {
      method: "get",
      url: `/tps/excel/paslon${user?.district ? "/kecamatan" : ""}/${type}`,
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      params: { kecamatan: user?.district || "" },
      responseType: "blob",
    };

    instance
      .request(config)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "TPS Paslon.xlsx");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        setLoadingButton(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingButton(false);
      });
  };

  const menuSwitch = [
    {
      name: "Pilkada Jabar",
      value: "pilgub",
    },
    {
      name: "Pilkada KBB",
      value: "pilkada",
    },
  ];

  if (!token && !Cookies.get("token")) {
    return <Navigate to="/login" />;
  }

  const displayedPaslon = type === "pilgub" ? pilgub : paslon;

  return (
    <div className="w-full flex flex-col items-center md:pt-6 pb-10 gap-6">
      <div className="w-[90%] sm:w-2/4 flex flex-col gap-6">
        <div className="space-y-3">
          {loading ? (
            <HeadingLoad />
          ) : (
            <div className="space-y-3">
              <h1 className="font-bold text-3xl">Paslon</h1>
              <p className="font-light text-gray-600">
                Data suara pasangan calon Pilkada Bandung Barat 2024
              </p>
            </div>
          )}
          <Button
            text="Download"
            onClick={downloadPaslonByTPS}
            isFull={false}
            size="sm"
          />
          <Switch menu={menuSwitch} value={type} setValue={setType} />
        </div>
      </div>
      <div
        className={`w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[90%]`}
      >
        {displayedPaslon.map((item, index) => (
          <PaslonCard item={item} key={index} type={type} />
        ))}
      </div>
    </div>
  );
}
