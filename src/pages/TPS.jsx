import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Paginate from "../components/Paginate";
import { useTokenContext } from "../context/TokenContext";
import Cookies from "js-cookie";
import instance from "../api/api";
import ModalDetail from "../components/TPS/ModalDetail";
import { useStateContext } from "../context/StateContext";
import HeadingLoad from "../components/Load/HeadingLoad";
import Button from "../components/Button";
import { useNotif } from "../context/NotifContext";
import { fetchUserId } from "../functions/fetchData";
import Table from "../components/Table";
import Filters from "../components/Filters";

export default function TPS() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [user, setUser] = useState(null);
  const [id, setId] = useState(null);
  const { token } = useTokenContext();
  const { setLoading, loading, setLoadingButton } = useStateContext();
  const showNotification = useNotif();
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const openModal = (_id) => {
    setId(_id);
    setShowModal(true);
  };

  const filterConfig = [
    {
      label: "Nomor TPS",
      type: "text",
      key: "kodeTPS",
    },
    {
      label: "Desa",
      type: "text",
      key: "desa",
    },
    ...(user?.district
      ? []
      : [
          {
            label: "Kecamatan",
            type: "text",
            key: "kecamatan",
          },
          {
            label: "Dapil",
            type: "text",
            key: "dapil",
          },
        ]),
    {
      label: "Pilkada KBB",
      type: "select",
      key: "pilbup",
      options: [
        { value: true, label: "Ya" },
        { value: false, label: "Tidak" },
      ],
    },
    {
      label: "Pilkada Jabar",
      type: "select",
      key: "pilgub",
      options: [
        { value: true, label: "Ya" },
        { value: false, label: "Tidak" },
      ],
    },
  ];

  const tableConfig = {
    columns: [
      { label: "Nomor TPS", key: "kodeTPS" },
      { label: "Desa", key: "desa" },
      { label: "Kecamatan", key: "kecamatan" },
      { label: "Dapil", key: "dapil" },
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

  const downloadTPS = () => {
    setLoadingButton(true);
    let config = {
      method: "get",
      url: `/tps/excel/${user?.district ? "kecamatan" : "tps"}`,
      params: { ...filters },
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
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
        console.log(err);
        setLoadingButton(false);
      });
  };

  return (
    <>
      <div className="w-full flex flex-col items-center md:pt-6 pb-10 gap-6">
        <div className="w-[90%] sm:w-2/4 flex flex-col gap-6">
          <div className="space-y-3">
            {loading ? (
              <HeadingLoad />
            ) : (
              <>
                <h1 className="font-bold text-3xl">
                  TPS {user?.district ? user?.district : ""}
                </h1>
                <p className="font-light text-gray-600">
                  Data rekapitulasi suara di Tempat Pemungutan Suara (TPS) dari{" "}
                  {user?.district ? "Kecamatan " + user?.district : "Semua"}{" "}
                  wilayah Kabupaten Bandung Barat
                </p>
              </>
            )}
            <div className="flex gap-1.5">
              <Button
                text={"Filters"}
                onClick={() => setShowFilters(true)}
                isFull={false}
                size={"sm"}
              />
              <Button
                text={"Download"}
                onClick={downloadTPS}
                isFull={false}
                size={"sm"}
              />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col max-w-[90%] gap-3">
          <Table data={data} config={tableConfig} />
          <Paginate
            page={page}
            pages={pages}
            rows={rows}
            handlePageClick={handlePageClick}
            data={data}
          />
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
      {showModal && (
        <ModalDetail id={id} onCancel={() => setShowModal(false)} />
      )}
    </>
  );
}
