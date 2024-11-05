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
  const { token, attending } = useTokenContext();
  const { setLoadingButton, loading } = useStateContext();
  const [data, setData] = useState(null);
  const [suara, setSuara] = useState(0);
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

    if (!image && !suara) {
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
        data: { isAttending: true, image },
      })
      .then((res) => {
        showNotification("Absen Berhasil", "success");
        setLoadingButton(false);
        updateTps();
        navigate("/");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch((err) => {
        showNotification("Absen Gagal", "error");
        console.log(err);
        setLoadingButton(false);
      });
  };

  useEffect(() => {
    getDataById();
  }, []);

  const getDataById = () => {
    let config = {
      method: "get",
      url: `/tps/by/username/${Cookies.get("username")}`,
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    };
    instance
      .request(config)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateTps = () => {
    const dataJson = {
      jumlahTotal: suara,
    };

    instance
      .patch(`/tps/update/${data?._id}`, dataJson, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
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
          <>
            <p className="text-light text-gray-500 text-center h-20">
              Anda Sudah Absen
            </p>
            <BackButton url={"/"} />
          </>
        ) : (
          <form className="flex flex-col gap-3" onSubmit={handleAbsen}>
            <Input
              name="Jumlah Kertas Suara"
              label="Jumlah Kertas Suara"
              type="text"
              setValue={setSuara}
              placeholder={"Jumlah Kertas Suara"}
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
