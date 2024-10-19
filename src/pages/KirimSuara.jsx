import React, { useState } from "react";
import { useDatabaseContext } from "../context/DatabaseContext";
import { useNotif } from "../context/NotifContext";
import Input from "../components/Input";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import Cookies from "js-cookie";
import instance from "../api/api";
import { useStateContext } from "../context/StateContext";
import { Navigate } from "react-router-dom";
import { useTokenContext } from "../context/TokenContext";
import HeadingLoad from "../components/Load/HeadingLoad";

export default function KirimSuara() {
  const { token } = useTokenContext();
  const { tpsData, paslonData } = useDatabaseContext();
  const { setLoadingButton, loading, setLoading } = useStateContext();
  const [desa, setDesa] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [dapil, setDapil] = useState("");
  const [tps, setTps] = useState("");
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

  const dapilOptions = [...new Set(tpsData.map((tp) => tp.dapil))].map(
    (dap) => ({ label: dap, value: dap })
  );

  const kecamatanOptions = [
    ...new Set(
      tpsData.filter((tp) => tp.dapil === dapil).map((tp) => tp.kecamatan)
    ),
  ].map((kec) => ({ label: kec, value: kec }));

  const desaOptions = [
    ...new Set(
      tpsData.filter((tp) => tp.kecamatan === kecamatan).map((tp) => tp.desa)
    ),
  ].map((desa) => ({ label: desa, value: desa }));

  const tpsOptions = tpsData
    .filter((tp) => tp.desa === desa)
    .map((tp) => ({ label: tp.kodeTPS, value: tp._id }));

  const handleSuara = (e) => {
    e.preventDefault();
    setLoadingButton(true);
    setLoading(true);

    if (!tps || !image || suaraPaslon.length !== 5) {
      showNotification("Data belum lengkap", "error");
      setLoadingButton(false);
      setLoading(false);
      return;
    }

    const totalSuaraSah = jumlahSuara.reduce((acc, curr) => acc + curr, 0);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("tps", tps);
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
    const data = {
      jumlahSuaraSah: suaraSah,
      jumlahSuaraTidakSah,
      jumlahTotal: Number(suaraSah) + Number(jumlahSuaraTidakSah),
    };

    instance
      .patch(`/tps/update/${tps}`, data, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      })
      .catch(console.log);
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
        <Dropdown
            label="Dapil"
            options={dapilOptions}
            value={dapil}
            setValue={setDapil}
            required
          />
          <Dropdown
            label="Kecamatan"
            options={kecamatanOptions}
            value={kecamatan}
            setValue={setKecamatan}
            required
          />
          <Dropdown
            label="Desa"
            options={desaOptions}
            value={desa}
            setValue={setDesa}
            required
            isDisabled={!kecamatan}
          />
          <Dropdown
            label="TPS"
            options={tpsOptions}
            value={tps}
            setValue={setTps}
            required
            isDisabled={!desa}
          />

          {tps && (
            <>
              <div className="flex flex-col gap-3">
                {paslonData.map((paslon, index) => (
                  <div
                    key={paslon._id}
                    className="w-full flex flex-col md:flex-row gap-3"
                  >
                    <div className="w-full md:w-1/2">
                      <Input
                        label="Paslon"
                        name={`paslon-${index}`}
                        type="text"
                        value={paslon.panggilan}
                        readOnly
                        required
                      />
                    </div>
                    <div className="w-full md:w-1/2">
                      <Input
                        label="Jumlah Suara"
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
                label="Formulir"
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
