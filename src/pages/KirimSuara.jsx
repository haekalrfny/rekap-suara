import React, { useState, useEffect } from "react";
import { useNotif } from "../context/NotifContext";
import Cookies from "js-cookie";
import { useTokenContext } from "../context/TokenContext";
import HeadingLoad from "../components/Load/HeadingLoad";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context/StateContext";
import Pilbup from "./Pilbup";
import Pilgub from "./Pilgub";
import Menu from "../components/Menu";
import { LuScroll } from "react-icons/lu";
import { fetchUserId } from "../functions/fetchData";

export default function KirimSuara() {
  const { token } = useTokenContext();
  const { loading, setLoading } = useStateContext();
  const [type, setType] = useState("");
  const [user, setUser] = useState(null);
  const [attending, setAttending] = useState(null);
  const navigate = useNavigate();
  const showNotification = useNotif();

  const suratSuara =
    user?.tps?.pilkada?.kertasSuara && user?.tps?.pilgub?.kertasSuara;

  useEffect(() => {
    if (attending === false) {
      showNotification("Anda belum mengisi absen", "error");
      navigate("/");
    }
  }, [attending, navigate, showNotification]);

  useEffect(() => {
    if (user && !suratSuara) {
      showNotification("Surat Suara belum diisi", "error");
      navigate("/");
    }
  }, [suratSuara, user, navigate, showNotification]);

  useEffect(() => {
    if (!token && !Cookies.get("token")) {
      showNotification("Anda harus login terlebih dahulu", "error");
      return navigate("/login");
    }
  }, [navigate, token]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const item = await fetchUserId();
      setUser(item.data);
      setAttending(item.attandance);
      setLoading(false);
    };
    getData();
  }, [setLoading]);

  const menuData = [
    {
      label: "Pilkada Jabar",
      icon: <LuScroll />,
      link: () => setType("pilgub"),
    },
    { label: "Pilkada KBB", icon: <LuScroll />, link: () => setType("pilbup") },
  ];

  return (
    <div className="w-full flex justify-center md:pt-6 pb-10">
      <div className="w-[90%] sm:w-2/4 flex flex-col gap-6">
        {loading ? (
          <HeadingLoad />
        ) : (
          <div className="space-y-3">
            <h1 className="font-bold text-3xl">Hasil Pilkada</h1>
            <p className="font-light text-gray-600">
              Silakan Inputkan Hasil Pilkada dari Setiap Tempat Pemungutan Suara
              (TPS) dengan Cermat dan Sesuai Data Asli untuk Memastikan Akurasi
              dalam Penghitungan Suara
            </p>
          </div>
        )}
        {!type && <Menu data={menuData} isFull={true} type="click" />}
        {type === "pilbup" ? <Pilbup /> : type === "pilgub" ? <Pilgub /> : null}
      </div>
    </div>
  );
}
