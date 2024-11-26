import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context/StateContext";
import { useTokenContext } from "../context/TokenContext";
import { useNotif } from "../context/NotifContext";
import {
  fetchUserId,
  fetchDapil,
  fetchKecamatan,
  fetchDesa,
  fetchKodeTPS,
  fetchTpsData,
  fetchPilgubPaslon,
  fetchPaslonData,
  fetchUserByTPS,
  fetchDapilByKecamatan,
} from "../functions/fetchData";
import HeadingLoad from "../components/Load/HeadingLoad";
import Menu from "../components/Menu";
import InputImage from "../components/InputImage";
import Button from "../components/Button";
import Input from "../components/Input";
import Dropdown from "../components/Dropdown";
import instance from "../api/api";
import Cookies from "js-cookie";
import Label from "../components/Label";

export default function KirimSuaraAdmin() {
  const { token } = useTokenContext();
  const { loading, setLoadingButton } = useStateContext();
  const [type, setType] = useState("");
  const [user, setUser] = useState(null);
  const [myUser, setMyUser] = useState(null);

  // const [absen, setAbsen] = useState(null);
  const [suratSuara, setSuratSuara] = useState("");

  const [dapil, setDapil] = useState(null);
  const [dapilOptions, setDapilOptions] = useState([]);
  const [kecamatan, setKecamatan] = useState(null);
  const [kecamatanOptions, setKecamatanOptions] = useState([]);
  const [desa, setDesa] = useState(null);
  const [desaOptions, setDesaOptions] = useState([]);
  const [kodeTPS, setKodeTPS] = useState(null);
  const [kodeTPSOptions, setKodeTPSOptions] = useState([]);
  const [tpsId, setTpsId] = useState(null);

  const [paslon, setPaslon] = useState([]);
  const [jumlahSuaraSah, setJumlahSuaraSah] = useState(0);
  const [jumlahSuaraTidakSah, setJumlahSuaraTidakSah] = useState(0);
  const [jumlahSuaraTercatat, setJumlahSuaraTercatat] = useState(0);
  const [jumlahSuara, setJumlahSuara] = useState(Array(paslon.length).fill(""));
  const [suaraPaslon, setSuaraPaslon] = useState([]);
  const [formulirC1, setFormulirC1] = useState(null);

  const showNotification = useNotif();
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await fetchUserId();
        setMyUser(data.data);
        if (data.data.district) {
          setKecamatan(data.data.district);
          const getDapilByKecamatan = async () => {
            const dapil = await fetchDapilByKecamatan(data.data.district);
            setDapil(dapil);
          };
          getDapilByKecamatan();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const jumlahSuaraTidakSahNum = parseInt(jumlahSuaraTidakSah) || 0;
    const jumlahSuaraNum = jumlahSuara.map((suara) => parseInt(suara) || 0);

    setJumlahSuaraTercatat(
      jumlahSuaraNum.reduce((a, b) => a + b, 0) + jumlahSuaraTidakSahNum
    );
    setJumlahSuaraSah(jumlahSuaraNum.reduce((a, b) => a + b, 0));
  }, [jumlahSuara, jumlahSuaraTidakSah]);

  useEffect(() => {
    if (!token && !Cookies.get("token")) {
      showNotification("Anda harus login terlebih dahulu", "error");
      return navigate("/login");
    }
  }, [navigate, token]);

  const menuData = [
    myUser?.username === "BUPATI"
      ? {}
      : {
          label: "Pilkada Jabar",
          link: () => setType("pilgub"),
        },
    {
      label: "Pilkada KBB",
      link: () => setType("pilkada"),
    },
  ];

  useEffect(() => {
    const getDapil = async () => {
      const data = await fetchDapil();
      const options = data.map((item) => ({ label: item, value: item }));
      setDapilOptions(options);
    };

    const getKecamatan = async () => {
      const data = await fetchKecamatan(dapil);
      const options = data.map((item) => ({ label: item, value: item }));
      setKecamatanOptions(options);
    };

    const getDesa = async () => {
      const data = await fetchDesa(dapil, kecamatan);
      const options = data.map((item) => ({ label: item, value: item }));
      setDesaOptions(options);
    };

    const getKodeTPS = async () => {
      const data = await fetchKodeTPS(dapil, kecamatan, desa);
      const options = data.map((item) => ({ label: item, value: item }));
      setKodeTPSOptions(options);
    };

    const getTPS = async () => {
      try {
        const data = await fetchTpsData();
        const filteredTPS = data.find(
          (item) =>
            item.dapil === dapil &&
            item.kecamatan === kecamatan &&
            item.desa === desa &&
            item.kodeTPS === kodeTPS
        );

        if (filteredTPS) {
          setTpsId(filteredTPS._id);
        }
      } catch (error) {
        console.error("Error fetching TPS data:", error);
      }
    };

    const getPaslon = async () => {
      const data =
        type === "pilgub"
          ? await fetchPilgubPaslon()
          : type === "pilkada"
          ? await fetchPaslonData()
          : [];
      setPaslon(data);
    };

    const getUserByTPS = async () => {
      const data = await fetchUserByTPS(tpsId);
      setUser(data);
    };

    getDapil();
    getKecamatan();
    getDesa();
    getKodeTPS();
    getTPS();
    getPaslon();
    getUserByTPS();
  }, [type, dapil, kecamatan, desa, kodeTPS, tpsId]);

  const handleSuara = async (e) => {
    e.preventDefault();
    setLoadingButton(true);

    // Step 1: Check if 'absen' is provided
    if (!formulirC1) {
      showNotification("Data belum lengkap", "error");
      setLoadingButton(false);
      return;
    }

    try {
      // Step 2: Handle Absen (Attendance)
      await instance.request({
        method: "patch",
        url: `/attendance/${user?._id}`,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        data: { attandance: true, image: formulirC1 },
      });

      // Step 3: Check if formulirC1 is provided
      if (!formulirC1) {
        showNotification("Formulir C1 belum tersedia", "error");
        setLoadingButton(false);
        return;
      }

      // Step 4: Handle Pilkada Suara Submission
      const formData = new FormData();
      formData.append("image", formulirC1);
      formData.append("tps", tpsId);
      suaraPaslon.forEach((suara) =>
        formData.append("suaraPaslon[]", JSON.stringify(suara))
      );

      await instance.post(`/suara/${type}/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      // Step 5: Check if the required TPS data is available
      if (!tpsId) {
        showNotification("TPS data tidak tersedia", "error");
        setLoadingButton(false);
        return;
      }

      // Step 6: Update TPS Data
      const dataJson = {
        [type]: {
          suaraSah: jumlahSuaraSah,
          suaraTidakSah: jumlahSuaraTidakSah,
          suaraTidakTerpakai: suratSuara - jumlahSuaraTercatat,
          kertasSuara: suratSuara,
          user: user?._id,
        },
      };

      await instance.patch(`/tps/update/${tpsId}`, dataJson, {
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });

      showNotification("Absen dan Suara Berhasil Disubmit", "success");
      setLoadingButton(false);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      showNotification("Proses Gagal", "error");
      setLoadingButton(false);
      console.error(err.response || err);
    }
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

  return (
    <div className="w-full flex  justify-center md:pt-6 pb-10">
      <div className="w-[90%] sm:w-2/4 flex flex-col gap-6">
        {loading ? (
          <HeadingLoad />
        ) : (
          <div className="space-y-3">
            <h1 className="font-bold text-3xl">
              Hasil Pilkada{" "}
              {type === "pilgub" ? "Jabar" : type === "pilkada" ? "KBB" : ""}
            </h1>
            <p className="font-light text-gray-600">
              Silakan Inputkan Hasil Pilkada dari Setiap Tempat Pemungutan Suara
              (TPS) dengan Cermat dan Sesuai Data Asli untuk Memastikan Akurasi
              dalam Penghitungan Suara
            </p>
          </div>
        )}
        {!type && (
          <div className="space-y-6">
            <Menu data={menuData} isFull={true} type="click" />
          </div>
        )}
        {type && (
          <form className="flex flex-col gap-6" onSubmit={handleSuara}>
            <div className="space-y-3">
              <h1 className="font-semibold text-xl">1. Pilih TPS</h1>
              {!myUser?.district ? (
                <>
                  <Dropdown
                    value={dapil}
                    setValue={setDapil}
                    name={"dapil"}
                    label={"Dapil"}
                    options={dapilOptions}
                    isDisabled={tpsId || user}
                    required
                  />
                  <Dropdown
                    value={kecamatan}
                    setValue={setKecamatan}
                    name={"kecamatan"}
                    label={"Kecamatan"}
                    options={kecamatanOptions}
                    isDisabled={!dapil || tpsId || user}
                    required
                  />
                </>
              ) : (
                <>
                  <Label title="Dapil" value={dapil} isAuto={true} />
                  <Label title="Kecamatan" value={kecamatan} isAuto={true} />
                </>
              )}
              <Dropdown
                value={desa}
                setValue={setDesa}
                name={"desa"}
                label={"Desa"}
                options={desaOptions}
                isDisabled={!dapil || !kecamatan || tpsId || user}
                required
              />
              <Dropdown
                value={kodeTPS}
                setValue={setKodeTPS}
                name={"kodeTPS"}
                label={"Kode TPS"}
                options={kodeTPSOptions}
                isDisabled={!kecamatan || !desa || tpsId || user}
                required
              />
            </div>
            {/* <div className="space-y-3">
              <h1 className="font-semibold text-xl">2. Kehadiran</h1>
              <InputImage
                value={absen}
                setValue={setAbsen}
                label={"Foto Kehadiran"}
                required={true}
                isDisabled={!tpsId || !user}
              />
            </div> */}
            <div className="space-y-3">
              <h1 className="font-semibold text-xl">2. Surat Suara</h1>
              <div>
                <Input
                  name={type === "pilgub" ? "suratPilgub" : "suratPilbup"}
                  value={suratSuara}
                  setValue={setSuratSuara}
                  type="number"
                  isDisabled={!tpsId}
                  label={`Pilkada ${type === "pilgub" ? "Jabar" : "KBB"}`}
                  placeholder={`Kertas/Surat Suara Pilkada ${
                    type === "pilgub" ? "Jabar" : "KBB"
                  }`}
                  required
                />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="font-semibold text-xl">3. Hasil Pilkada</h1>
              {paslon.map((item, index) => (
                <div key={item._id} className="w-full flex flex-col gap-3">
                  <Input
                    label={`${item?.panggilan} (Nomor Urut ${item?.noUrut})`}
                    name={`jumlah-${index}`}
                    type="text"
                    isDisabled={!tpsId || !user}
                    setValue={(e) =>
                      handleAddSuara(index, item._id, parseInt(e) || 0)
                    }
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
                isDisabled={!tpsId || !user}
                type="number"
                label="Suara Tidak Sah"
                placeholder="Suara Tidak Sah"
              />
              <InputImage
                value={formulirC1}
                setValue={setFormulirC1}
                label={"Formulir C1 Plano"}
                isDisabled={!tpsId || !user}
                required
              />
            </div>
            {suratSuara && (
              <p>
                ({jumlahSuaraTercatat}/{suratSuara}) Suara
              </p>
            )}
            <Button text={"Kirim"} />
          </form>
        )}
      </div>
    </div>
  );
}
