import React, { useState } from "react";
import { useNotif } from "../context/NotifContext";
import Cookies from "js-cookie";
import { useTokenContext } from "../context/TokenContext";
import HeadingLoad from "../components/Load/HeadingLoad";
import BackButton from "../components/BackButton";
import { Navigate } from "react-router-dom";
import { useStateContext } from "../context/StateContext";
import Pilbub from "./Pilbup";
import Pilgub from "./Pilgub";
import Switch from "../components/Switch";

export default function KirimSuara() {
  const { token, attending } = useTokenContext();
  const { loading } = useStateContext();
  const [type, setType] = useState("pilbub");

  const showNotification = useNotif();

  if ((!token && !Cookies.get("token")) || !attending) {
    showNotification(
      !token ? "Anda harus login terlebih dahulu" : "Anda belum mengisi absen",
      "error"
    );
    return <Navigate to="/login" />;
  }

  const menuSwitch = [
    {
      name: "Pilkada KBB",
      value: "pilbub",
    },
    {
      name: "Pilkada Jabar",
      value: "pilgub",
    },
  ];

  return (
    <div className="w-full flex justify-center md:pt-6 pb-10">
      <div className="w-[90%] sm:w-2/4 flex flex-col gap-6">
        {loading ? (
          <HeadingLoad />
        ) : (
          <div className="space-y-3">
            <h1 className="font-bold text-3xl">Suara Pilkada</h1>
            <p className="font-light text-gray-600">
              Silakan Inputkan Suara Pilkada dari Setiap Tempat Pemungutan Suara
              (TPS) dengan Cermat dan Sesuai Data Asli untuk Memastikan Akurasi
              dalam Penghitungan Suara
            </p>
          </div>
        )}
        <Switch menu={menuSwitch} value={type} setValue={setType} />

        {type === "pilbub" ? <Pilbub /> : type === "pilgub" ? <Pilgub /> : null}
      </div>
    </div>
  );
}
