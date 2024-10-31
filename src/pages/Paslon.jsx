import React from "react";
import { useDatabaseContext } from "../context/DatabaseContext";
import { Navigate } from "react-router-dom";
import PaslonCard from "../components/Paslon/PaslonCard";
import { useTokenContext } from "../context/TokenContext";
import { useStateContext } from "../context/StateContext";
import HeadingLoad from "../components/Load/HeadingLoad";
import Button from "../components/Button";
import Cookies from "js-cookie";
import instance from "../api/api";
import { useNotif } from "../context/NotifContext";

export default function Paslon() {
  const { paslonData } = useDatabaseContext();
  const { token, user } = useTokenContext();
  const { loading, setLoadingButton } = useStateContext();
  const showNotification = useNotif();

  if (!token && !Cookies.get("token")) {
    showNotification("Anda harus login terlebih dahulu", "error");
    return <Navigate to="/login" />;
  }
  const downloadPaslonByTPS = () => {
    setLoadingButton(true);
    let config = {
      method: "get",
      url: `/tps/${
        user?.kecamatan
          ? "downloadExcelPaslonByKecamatan"
          : "downloadExcelPaslonByTPS"
      }`,
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      params: { kecamatan: user?.kecamatan },
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
        console.log(err);
        setLoadingButton(false);
      });
  };

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
            text={"Download Paslon"}
            onClick={downloadPaslonByTPS}
            isFull={false}
            size={"sm"}
          />
        </div>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[90%]">
        {paslonData.map((item, index) => {
          return <PaslonCard item={item} key={index} />;
        })}
      </div>
    </div>
  );
}
