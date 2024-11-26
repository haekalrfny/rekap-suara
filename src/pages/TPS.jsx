import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { fetchUserId, fetchKecamatan, fetchDesa } from "../functions/fetchData";
import { useStateContext } from "../context/StateContext";
import { useTokenContext } from "../context/TokenContext";
import { useNotif } from "../context/NotifContext";
import BackButton from "../components/BackButton";
import Paginate from "../components/Paginate";
import Cookies from "js-cookie";
import instance from "../api/api";
import ModalDetail from "../components/TPS/ModalDetail";
import Button from "../components/Button";
import Table from "../components/Table";
import Filters from "../components/Filters";
import Menu from "../components/Menu";
import Dropdown from "../components/Dropdown";

export default function TPS() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [user, setUser] = useState(null);
  const [id, setId] = useState(null);
  const { token } = useTokenContext();
  const { setLoading, setLoadingButton } = useStateContext();
  const showNotification = useNotif();
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [type, setType] = useState("");
  const [localType, setLocalType] = useState("");
  const [kecamatan, setKecamatan] = useState([]);
  const [desa, setDesa] = useState([]);

  const openModal = (_id) => {
    setId(_id);
    setShowModal(true);
  };

  const filterConfig = [
    ...(user?.district
      ? []
      : [
          {
            label: "Kecamatan",
            type: "array",
            key: "kecamatan",
            options: kecamatan,
          },
        ]),
    {
      label: "Desa",
      type: "array",
      key: "desa",
      options: desa,
      disabled: filters.kecamatan ? false : true,
    },
  ];

  const paslonCount = type === "pilgub" ? 4 : 5;

  const tableConfig = {
    columns: [
      { label: "Nomor TPS", key: "kodeTPS" },
      ...Array.from({ length: paslonCount }, (_, i) => ({
        label: `${i + 1}`,
        key: `${
          type === "pilgub" ? "pilgubSuara" : "pilkadaSuara"
        }.suaraPaslon[${i}].suaraSah`,
      })),
      {
        label: "Aksi",
        key: "Detail",
        type: "action",
        actions: openModal,
        primary: "_id",
      },
    ],
  };

  if (!token && !Cookies.get("token")) {
    showNotification("Anda harus login terlebih dahulu", "error");
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const getData = async () => {
      const kecamatan = await fetchKecamatan();
      const desa = await fetchDesa(
        null,
        user?.district ? user.district : filters.kecamatan
      );
      setDesa(desa);
      setKecamatan(kecamatan);
    };
    getData();
  }, [setLoading, filters]);

  const handlePageClick = ({ selected }) => {
    setPage(selected);
  };

  useEffect(() => {
    const getTPS = () => {
      setLoading(true);
      let config = {
        method: "get",
        url: `/tps/page`,
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        params: {
          page,
          limit: 12,
          ...filters,
        },
      };
      instance
        .request(config)
        .then((res) => {
          setData(res.data.results);
          setPage(res.data.page);
          setPages(res.data.totalPage);
          setRows(res.data.totalRows);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        })
        .finally(() => setLoading(false));
    };
    getTPS();
  }, [page, pages, rows, filters]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const item = await fetchUserId();
      setUser(item.data);
      setLoading(false);
      if (item.data?.district) {
        setFilters((prevFilters) => ({
          ...prevFilters,
          kecamatan: item.data.district,
        }));
      }
    };
    getData();
  }, [setLoading]);

  const menuData = [
    user?.username === "BUPATI"
      ? {}
      : {
          label: "Pilkada Jabar",
          link: () => handleSelectType("pilgub"),
        },
    {
      label: "Pilkada KBB",
      link: () => handleSelectType("pilkada"),
    },
  ];

  const typeOptions = [
    {
      label: "Pilgub",
      value: "pilgub",
    },
    {
      label: "Pilbup",
      value: "pilkada",
    },
  ];

  const handleSelectType = (i) => {
    setLocalType(i);
    setShowFilters(true);
  };

  const handleSelect = () => {
    if (!filters.kecamatan) {
      showNotification("Pilih Kecamatan terlebih dahulu", "error");
      return;
    } else if (!filters.desa) {
      showNotification("Pilih Desa terlebih dahulu", "error");
      return;
    } else {
      setType(localType);
      setShowFilters(false);
    }
  };

  const downloadPaslonByTPS = () => {
    setLoadingButton(true);
    const config = {
      method: "get",
      url: `/tps/excel/paslon${user?.district ? "/kecamatan" : ""}/${type}`,
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      params: { kecamatan: user?.district || "", ...filters },
      responseType: "blob",
    };

    instance
      .request(config)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "TPS.xlsx");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        setLoadingButton(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingButton(false);
      });
  };

  return (
    <>
      <div className="w-full flex flex-col items-center md:pt-6 pb-10 gap-3">
        <div className="w-[90%] sm:w-2/4 flex flex-col ">
          <div className="space-y-3">
            <h1 className="font-bold text-3xl">
              TPS {user?.district ? user?.district : ""}
            </h1>
            <p className="font-light text-gray-600">
              Data rekapitulasi suara di Tempat Pemungutan Suara (TPS) dari{" "}
              {user?.district ? "Kecamatan " + user?.district : "Semua"} wilayah
              Kabupaten Bandung Barat
            </p>
            <div className="flex gap-1.5">
              {type && (
                <>
                  <Button
                    text={"Download"}
                    onClick={downloadPaslonByTPS}
                    isFull={false}
                    size={"sm"}
                  />
                  <Button
                    text={"Kembali"}
                    onClick={() => window.location.reload()}
                    size={"sm"}
                    outline={true}
                    isFull={false}
                  />
                </>
              )}
            </div>
          </div>
          {!type && <Menu data={menuData} isFull={true} type="click" />}
        </div>
        {type && (
          <div className=" flex flex-col w-[90%]  gap-3">
            <div className="flex justify-between items-end">
              <div className="w-max md:w-1/3">
                <Dropdown
                  value={type}
                  setValue={setType}
                  name={"tipe"}
                  label={"Pilih Tipe"}
                  options={typeOptions}
                />
              </div>
              <div className="flex flex-col text-right">
                <h1 className="font-semibold text-lg">
                  {user?.district ? user?.district : filters.kecamatan}
                </h1>
                <p className="text-gray-500 font-light">{filters.desa}</p>
              </div>
            </div>
            <Table data={data} config={tableConfig} />
            <Paginate
              page={page}
              pages={pages}
              rows={rows}
              handlePageClick={handlePageClick}
              data={data}
            />
          </div>
        )}
      </div>

      {showFilters && (
        <Filters
          filters={filters}
          setFilters={setFilters}
          filterConfig={filterConfig}
          setShowModal={setShowFilters}
          title={`${user?.district ? "Desa" : "Kecamatan & Desa"}`}
          button="Pilih"
          simple={true}
          handleSelect={handleSelect}
        />
      )}
      {showModal && (
        <ModalDetail id={id} onCancel={() => setShowModal(false)} />
      )}
    </>
  );
}
