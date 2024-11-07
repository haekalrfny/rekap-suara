import React, { useEffect, useState } from "react";
import { useTokenContext } from "../context/TokenContext";
import { useStateContext } from "../context/StateContext";
import { Navigate, useNavigate } from "react-router-dom";
import HeadingLoad from "../components/Load/HeadingLoad";
import Input from "../components/Input";
import Button from "../components/Button";
import instance from "../api/api";
import { useNotif } from "../context/NotifContext";
import Cookies from "js-cookie";
import BackButton from "../components/BackButton";
import { fetchUserId } from "../functions/fetchData";
export default function Absen() {
  const { token } = useTokenContext();
  const { setLoadingButton, loading, setLoading } = useStateContext();
  const [attending, setAttending] = useState(false);
  const [image, setImage] = useState(null);
  const showNotification = useNotif();
  const navigate = useNavigate();

  if (!token) {
    showNotification("Anda harus login terlebih dahulu", "error");
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const data = await fetchUserId();
      setAttending(data.attandance);
      setLoading(false);
    };
    getData();
  }, [setLoading]);

  const handleAbsen = (e) => {
    e.preventDefault();
    setLoadingButton(true);

    if (!image) {
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
      })
      .catch((err) => {
        showNotification("Absen Gagal", "error");
        console.log(err);
        setLoadingButton(false);
      });
  };

  return (
    <div className="w-full flex justify-center md:pt-6 pb-10">
      <div className="w-[90%] sm:w-2/4 flex flex-col gap-6">
        {loading ? (
          <HeadingLoad />
        ) : (
          <div className="space-y-3">
            <h1 className="font-bold text-3xl">Absensi</h1>
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
                Untuk perubahan data bisa hubungi nomor ini :{" "}
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
