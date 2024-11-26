import React, { useEffect, useState } from "react";
import { useTokenContext } from "../context/TokenContext";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useNotif } from "../context/NotifContext";
import HeadingLoad from "../components/Load/HeadingLoad";
import { useStateContext } from "../context/StateContext";
import { fetchUserId } from "../functions/fetchData";
import Label from "../components/Label";
import Input from "../components/Input";
import Button from "../components/Button";
import instance from "../api/api";
import BackButton from "../components/BackButton";
import Loading from "../components/Loading";

export default function KertasSuara() {
  const { token } = useTokenContext();
  const { loading, setLoading, setLoadingButton } = useStateContext();
  const [user, setUser] = useState(null);
  const [attending, setAttending] = useState(null);
  const [suratPilbup, setSuratPilbup] = useState("");
  const [suratPilgub, setSuratPilgub] = useState("");
  const showNotification = useNotif();
  const navigate = useNavigate();

  useEffect(() => {
    if (attending === false) {
      showNotification("Anda belum mengisi absen", "error");
      navigate("/");
    }
  }, [attending, navigate, showNotification]);

  useEffect(() => {
    if (!token && !Cookies.get("token")) {
      showNotification("Anda harus login terlebih dahulu", "error");
      return navigate("/login");
    }
  }, [navigate, token]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const data = await fetchUserId();
      setUser(data.data);
      setAttending(data.attandance);
      setLoading(false);
    };
    getData();
  }, []);

  const updateTps = (e) => {
    e.preventDefault();
    setLoadingButton(true);
    const dataJson = {
      pilkada: {
        kertasSuara: Number(suratPilbup),
        user: user?._id,
      },
      pilgub: {
        kertasSuara: Number(suratPilgub),
        user: user?._id,
      },
    };

    instance
      .patch(`/tps/update/${user?.tps?._id}`, dataJson, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      })
      .then((res) => {
        setLoadingButton(false);
        setTimeout(() => {
          window.location.reload();
          navigate("/");
        }, 500);
      })
      .catch((err) => {
        setLoadingButton(false);
        console.log(err);
      });
  };

  return (
    <div className="w-full flex justify-center md:pt-6 pb-10">
      <div className="w-[90%] sm:w-2/4 flex flex-col gap-6">
        {loading ? (
          <HeadingLoad />
        ) : (
          <div className="space-y-3">
            <h1 className="font-bold text-3xl">Surat Suara</h1>
            <p className="font-light text-gray-600">
              Jumlah surat suara yang diterima dan digunakan di setiap TPS pada
              Pilkada Bandung Barat 2024.
            </p>
          </div>
        )}
        {loading ? (
          <div className="w-full h-64">
            <Loading />
          </div>
        ) : user?.tps?.pilkada?.kertasSuara &&
          user?.tps?.pilgub?.kertasSuara ? (
          <div className="space-y-6">
            <div>
              <h1 className="font-medium text-lg">
                Anda telah mengisi surat suara
              </h1>
              <p className="text-gray-500 font-light">
                Anda hanya bisa mengisi surat suara satu kali, untuk perubahan
                data bisa hubungi nomor ini :{" "}
                <a
                  href="https://wa.me/6283181700081"
                  target="_blank"
                  className="text-black underline"
                >
                  6283181700081
                </a>
              </p>
            </div>
            <BackButton url="/" />
          </div>
        ) : (
          <form onSubmit={updateTps} className="flex flex-col gap-3">
            <Label title="Dapil" value={user?.tps?.dapil} isAuto={true} />
            <Label
              title="Kecamatan"
              value={user?.tps?.kecamatan}
              isAuto={true}
            />
            <Label title="Desa" value={user?.tps?.desa} isAuto={true} />
            <Label title="TPS" value={user?.tps?.kodeTPS} isAuto={true} />
            <Input
              name="suratPilbup"
              value={suratPilbup}
              setValue={setSuratPilbup}
              type="number"
              label="Pilkada KBB"
              placeholder="Kertas/Surat Suara Pilkada KBB"
            />
            <Input
              name="suratPilgub"
              value={suratPilgub}
              setValue={setSuratPilgub}
              type="number"
              label="Pilkada Jabar"
              placeholder="Kertas/Surat Suara Pilkada Jabar"
            />
            <Button text="Kirim" onClick={updateTps} />
          </form>
        )}
      </div>
    </div>
  );
}
