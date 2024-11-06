import React, { useEffect, useState } from "react";
import { useTokenContext } from "../context/TokenContext";
import { useStateContext } from "../context/StateContext";
import { Navigate, useNavigate } from "react-router-dom";
import HeadingLoad from "../components/Load/HeadingLoad";
import Input from "../components/Input";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";
import instance from "../api/api";
import { useNotif } from "../context/NotifContext";
import Cookies from "js-cookie";
import BackButton from "../components/BackButton";

export default function Absen() {
  const { token, attending, user } = useTokenContext();
  const { setLoadingButton, loading } = useStateContext();
  const [kertasPilkada, setKertasPilkada] = useState(0);
  const [kertasPilgub, setKertasPilgub] = useState(0);
  const [image, setImage] = useState(null);
  const showNotification = useNotif();
  const navigate = useNavigate();

  if (!token) {
    showNotification("Anda harus login terlebih dahulu", "error");
    return <Navigate to="/login" />;
  }

  const handleAbsen = (e) => {
    e.preventDefault();
    setLoadingButton(true);

    if (!image && !kertasPilkada && !kertasPilgub) {
      showNotification("Data belum lengkap", "error");
      setLoadingButton(false);
      return false;
    }

    instance
      .request({
        method: "patch",
        url: `/attendance/${Cookies.get("_id")}`,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        data: { attandance: true, image },
      })
      .then((res) => {
        showNotification("Absen Berhasil", "success");
        setLoadingButton(false);
        updateTps();
      })
      .catch((err) => {
        showNotification("Absen Gagal", "error");
        console.log(err);
        setLoadingButton(false);
      });
  };

  const updateTps = () => {
    const dataJson = {
      pilkada: { kertasSuara: kertasPilkada, user: user?._id },
      pilgub: { kertasSuara: kertasPilgub, user: user?._id },
    };

    instance
      .patch(`/tps/update/${user?.tps?._id}`, dataJson, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      })
      .then((res) => {
        navigate("/");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="w-full flex justify-center md:pt-6 pb-10">
      <div className="w-[90%] sm:w-2/4 flex flex-col gap-6">
        {loading ? (
          <HeadingLoad />
        ) : (
          <div className="space-y-3">
            <h1 className="font-bold text-3xl">Absen</h1>
            <p className="font-light text-gray-600">
              Silahkan absen terlebih dahulu agar dapat melakukan kirim suara.
            </p>
          </div>
        )}
        {attending ? (
          <div className="space-y-6">
            <div>
              <h1 className="font-medium text-lg">Anda telah absen</h1>
              <p className="text-gray-500 font-light">
                Untuk perubahan data
                bisa hubungi nomor ini :{" "}
                <a
                  href="https://wa.me/6285797945972"
                  target="_blank"
                  className="text-black underline"
                >
                  xxxx-xxxx-xxxx
                </a>
              </p>
            </div>
            <BackButton url={"/"} />
          </div>
        ) : (
          <form className="flex flex-col gap-3" onSubmit={handleAbsen}>
            <Input
              name="Kertas Suara Pilkada"
              label="Kertas Suara Pilkada"
              type="text"
              setValue={setKertasPilkada}
              placeholder={"Kertas Suara Pilkada"}
              required
            />
            <Input
              name="Kertas Suara Pilgub"
              label="Kertas Suara Pilgub"
              type="text"
              setValue={setKertasPilgub}
              placeholder={"Kertas Suara Pilgub"}
              required
            />
            <Input
              name="image"
              label="Bukti Kehadiran"
              type="file"
              setValue={setImage}
              required
            />
            <Button text={"Kirim"} onClick={handleAbsen} />
          </form>
        )}
      </div>
    </div>
  );
}
