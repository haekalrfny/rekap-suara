import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import { useStateContext } from "../context/StateContext";
import Cookies from "js-cookie";
import instance from "../api/api";
import Table from "../components/Table";
import Paginate from "../components/Paginate";
import { fetchDesa, fetchKecamatan } from "../functions/fetchData";
import Filters from "../components/Filters";
import ModalDetail from "../components/TPS/ModalDetail";

export default function TPSAll() {
  const { setLoading, loading, setLoadingButton } = useStateContext();
  const [id, setId] = useState(null);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [filters, setFilters] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const openModal = (_id) => {
    setId(_id);
    setShowModal(true);
  };

  const filterConfig = [
    {
      label: "Dapil",
      type: "text",
      key: "dapil",
    },
    {
      label: "Kecamatan",
      type: "text",
      key: "kecamatan",
    },
    {
      label: "Desa",
      type: "text",
      key: "desa",
    },
    {
      label: "Nomor TPS",
      type: "text",
      key: "kodeTPS",
    },
    {
      label: "Pilgub",
      type: "select",
      key: "pilgub",
      options: [
        { value: true, label: "Ya" },
        { value: false, label: "Tidak" },
      ],
    },
    {
      label: "Pilbup",
      type: "select",
      key: "pilbup",
      options: [
        { value: true, label: "Ya" },
        { value: false, label: "Tidak" },
      ],
    },
  ];

  const tableConfig = {
    columns: [
      { label: "Kode TPS", key: "kodeTPS" },
      { label: "Desa", key: "desa" },
      { label: "Kecamatan", key: "kecamatan" },
      { label: "Dapil", key: "dapil" },
      ...Array.from({ length: 5 }, (_, i) => ({
        label: `${i + 1}`,
        key: `pilkadaSuara.suaraPaslon[${i}].suaraSah`,
      })),
      ...Array.from({ length: 4 }, (_, i) => ({
        label: `${i + 1}`,
        key: `pilgubSuara.suaraPaslon[${i}].suaraSah`,
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

  useEffect(() => {
    const getData = () => {
      setLoading(true);
      let config = {
        method: "get",
        url: `/tps/page`,
        params: { page, limit: 12, ...filters },
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
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
          setLoading(false);
          console.log(err);
        })
        .finally(() => setLoading(false));
    };
    getData();
  }, [page, pages, rows, filters]);

  const handlePageClick = ({ selected }) => {
    setPage(selected);
  };

  const downloadPilgub = () => {
    setLoadingButton(true);
    const config = {
      method: "get",
      url: `/tps/excel/paslon/pilgub`,
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      params: { ...filters },
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
  const downloadPilbup = () => {
    setLoadingButton(true);
    const config = {
      method: "get",
      url: `/tps/excel/paslon/pilkada`,
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      params: { ...filters },
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
            <h1 className="font-bold text-3xl">Semua TPS</h1>
            <p className="font-light text-gray-600">
              Data seluruh rekapitulasi suara di Tempat Pemungutan Suara (TPS)
              dari wilayah Kabupaten Bandung Barat
            </p>
            <div className="flex gap-1.5">
              <>
                <Button
                  text={"Filters"}
                  onClick={() => setShowFilters(true)}
                  isFull={false}
                  size={"sm"}
                />
                <Button
                  text={"Download Pilgub"}
                  onClick={downloadPilgub}
                  size={"sm"}
                  isFull={false}
                />
                <Button
                  text={"Download Pilbup"}
                  onClick={downloadPilbup}
                  size={"sm"}
                  isFull={false}
                />
                <Button
                  text={"Kembali"}
                  onClick={() => {}}
                  size={"sm"}
                  outline={true}
                  isFull={false}
                />
              </>
            </div>
          </div>
        </div>
        <div className="w-[90%]">
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-[90%] sm:w-2/4 bg-white p-4 rounded shadow-lg relative z-60">
            <h2 className="font-bold text-xl mb-4">Filters</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newFilters = {};
                filterConfig.forEach(({ key }) => {
                  const value = e.target[key].value.trim();
                  if (value) {
                    newFilters[key] = value;
                  }
                });
                setFilters(newFilters);
                setShowFilters(false);
              }}
            >
              {filterConfig.map(({ label, key, type, options }) => (
                <div key={key} className="mb-3">
                  <label className="block text-sm">{label}</label>
                  {type === "select" ? (
                    <select
                      name={key}
                      className="mt-1 block w-full py-2 px-3 border rounded-md sm:text-sm"
                    >
                      <option value="">Pilih {label}</option>
                      {options.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type}
                      name={key}
                      className="mt-1 block w-full py-2 px-3 border rounded-md sm:text-sm"
                      placeholder={`Cari ${label}...`}
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end gap-2">
                <Button
                  text={"Cancel"}
                  onClick={() => setShowFilters(false)}
                  size="sm"
                  outline={true}
                />
                <Button type="submit" text={"Submit"} size="sm" />
              </div>
            </form>
          </div>
        </div>
      )}
      {showModal && (
        <ModalDetail id={id} onCancel={() => setShowModal(false)} />
      )}
    </>
  );
}
