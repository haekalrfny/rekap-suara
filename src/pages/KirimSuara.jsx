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

export default function KirimSuara() {
  const { token } = useTokenContext();
  const { paslonData } = useDatabaseContext();
  const { setLoadingButton, loading, setLoading } = useStateContext();
  const [data, setData] = useState(null);
  const [suaraPaslon, setSuaraPaslon] = useState([]);
  const [image, setImage] = useState(null);
  const [jumlahSuara, setJumlahSuara] = useState(
    Array(paslonData.length).fill(0)
  );
  const [jumlahSuaraTidakSah, setJumlahSuaraTidakSah] = useState("");
  const showNotification = useNotif();

  if (!token) {
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
        console.log(err);
        setLoading(false);
      })
      .finally(() => setLoading(false));
  };

  const updateTps = (suaraSah) => {
    const dataJson = {
      jumlahSuaraSah: suaraSah,
      jumlahSuaraTidakSah,
      jumlahTotal: Number(suaraSah) + Number(jumlahSuaraTidakSah),
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
        <form onSubmit={handleSuara} className="flex flex-col gap-3">
          <Label title={"Dapil"} value={data?.dapil} isAuto={true} />
          <Label title={"Kecamatan"} value={data?.kecamatan} isAuto={true} />
          <Label title={"Desa"} value={data?.desa} isAuto={true} />
          <Label title={"TPS"} value={data?.kodeTPS} isAuto={true} />

          {data && (
            <>
              <div className="flex flex-col gap-3">
                {paslonData.map((paslon, index) => (
                  <div key={paslon._id} className="w-full flex flex-col gap-3">
                    <Input
                      label={paslon?.panggilan}
                      name={`jumlah-${index}`}
                      type="number"
                      setValue={(e) =>
                        handleAddSuara(index, paslon._id, parseInt(e) || 0)
                      }
                      value={jumlahSuara[index]}
                      required
                      placeholder="Jumlah Suara"
                    />
                  </div>
                ))}
              </div>
              <Input
                name="jumlahSuaraTidakSah"
                value={jumlahSuaraTidakSah}
                setValue={setJumlahSuaraTidakSah}
                type="number"
                label="Jumlah Suara Tidak Sah"
                placeholder="Jumlah Suara Tidak Sah"
              />

              <Input
                name="image"
                label="Formulir C1"
                type="file"
                setValue={setImage}
                required
              />
            </>
          )}
          <Button text="Kirim" onClick={handleSuara} />
        </form>
      </div>
    </div>
  );
}
