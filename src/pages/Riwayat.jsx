import React, { useEffect, useState } from "react";
import HeadingLoad from "../components/Load/HeadingLoad";
import { useStateContext } from "../context/StateContext";
import instance from "../api/api";
import Cookies from "js-cookie";
import { useNotif } from "../context/NotifContext";
import { Navigate } from "react-router-dom";
import { useTokenContext } from "../context/TokenContext";

export default function Riwayat() {
  const { token } = useTokenContext();
  const { loading } = useStateContext();
  const [data, setData] = useState([]);
  const userId = Cookies.get("_id");
  const showNotification = useNotif();

  if (!token && !Cookies.get("token")) {
    showNotification("Anda harus login terlebih dahulu", "error");
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const fetchRiwayat = async () => {
      const config = {
        method: "get",
        url: `/suara/user/${userId}`,
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      };
      const res = await instance(config);
      setData(res.data);
    };
    fetchRiwayat();
  }, [userId]);

  const renderRiwayatItem = (item) => (
    <div key={item._id} className="space-y-3">
      <p className="text-sm text-gray-600 mb-2">
        {new Date(item.createdAt).toLocaleString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </p>
      <div className="space-y-2">
        {[
          "Dapil",
          "Kecamatan",
          "Desa",
          "TPS",
          "Total Suara Sah",
          "Suara Tidak Sah",
        ].map((label, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <p className="font-medium text-gray-700">{label}</p>
            <p className="text-gray-600">
              {label === "TPS"
                ? `TPS ${item.tps?.kodeTPS}`
                : label === "Total Suara Sah"
                ? `${item.tps?.jumlahSuaraSah} Suara`
                : label === "Suara Tidak Sah"
                ? `${item.tps?.jumlahSuaraTidakSah} Suara`
                : item.tps?.[label.toLowerCase()]}
            </p>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-xl border">
        <table className="table-auto w-full text-justify text-base md:text-sm">
          <thead>
            <tr>
              <td className="border font-semibold px-4 py-2">Paslon</td>
              <td className="border font-semibold px-4 py-2">Suara</td>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {item.suaraPaslon.map((suara, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{suara.paslon?.panggilan}</td>
                <td className="border px-4 py-2">
                  {suara.jumlahSuaraSah} Suara
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="w-full flex justify-center md:pt-6 pb-10">
      <div className="w-[90%] sm:w-2/4 flex flex-col gap-6">
        {loading ? (
          <HeadingLoad />
        ) : (
          <div className="space-y-3">
            <h1 className="font-bold text-3xl">Riwayat</h1>
            <p className="font-light text-gray-600">
              Riwayat Penghitungan Suara Anda
            </p>
          </div>
        )}
        <div className="space-y-3">
          {data.length === 0 ? (
            <div className="w-full h-64 flex items-center justify-center">
              <p className="font-light text-gray-600">Belum memiliki riwayat</p>
            </div>
          ) : (
            data.map(renderRiwayatItem)
          )}
        </div>
      </div>
    </div>
  );
}
