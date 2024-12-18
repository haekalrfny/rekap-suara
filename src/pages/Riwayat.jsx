import React, { useEffect, useState } from "react";
import HeadingLoad from "../components/Load/HeadingLoad";
import { useStateContext } from "../context/StateContext";
import Cookies from "js-cookie";
import { useNotif } from "../context/NotifContext";
import { Navigate } from "react-router-dom";
import { useTokenContext } from "../context/TokenContext";
import { HiOutlineExternalLink } from "react-icons/hi";
import Image from "../components/Image";
import Switch from "../components/Switch";
import { fetchRiwayatPilbup, fetchRiwayatPilgub } from "../functions/fetchData";

export default function Riwayat() {
  const { token } = useTokenContext();
  const [riwayatPilbup, setRiwayatPilbup] = useState([]);
  const [riwayatPilgub, setRiwayatPilgub] = useState([]);
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [type, setType] = useState("pilgub");
  const { loading, setLoading } = useStateContext();
  const showNotification = useNotif();

  if (!token && !Cookies.get("token")) {
    showNotification("Anda harus login terlebih dahulu", "error");
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const item = await fetchRiwayatPilbup();
      setRiwayatPilbup(item);
      setLoading(false);
    };
    getData();
  }, [setLoading]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const item = await fetchRiwayatPilgub();
      setRiwayatPilgub(item);
      setLoading(false);
    };
    getData();
  }, [setLoading]);

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

  const renderImage = (img, item) => {
    setImage(img);
    setShowImage(true);
  };

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
          "Suara Sah",
          "Suara Tidak Sah",
          "Suara Tidak Terpakai",
          "Kertas Suara",
          "Formulir C1 Plano",
        ].map((label, idx, array) => (
          <div key={idx}>
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-700">{label}</p>
              <p className="text-gray-600">
                {label === "TPS" ? (
                  `TPS ${item.tps?.kodeTPS}`
                ) : label === "Suara Sah" ? (
                  `${item.tps?.[type]?.suaraSah} Suara`
                ) : label === "Suara Tidak Sah" ? (
                  `${item.tps?.[type]?.suaraTidakSah} Suara`
                ) : label === "Suara Tidak Terpakai" ? (
                  `${item.tps?.[type]?.suaraTidakTerpakai} Suara`
                ) : label === "Kertas Suara" ? (
                  `${item.tps?.[type]?.kertasSuara} Kertas`
                ) : label === "Formulir C1 Plano" ? (
                  <div className="flex items-center gap-1">
                    <a>Lihat</a>
                    <div
                      onClick={() => renderImage(item?.image, item)}
                      className="p-0.5 rounded-md cursor-pointer hover:bg-gray-100"
                    >
                      <HiOutlineExternalLink />
                    </div>
                  </div>
                ) : (
                  item.tps?.[label.toLowerCase()]
                )}
              </p>
            </div>
            {/* Add an HR except for the last item */}
            {idx !== array.length - 1 && (
              <hr className="border-gray-300 my-2" />
            )}
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
                <td className="border px-4 py-2">
                  {suara.paslon?.panggilan} (No Urut {suara.paslon?.noUrut})
                </td>
                <td className="border px-4 py-2">{suara.suaraSah} Suara</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="font-light text-gray-500">
        Ada kesalahan data? hubungi nomor ini :{" "}
        <a
          href={`https://wa.me/6283181700081?text=Username%20:%20${item?.user?.username}`}
          target="_blank"
          className="text-black underline"
        >
          6283181700081
        </a>
      </p>
    </div>
  );

  const displayedRiwayat = type === "pilkada" ? riwayatPilbup : riwayatPilgub;

  return (
    <>
      <div className="w-full flex justify-center md:pt-6 pb-10">
        <div className="w-[90%] sm:w-2/4 flex flex-col gap-6">
          {loading ? (
            <HeadingLoad />
          ) : (
            <div className="space-y-3">
              <h1 className="font-bold text-3xl">Riwayat</h1>
              <p className="font-light text-gray-600">
                Riwayat Penghitungan Suara Pilkada Anda
              </p>
            </div>
          )}
          <Switch menu={menuSwitch} value={type} setValue={setType} />
          <div className="space-y-3">
            {displayedRiwayat?.length === 0 || !displayedRiwayat ? (
              <div className="w-full h-64 flex items-center justify-center">
                <p className="font-light text-gray-600">
                  Belum memiliki riwayat
                </p>
              </div>
            ) : (
              displayedRiwayat?.map(renderRiwayatItem)
            )}
          </div>
        </div>
      </div>
      {showImage && <Image url={image} onCancel={() => setShowImage(false)} />}
    </>
  );
}
