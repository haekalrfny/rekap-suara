import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import instance from "../api/api";
import { useStateContext } from "../context/StateContext";
import { useTokenContext } from "../context/TokenContext";
import BackButton from "../components/BackButton";
import { useNotif } from "../context/NotifContext";
import HeadingLoad from "../components/Load/HeadingLoad";
import Button from "../components/Button";
import Filters from "../components/Filters";
import {
  fetchDapil,
  fetchKecamatan,
  fetchDesa,
  fetchKodeTPS,
} from "../functions/fetchData";
import Loading from "../components/Loading";

export default function PaslonDetail() {
  const { token } = useTokenContext();
  const { setLoading, loading } = useStateContext();
  const { id, type } = useParams();
  const [item, setItem] = useState({});
  const [suara, setSuara] = useState(null);
  const [dapil, setDapil] = useState([]);
  const [kecamatan, setKecamatan] = useState([]);
  const [desa, setDesa] = useState([]);
  const [kodeTPS, setKodeTPS] = useState([]);
  const showNotification = useNotif();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});

  const filterConfig = [
    {
      label: "Dapil",
      type: "array",
      key: "dapil",
      options: dapil,
    },
    {
      label: "Kecamatan",
      type: "array",
      key: "kecamatan",
      options: kecamatan,
      disabled: filters.dapil ? false : true,
    },
    {
      label: "Desa",
      type: "array",
      key: "desa",
      options: desa,
      disabled: filters.dapil && filters.kecamatan ? false : true,
    },
    {
      label: "Kode TPS",
      type: "array",
      key: "kodeTPS",
      options: kodeTPS,
      disabled:
        filters.dapil && filters.kecamatan && filters.desa ? false : true,
    },
  ];

  if (!token && !Cookies.get("token")) {
    showNotification("Anda harus login terlebih dahulu", "error");
    return <Navigate to="/login" />;
  }

  const getColorClass = (noUrut, type) => {
    const colors = {
      1:
        type === "pilkada"
          ? "bg-orange-100 text-orange-500"
          : "bg-green-100 text-green-500",
      2:
        type === "pilkada"
          ? "bg-blue-100 text-blue-500"
          : "bg-red-100 text-red-500",
      3:
        type === "pilkada"
          ? "bg-red-100 text-red-500"
          : "bg-blue-100 text-blue-500",
      4:
        type === "pilkada"
          ? "bg-green-100 text-green-500"
          : "bg-yellow-100 text-yellow-500",
    };
    return colors[noUrut] || "bg-gray-100 text-gray-500";
  };

  useEffect(() => {
    const getDataById = () => {
      setLoading(true);
      instance({
        method: "get",
        url: `/paslon/${type}/${id}`,
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      })
        .then((res) => {
          setLoading(false);
          setItem(res.data);
        })
        .catch(() => setLoading(false));
    };
    getDataById();
  }, [id, type]);

  useEffect(() => {
    const getSuaraByPaslon = () => {
      setLoading(true);
      instance({
        method: "get",
        url: `/suara/${type}/paslon/detail/${id}`,
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        params: { ...filters },
      })
        .then((res) => {
          setLoading(false);
          setSuara(res.data);
        })
        .catch(() => setLoading(false));
    };
    getSuaraByPaslon();
  }, [id, type, filters]);

  useEffect(() => {
    const getData = async () => {
      const dapil = await fetchDapil();
      const kecamatan = await fetchKecamatan(filters.dapil);
      const desa = await fetchDesa(filters.dapil, filters.kecamatan);
      const kodeTPS = await fetchKodeTPS(
        filters.dapil,
        filters.kecamatan,
        filters.desa
      );
      setDapil(dapil);
      setKecamatan(kecamatan);
      setDesa(desa);
      setKodeTPS(kodeTPS);
    };
    getData();
  }, [setLoading, filters]);

  return (
    <>
      <div className="w-full flex flex-col items-center md:pt-6 pb-10 gap-10">
        <div className="w-[90%] sm:w-2/4 flex flex-col gap-6">
          {loading ? (
            <HeadingLoad />
          ) : (
            <div className="space-y-3">
              <p
                className={`text-xs py-0.5 px-3 w-max rounded-full ${getColorClass(
                  item.noUrut,
                  type
                )} font-semibold`}
              >
                No Urut {item.noUrut}
              </p>
              <h1 className="font-bold text-3xl">
                {item.ketua} - {item.wakilKetua}
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
          )}
          <div className="w-max">
            <Button
              text={"Filters"}
              onClick={() => setShowFilters(true)}
              size={"sm"}
            />
          </div>
          {!suara ? (
            <p>belum ada suara</p>
          ) : (
            <div className="space-y-1.5">
              {filters.dapil && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Dapil</span>
                    <span className="text-gray-600">{filters?.dapil}</span>
                  </div>
                </>
              )}
              {filters.kecamatan && (
                <>
                  <hr />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Kecamatan</span>
                    <span className="text-gray-600">{filters?.kecamatan}</span>
                  </div>
                </>
              )}
              {filters.desa && (
                <>
                  <hr />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Desa</span>
                    <span className="text-gray-600">{filters?.desa}</span>
                  </div>
                </>
              )}
              {filters.kodeTPS && (
                <>
                  <hr />
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Nomor TPS</span>
                    <span className="text-gray-600">{filters?.kodeTPS}</span>
                  </div>
                </>
              )}

              <>
                {filters.dapil && <hr />}
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  {loading ? (
                    <span>
                      <Loading />
                    </span>
                  ) : (
                    <span className="text-gray-600">{suara?.total} Suara</span>
                  )}
                </div>
              </>
            </div>
          )}
          <BackButton url={"/paslon"} />
        </div>
      </div>
      {showFilters && (
        <Filters
          filters={filters}
          setFilters={setFilters}
          filterConfig={filterConfig}
          setShowModal={setShowFilters}
        />
      )}
    </>
  );
}
