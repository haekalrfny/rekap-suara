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

export default function TPS() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState(null);
  const { token } = useTokenContext();
  const { setLoading, loading } = useStateContext();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const handlePageClick = ({ selected }) => {
    setPage(selected);
  };

  useEffect(() => {
    getTPS();
  }, [page, searchQuery]);

  const getTPS = () => {
    setLoading(true);
    let config = {
      method: "get",
      url: "/tps/page",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      params: { page, filter: searchQuery },
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

  return (
    <>
      <div className="w-full flex flex-col items-center md:pt-6 pb-10 gap-6">
        <div className="w-[90%] sm:w-2/4 flex flex-col gap-6">
          <div className="space-y-3">
            {loading ? (
              <HeadingLoad />
            ) : (
              <>
                <h1 className="font-bold text-3xl">TPS</h1>
                <p className="font-light text-gray-600">
                  Data rekapitulasi suara di Tempat Pemungutan Suara (TPS) dari
                  seluruh wilayah Kabupaten Bandung Barat
                </p>
              </>
            )}

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
