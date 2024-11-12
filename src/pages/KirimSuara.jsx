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
import {
  fetchUserId,
  fetchRiwayatPilbup,
  fetchRiwayatPilgub,
} from "../functions/fetchData";

export default function KirimSuara() {
  const { token } = useTokenContext();
  const { loading, setLoading } = useStateContext();
  const [type, setType] = useState("");
  const [user, setUser] = useState(null);
  const [pilgub, setPilgub] = useState([]);
  const [pilbup, setPilbup] = useState([]);
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

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const item = await fetchRiwayatPilgub();
      setPilgub(item);
      setLoading(false);
    };
    getData();
  }, [setLoading]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const item = await fetchRiwayatPilbup();
      setPilbup(item);
      setLoading(false);
    };
    getData();
  }, [setLoading]);

  const menuData = [
    {
      label: "Pilkada Jabar",
      icon: (
        <div
          className={`flex font-medium items-center gap-2 py-0.5 px-2 ${
            pilgub.length > 0
              ? "bg-green-100 text-green-500"
              : "bg-red-100 text-red-500"
          }  rounded-md text-sm md:text-xs`}
        >
          <div
            className={`${
              pilgub.length > 0 ? "bg-green-500" : "bg-red-500"
            } h-2 w-2 rounded-full`}
          />
          <p>{pilgub.length > 0 ? "Sudah" : "Belum"}</p>
        </div>
      ),
      link: () => setType("pilgub"),
    },
    {
      label: "Pilkada KBB",
      icon: (
        <div
          className={`flex font-medium  items-center gap-2 py-0.5 px-2 ${
            pilbup.length > 0
              ? "bg-green-100 text-green-500"
              : "bg-red-100 text-red-500"
          }  rounded-md text-sm md:text-xs`}
        >
          <div
            className={`${
              pilbup.length > 0 ? "bg-green-500" : "bg-red-500"
            } h-2 w-2 rounded-full`}
          />
          <p>{pilbup.length > 0 ? "Sudah" : "Belum"}</p>
        </div>
      ),
      link: () => setType("pilbup"),
    },
  ];

  return (
    <div className="w-full flex  justify-center md:pt-6 pb-10">
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
        {!type && (
          <div className="space-y-6">
            <Menu data={menuData} isFull={true} type="click" />
            <div className="space-y-3">
              <h1 className="font-medium">Keterangan</h1>
              <div className="flex items-center gap-3">
                <div className="py-0.5 px-2 text-sm md:text-xs flex items-center font-medium gap-2 bg-green-100 text-green-500 rounded-md w-max">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <p>Sudah</p>
                </div>
                <p>:</p>
                <p className=" text-base md:text-sm">
                  Sudah Mengirim Hasil Pilkada
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="py-0.5 px-2 text-sm md:text-xs flex items-center font-medium gap-2 bg-red-100 text-red-500 rounded-md w-max">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <p>Belum</p>
                </div>
                <p>:</p>
                <p className=" text-base md:text-sm">
                  Belum Mengirim Hasil Pilkada
                </p>
              </div>
            </div>
          </div>
        )}
        {type === "pilbup" ? <Pilbup /> : type === "pilgub" ? <Pilgub /> : null}
      </div>
    </div>
  );
}
