import React, { useEffect, useState } from "react";
import { useNotif } from "../context/NotifContext";
import Input from "../components/Input";
import Button from "../components/Button";
import Cookies from "js-cookie";
import instance from "../api/api";
import { useTokenContext } from "../context/TokenContext";
import Label from "../components/Label";
import { Navigate, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/StateContext";
import BackButton from "../components/BackButton";
import {
  fetchPilgubPaslon,
  fetchUserId,
  fetchRiwayatPilgub,
} from "../functions/fetchData";
import Loading from "../components/Loading";
import InputImage from "../components/InputImage";

export default function Pilgub() {
  const { token } = useTokenContext();
  const { setLoadingButton, setLoading, loading } = useStateContext();
  const [paslon, setPaslon] = useState([]);
  const [user, setUser] = useState(null);
  const [riwayat, setRiwayat] = useState([]);

  const navigate = useNavigate();

  const [suaraPaslon, setSuaraPaslon] = useState([]);
  const [image, setImage] = useState(null);
  const [jumlahSuara, setJumlahSuara] = useState(Array(paslon.length).fill(""));
  const [jumlahSuaraSah, setJumlahSuaraSah] = useState(0);
  const [jumlahSuaraTidakSah, setJumlahSuaraTidakSah] = useState(0);
  const [jumlahSuaraTercatat, setJumlahSuaraTercatat] = useState(0);

  useEffect(() => {
    const jumlahSuaraTidakSahNum = parseInt(jumlahSuaraTidakSah) || 0;
    const jumlahSuaraNum = jumlahSuara.map((suara) => parseInt(suara) || 0);

    setJumlahSuaraTercatat(
      jumlahSuaraNum.reduce((a, b) => a + b, 0) + jumlahSuaraTidakSahNum
    );
    setJumlahSuaraSah(jumlahSuaraNum.reduce((a, b) => a + b, 0));
  }, [jumlahSuara, jumlahSuaraSah, jumlahSuaraTidakSah]);

  const showNotification = useNotif();

  useEffect(() => {
    if (!token && !Cookies.get("token")) {
      showNotification("Anda harus login terlebih dahulu", "error");
      return navigate("/login");
    }
  }, [navigate, token]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const paslon = await fetchPilgubPaslon();
      setPaslon(paslon);
      setLoading(false);
    };
    getData();
  }, [setLoading]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const item = await fetchUserId();
      setUser(item.data);
      setLoading(false);
    };
    getData();
  }, [setLoading]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const item = await fetchRiwayatPilgub();
      setRiwayat(item);
      setLoading(false);
    };
    getData();
  }, [setLoading]);

  const handleSuara = (e) => {
    e.preventDefault();
    setLoadingButton(true);
    setLoading(true);

    if (!user || !image || suaraPaslon.length !== paslon.length) {
      showNotification("Data belum lengkap", "error");
      setLoadingButton(false);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("tps", user?.tps?._id);
    suaraPaslon.forEach((suara) =>
      formData.append("suaraPaslon[]", JSON.stringify(suara))
    );

    instance
      .post(`/suara/pilgub/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      })
      .then(() => {
        showNotification("Suara terkirim", "success");
        setLoadingButton(false);
        setLoading(false);
        updateTps();
      })
      .catch(() => {
        showNotification("Gagal mengirim", "error");
        setLoadingButton(false);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };

  const handleAddSuara = (index, paslonId, jumlahSuaraSah) => {
    if (!paslonId) return;

    setSuaraPaslon((prev) => {
      const updatedSuara = [...prev];
      updatedSuara[index] = {
        paslon: paslonId,
        suaraSah: jumlahSuaraSah === "" ? "" : jumlahSuaraSah || 0,
      };
      return updatedSuara;
    });

    setJumlahSuara((prev) => {
      const updatedJumlah = [...prev];
      updatedJumlah[index] = jumlahSuaraSah === "" ? "" : jumlahSuaraSah || 0;
      return updatedJumlah;
    });
  };

  const updateTps = () => {
    const dataJson = {
      pilgub: {
        suaraSah: jumlahSuaraSah,
        suaraTidakSah: jumlahSuaraTidakSah,
        suaraTidakTerpakai:
          user?.tps?.pilgub?.kertasSuara - jumlahSuaraTercatat,
        kertasSuara: user?.tps?.pilgub?.kertasSuara,
        user: user?._id,
      },
    };

    instance
      .patch(`/tps/update/${user?.tps?._id}`, dataJson, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      })
      .then(() => {
        setTimeout(() => {
          window.location.reload();
          navigate("/");
        }, 500);
      })
      .catch((err) => console.log(err));
  };

  return loading ? (
    <div className="w-full h-64">
      <Loading />
    </div>
  ) : riwayat.length >= 1 ? (
    <div className="space-y-6">
      <div>
        <h1 className="font-medium text-lg">Anda telah mengirim suara</h1>
        <p className="text-gray-500 font-light">
          Anda hanya bisa mengirim suara satu kali, untuk perubahan data bisa
          hubungi nomor ini :{" "}
          <a
            href="https://wa.me/6285797945972"
            target="_blank"
            className="text-black underline"
          >
            xxxx-xxxx-xxxx
          </a>
        </p>
      </div>
      <BackButton url="/" />
    </div>
  ) : (
    <form onSubmit={handleSuara} className="flex flex-col gap-3">
      <Label title="Dapil" value={user?.tps?.dapil} isAuto={true} />
      <Label title="Kecamatan" value={user?.tps?.kecamatan} isAuto={true} />
      <Label title="Desa" value={user?.tps?.desa} isAuto={true} />
      <Label title="TPS" value={user?.tps?.kodeTPS} isAuto={true} />

      {paslon.map((item, index) => (
        <div key={item._id} className="w-full flex flex-col gap-3">
          <Input
            label={`${item?.panggilan} (Nomor Urut ${item?.noUrut})`}
            name={`jumlah-${index}`}
            type="text"
            setValue={(e) => handleAddSuara(index, item._id, parseInt(e) || 0)}
            value={jumlahSuara[index]}
            required
            placeholder="Suara Sah"
          />
        </div>
      ))}

      <Input
        name="jumlahSuaraTidakSah"
        value={jumlahSuaraTidakSah}
        setValue={setJumlahSuaraTidakSah}
        type="number"
        label="Suara Tidak Sah"
        placeholder="Suara Tidak Sah"
      />

      <InputImage
        value={image}
        setValue={setImage}
        label={"Formulir C1 Plano"}
        required
      />

      <p>
        ({jumlahSuaraTercatat}/{user?.tps?.pilgub?.kertasSuara}) Suara
      </p>

      <Button text="Kirim" />
    </form>
  );
}
