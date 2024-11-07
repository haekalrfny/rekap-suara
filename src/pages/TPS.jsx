import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Paginate from "../components/Paginate";
import Search from "../components/Search";
import DesktopTPS from "../components/TPS/DesktopTPS";
import MobileTPS from "../components/TPS/MobileTPS";
import { useTokenContext } from "../context/TokenContext";
import Cookies from "js-cookie";
import instance from "../api/api";
import ModalDetail from "../components/TPS/ModalDetail";
import { useStateContext } from "../context/StateContext";
import HeadingLoad from "../components/Load/HeadingLoad";
import Button from "../components/Button";
import { useNotif } from "../context/NotifContext";
import { fetchUserId } from "../functions/fetchData";

export default function TPS() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState(null);
  const { token } = useTokenContext();
  const { setLoading, loading, setLoadingButton } = useStateContext();
  const showNotification = useNotif();

  if (!token && !Cookies.get("token")) {
    showNotification("Anda harus login terlebih dahulu", "error");
    return <Navigate to="/login" />;
  }

  const handlePageClick = ({ selected }) => {
    setPage(selected);
  };

  useEffect(() => {
    getTPS();
  }, [page, searchQuery, user]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const item = await fetchUserId();
      setUser(item.data);
      setLoading(false);
    };
    getData();
  }, [setLoading]);

  const getTPS = () => {
    setLoading(true);
    let config = {
      method: "get",
      url: `/tps${user?.district ? "/kecamatan" : ""}/page`,
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      params: {
        page,
        filter: searchQuery,
        kecamatan: user?.district,
      },
    };
    instance
      .request(config)
      .then((res) => {
        setData(res.data.result);
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

  const openModal = (_id) => {
    setId(_id);
    setShowModal(true);
  };

  const downloadTPS = () => {
    setLoadingButton(true);
    let config = {
      method: "get",
      url: `/tps/excel/${user?.district ? "kecamatan" : "tps"}`,
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      params: { kecamatan: user?.district },
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
            <Button
              text={"Download TPS"}
              onClick={downloadTPS}
              isFull={false}
              size={"sm"}
            />
            <Search
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setCurrentPage={setPage}
            />
          </div>
        </div>
        <div className="w-full flex flex-col max-w-[90%] gap-3">
          <DesktopTPS data={data} openModal={openModal} />
          <MobileTPS data={data} openModal={openModal} />
          <Paginate
            page={page}
            pages={pages}
            rows={rows}
            handlePageClick={handlePageClick}
            data={data}
          />
        </div>
      </div>
      {showModal && (
        <ModalDetail id={id} onCancel={() => setShowModal(false)} />
      )}
    </>
  );
}
