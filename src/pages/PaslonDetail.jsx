import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import instance from "../api/api";
import { useStateContext } from "../context/StateContext";
import Dropdown from "../components/Dropdown";
import { useDatabaseContext } from "../context/DatabaseContext";
import ProgressBar from "../components/ProgressBar";
import Button from "../components/Button";
import { useTokenContext } from "../context/TokenContext";
import BackButton from "../components/BackButton";
import { useNotif } from "../context/NotifContext";

export default function PaslonDetail() {
  const { tpsData } = useDatabaseContext();
  const { token } = useTokenContext();
  const { setLoading, setLoadingButton } = useStateContext();
  const { id } = useParams();
  const [desa, setDesa] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [dapil, setDapil] = useState("");
  const [tps, setTps] = useState("");
  const [item, setItem] = useState({});
  const [data, setData] = useState(null);
  const [totalSuara, setTotalSuara] = useState(0);
  const [totalSaksi, setTotalSaksi] = useState(0);
  const { showNotification } = useNotif();

  useEffect(() => {
    getDataById();
  }, [id]);
  useEffect(() => {
    getSuaraPaslonDetail();
  }, [dapil, tps, kecamatan, desa, id]);
  useEffect(() => {
    getSuaraTotalPaslonDetail();
  }, [id]);

  if (!token && !Cookies.get("token")) {
    showNotification("Anda harus login terlebih dahulu", "error");
    return <Navigate to="/login" />;
  }

  const getDataById = () => {
    setLoading(true);
    instance({
      method: "get",
      url: `/paslon/${id}`,
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    })
      .then((res) => {
        setLoading(false);
        setItem(res.data);
      })
      .catch(() => setLoading(false));
  };

  const getSuaraPaslonDetail = () => {
    setLoading(true);
    instance({
      method: "get",
      url: `/report/daerah`,
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      params: {
        dapil,
        kecamatan,
        desa,
        kodeTPS: tps,
        paslonId: id,
      },
    })
      .then((res) => {
        setLoading(false);
        setData(res.data);
        console.log(res.data);
      })
      .catch(() => setLoading(false));
  };

  const getSuaraTotalPaslonDetail = () => {
    setLoading(true);
    instance({
      method: "get",
      url: `/suara/paslon/${id}`,
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    })
      .then((res) => {
        setLoading(false);
        setTotalSuara(res.data["Total Suara"]);
        setTotalSaksi(res.data["Total Saksi"]);
      })
      .catch(() => setLoading(false));
  };

  const setReset = () => {
    setLoadingButton(true);
    setDesa("");
    setKecamatan("");
    setTps("");
    setTimeout(() => setLoadingButton(false), 200);
  };

  const dapilOptions = [...new Set(tpsData.map((tp) => tp.dapil))]
    .sort((a, b) => a.localeCompare(b))
    .map((dap) => ({ label: dap, value: dap }));

  const kecamatanOptions = [
    ...new Set(
      tpsData.filter((tp) => tp.dapil === dapil).map((tp) => tp.kecamatan)
    ),
  ]
    .sort((a, b) => a.localeCompare(b))
    .map((kec) => ({ label: kec, value: kec }));

  const desaOptions = [
    ...new Set(
      tpsData.filter((tp) => tp.kecamatan === kecamatan).map((tp) => tp.desa)
    ),
  ]
    .sort((a, b) => a.localeCompare(b))
    .map((desa) => ({ label: desa, value: desa }));

  const tpsOptions = tpsData
    .filter((tp) => tp.desa === desa)
    .map((tp) => ({ label: tp.kodeTPS, value: tp.kodeTPS }));

  const bgColor =
    item.noUrut === 1
      ? "bg-orange-100 text-orange-500"
      : item.noUrut === 2
      ? "bg-blue-100 text-blue-500"
      : item.noUrut === 3
      ? "bg-red-100 text-red-500"
      : item.noUrut === 4
      ? "bg-green-100 text-green-500"
      : "bg-gray-100 text-gray-500";

  return (
    <div className="w-full flex flex-col items-center md:pt-6 pb-10 gap-10">
      <div className="w-[90%] sm:w-2/4 flex flex-col gap-6">
        <div className="space-y-3">
          <p
            className={`text-xs py-0.5 px-3 w-max rounded-full ${bgColor} font-semibold`}
          >
            No Urut {item.noUrut}
          </p>
          <h1 className="font-bold text-3xl">
            {item.namaCalonKetua} - {item.namaWakilKetua}
          </h1>
          {item.partai?.length > 0 ? (
            <div className="flex gap-2">
              {item.partai.map((i, idx) => (
                <div key={idx} className="aspect-square w-14">
                  <img
                    src={i.image}
                    alt={i.nama}
                    className="object-contain w-full h-full"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Independen</p>
          )}
        </div>

        <div className="flex gap-6 font-medium text-sm text-gray-600">
          <p>
            {totalSuara} Suara dari {totalSaksi} Saksi
          </p>
        </div>

        {/* <div className="w-full flex flex-col md:flex-row gap-6">
          <div
            className={`w-full ${
              kecamatan ? "md:w-1/2" : "md:w-full"
            } space-y-3`}
          >
            <h1 className="font-semibold text-xl">Daerah</h1>

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
              isDisabled={!dapil}
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
          </div>

          {dapil && (
            <div className="w-full md:w-1/2 space-y-3">
              <h1 className="font-semibold text-xl">Total Inputan</h1>
              <ProgressBar
                text="Kecamatan"
                current={data?.totalKecamatanWithSuara}
                total={data?.totalKecamatan}
              />
              {kecamatan && (
                <ProgressBar
                  text={`Desa`}
                  current={data?.totalDesaWithSuara}
                  total={data?.totalDesa}
                />
              )}
              {desa && (
                <ProgressBar
                  text={"TPS"}
                  current={data?.totalTpsWithSuara}
                  total={data?.totalTPS}
                />
              )}
              {tps && (
                <ProgressBar
                  text={`Suara`}
                  current={data?.totalSuaraSahPerPaslon}
                  total={data?.totalSuaraSahPerSelectedTPS}
                />
              )}
            </div>
          )}
        </div>

        <Button text="Reset" onClick={setReset} outline /> */}
        <BackButton url={"/paslon"} />
      </div>
    </div>
  );
}
