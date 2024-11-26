import React, { useEffect, useState } from "react";
import { useStateContext } from "../context/StateContext";
import { useNotif } from "../context/NotifContext";
import { Navigate } from "react-router-dom";
import { useTokenContext } from "../context/TokenContext";
import Cookies from "js-cookie";
import instance from "../api/api";
import HeadingLoad from "../components/Load/HeadingLoad";
import Filters from "../components/Filters";
import Button from "../components/Button";
import Table from "../components/Table";
import Paginate from "../components/Paginate";
import { fetchUserId } from "../functions/fetchData";

export default function Saksi() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [user, setUser] = useState(null);
  const { setLoading, loading } = useStateContext();
  const { token } = useTokenContext();
  const showNotification = useNotif();
  const [filters, setFilters] = useState({ role: "user" });
  const [showFilters, setShowFilters] = useState(false);

  const filterConfig = [
    ...(filters?.role === "admin"
      ? []
      : [
          {
            label: "Kehadiran",
            type: "select",
            key: "attandance",
            options: [
              { value: true, label: "Ya" },
              { value: false, label: "Tidak" },
            ],
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
                  label: "Role",
                  type: "select",
                  key: "role",
                  options: [
                    { value: "admin", label: "Admin" },
                    { value: "user", label: "User" },
                  ],
                },
              ]),
        ]),
  ];

  const adminConfig = {
    columns: [
      { label: "Username", key: "username" },
      { label: "Role", key: "role" },
    ],
  };

  const saksiConfig = {
    columns: [
      { label: "Nomor TPS", key: "tps.kodeTPS" },
      { label: "Desa", key: "tps.desa" },
      { label: "Kecamatan", key: "tps.kecamatan" },
      { label: "Role", key: "role" },
      {
        label: "Kehadiran",
        key: "attandance",
      },
      { label: "Foto Kehadiran", key: "image" },
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
    const getUsers = () => {
      setLoading(true);
      let config = {
        method: "get",
        url: `/users/page`,
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
    getUsers();
  }, [page, pages, rows, filters]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const item = await fetchUserId();
      setLoading(false);
      if (item.data?.district) {
        setFilters((prevFilters) => ({
          ...prevFilters,
          kecamatan: item.data?.district,
        }));
        setUser(item.data);
      }
    };
    getData();
  }, [setLoading, setFilters]);

  return (
    <>
      <div className="w-full flex flex-col items-center md:pt-6 pb-10 gap-6">
        <div className="w-[90%] sm:w-2/4 flex flex-col gap-6">
          <div className="space-y-3">
            {loading ? (
              <HeadingLoad />
            ) : (
              <>
                <h1 className="font-bold text-3xl">Users</h1>
                <p className="font-light text-gray-600">
                  Menampilkan database saksi dan admin
                </p>
              </>
            )}
          </div>
          <div className="flex gap-1.5">
            <Button
              text={"Filters"}
              onClick={() => setShowFilters(true)}
              isFull={false}
              size={"sm"}
              outline={false}
            />
          </div>
        </div>
        <div className="w-full flex flex-col max-w-[90%] gap-3">
          <Table
            data={data}
            config={filters?.role === "admin" ? adminConfig : saksiConfig}
          />
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
    </>
  );
}
