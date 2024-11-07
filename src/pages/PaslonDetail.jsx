import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import instance from "../api/api";
import { useStateContext } from "../context/StateContext";
import { useTokenContext } from "../context/TokenContext";
import BackButton from "../components/BackButton";
import { useNotif } from "../context/NotifContext";

export default function PaslonDetail() {
  const { token } = useTokenContext();
  const { setLoading } = useStateContext();
  const { id } = useParams();
  const [item, setItem] = useState({});
  const [totalSuara, setTotalSuara] = useState(0);
  const [totalSaksi, setTotalSaksi] = useState(0);
  const { showNotification } = useNotif();

  useEffect(() => {
    getDataById();
  }, [id]);

  useEffect(() => {
    getSuaraTotalPaslonDetail();
  }, [id]);

  if (!token && !Cookies.get("token")) {
    showNotification("Anda harus login terlebih dahulu", "error");
    return <Navigate to="/login" />;
  }

  const getDataById = () => {
    setLoading(true);
    instance({
      method: "get",
      url: `/paslon/pilkada/${id}`,
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    })
      .then((res) => {
        setLoading(false);
        setItem(res.data);
      })
      .catch(() => setLoading(false));
  };

  const getSuaraTotalPaslonDetail = () => {
    setLoading(true);
    instance({
      method: "get",
      url: `/suara/pilkada/paslon/${id}`,
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    })
      .then((res) => {
        setLoading(false);
        setTotalSuara(res.data["Total Suara"]);
        setTotalSaksi(res.data["Total Saksi"]);
        console.log(res.data)
      })
      .catch(() => setLoading(false));
  };

  const bgColor =
    item.noUrut === 1
      ? "bg-orange-100 text-orange-500"
      : item.noUrut === 2
      ? "bg-blue-100 text-blue-500"
      : item.noUrut === 3
      ? "bg-red-100 text-red-500"
      : item.noUrut === 4
      ? "bg-green-100 text-green-500"
      : "bg-gray-100 text-gray-500";

  return (
    <div className="w-full flex flex-col items-center md:pt-6 pb-10 gap-10">
      <div className="w-[90%] sm:w-2/4 flex flex-col gap-6">
        <div className="space-y-3">
          <p
            className={`text-xs py-0.5 px-3 w-max rounded-full ${bgColor} font-semibold`}
          >
            No Urut {item.noUrut}
          </p>
          <h1 className="font-bold text-3xl">
            {item.ketua} - {item.wakilKetua}
          </h1>
          {item.partai?.length > 0 ? (
            <div className="flex gap-2">
              {item.partai.map((i, idx) => (
                <div key={idx} className="aspect-square w-14">
                  <img
                    src={i.image}
                    alt={i.nama}
                    className="object-contain w-full h-full"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Independen</p>
          )}
        </div>

        <div className="flex gap-6 font-medium text-sm text-gray-600">
          <p>
            {totalSuara} Suara dari {totalSaksi} Saksi
          </p>
        </div>

        <BackButton url={"/paslon"} />
      </div>
    </div>
  );
}
