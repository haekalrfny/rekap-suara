import React, { useEffect, useState } from "react";
import { useDatabaseContext } from "../context/DatabaseContext";
import { useNotif } from "../context/NotifContext";
import Input from "../components/Input";
import Button from "../components/Button";
import Cookies from "js-cookie";
import instance from "../api/api";
import { useStateContext } from "../context/StateContext";
import { Navigate } from "react-router-dom";
import { useTokenContext } from "../context/TokenContext";
import HeadingLoad from "../components/Load/HeadingLoad";
import Label from "../components/Label";
import BackButton from "../components/BackButton";

export default function KirimSuara() {
  const { token, attending } = useTokenContext();
  const { paslonData } = useDatabaseContext();
  const { setLoadingButton, loading, setLoading } = useStateContext();
  const userId = Cookies.get("_id");
  const [data, setData] = useState(null);
  const [riwayat, setRiwayat] = useState([]);
  const [suaraPaslon, setSuaraPaslon] = useState([]);
  const [image, setImage] = useState(null);
  const [jumlahSuara, setJumlahSuara] = useState(
    Array(paslonData.length).fill("")
  );
  const [jumlahSuaraTidakSah, setJumlahSuaraTidakSah] = useState("");
  const [jumlahSuaraTercatat, setJumlahSuaraTercatat] = useState(0);

  useEffect(() => {
    const jumlahSuaraTidakSahNum = parseInt(jumlahSuaraTidakSah) || 0;
    const jumlahSuaraNum = jumlahSuara.map((suara) => parseInt(suara) || 0);

    setJumlahSuaraTercatat(
      jumlahSuaraNum.reduce((a, b) => a + b, 0) + jumlahSuaraTidakSahNum
    );
  }, [jumlahSuara, jumlahSuaraTidakSah]);

  const showNotification = useNotif();

  if ((!token && !Cookies.get("token")) || !attending) {
    showNotification(
      !token ? "Anda harus login terlebih dahulu" : "Anda belum mengisi absen",
      "error"
    );
    return <Navigate to="/login" />;
  }

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

  const handleSuara = (e) => {
    e.preventDefault();
    setLoadingButton(true);
    setLoading(true);

    if (!data || !image || suaraPaslon.length !== 5) {
      showNotification("Data belum lengkap", "error");
      setLoadingButton(false);
      setLoading(false);
      return;
    }

    const totalSuaraSah = jumlahSuara.reduce((acc, curr) => acc + curr, 0);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("tps", data?._id);
    suaraPaslon.forEach((suara) =>
      formData.append("suaraPaslon[]", JSON.stringify(suara))
    );

    instance
      .post("/suara", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      })
      .then(() => {
        showNotification("Suara terkirim", "success");
        setLoadingButton(false);
        setTimeout(() => window.location.reload(), 1000);
        if (totalSuaraSah) updateTps(totalSuaraSah);
        setLoading(false);
      })
      .catch((err) => {
        showNotification("Gagal mengirim", "error");
        setLoadingButton(false);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };

  const updateTps = (suaraSah) => {
    const dataJson = {
      jumlahSuaraSah: suaraSah,
      jumlahSuaraTidakSah,
      jumlahSuaraTidakTerpakai:
        data?.jumlahTotal === jumlahSuaraTercatat
          ? 0
          : data?.jumlahTotal - jumlahSuaraTercatat,
    };

    instance
      .patch(`/tps/update/${data?._id}`, dataJson, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      })
      .catch((err) => console.log(err));
  };

  const handleAddSuara = (index, paslonId, jumlahSuaraSah) => {
    if (!paslonId) return;

    setSuaraPaslon((prev) => {
      const updatedSuara = [...prev];
      updatedSuara[index] = {
        paslon: paslonId,
        jumlahSuaraSah: jumlahSuaraSah === "" ? "" : jumlahSuaraSah || 0,
      };
      return updatedSuara;
    });

    setJumlahSuara((prev) => {
      const updatedJumlah = [...prev];
      updatedJumlah[index] = jumlahSuaraSah === "" ? "" : jumlahSuaraSah || 0;
      return updatedJumlah;
    });
  };

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
      setRiwayat(res.data);
    };
    fetchRiwayat();
  }, [userId]);

  return (
    <div className="w-full flex justify-center md:pt-6 pb-10">
      <div className="w-[90%] sm:w-2/4 flex flex-col gap-6">
        {loading ? (
          <HeadingLoad />
        ) : (
          <div className="space-y-3">
            <h1 className="font-bold text-3xl">Kirim Suara</h1>
            <p className="font-light text-gray-600">
              Silakan Inputkan Rekap Suara dari Setiap Tempat Pemungutan Suara
              (TPS) dengan Cermat dan Sesuai Data Asli untuk Memastikan Akurasi
              dalam Penghitungan Suara
            </p>
          </div>
        )}

        {riwayat.length >= 1 ? (
          <div>
            <h1 className="font-medium text-lg">Anda telah mengirim suara</h1>
            <p className="text-gray-500 font-light">
              Anda hanya bisa mengirim suara satu kali, untuk perubahan data
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
        ) : (
          <form onSubmit={handleSuara} className="flex flex-col gap-3">
            <Label
              title={"Dapil"}
              value={data?.dapil}
              isAuto={true}
              isMobile={true}
            />
            <Label
              title={"Kecamatan"}
              value={data?.kecamatan}
              isAuto={true}
              isMobile={true}
            />
            <Label
              title={"Desa"}
              value={data?.desa}
              isAuto={true}
              isMobile={true}
            />
            <Label
              title={"TPS"}
              value={data?.kodeTPS}
              isAuto={true}
              isMobile={true}
            />

            {data && (
              <>
                <div className="flex flex-col gap-3">
                  {paslonData.map((paslon, index) => (
                    <div
                      key={paslon._id}
                      className="w-full flex flex-col gap-3"
                    >
                      <Input
                        isMobile={true}
                        label={`${paslon?.panggilan} (Nomor Urut ${paslon?.noUrut})`}
                        name={`jumlah-${index}`}
                        type="text"
                        setValue={(e) =>
                          handleAddSuara(index, paslon._id, parseInt(e) || 0)
                        }
                        value={jumlahSuara[index]}
                        required
                        placeholder="Suara Sah"
                      />
                    </div>
                  ))}
                </div>
                <Input
                  name="jumlahSuaraTidakSah"
                  value={jumlahSuaraTidakSah}
                  setValue={setJumlahSuaraTidakSah}
                  type="number"
                  label="Suara Tidak Sah"
                  placeholder="Suara Tidak Sah"
                  isMobile={true}
                />
                <Input
                  name="image"
                  label="Formulir C1"
                  type="file"
                  setValue={setImage}
                  isMobile={true}
                  required
                />
              </>
            )}
            <p>
              ({jumlahSuaraTercatat}/{data?.jumlahTotal})
            </p>
            <Button text="Kirim" onClick={handleSuara} />
          </form>
        )}
      </div>
    </div>
  );
}
