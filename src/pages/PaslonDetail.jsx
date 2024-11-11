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

export default function PaslonDetail() {
  const { token } = useTokenContext();
  const { setLoading, loading } = useStateContext();
  const { id, type } = useParams();
  const [item, setItem] = useState({});
  const showNotification = useNotif();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});

  const filterConfig = []

  useEffect(() => {
    getDataById();
  }, [id]);

  if (!token && !Cookies.get("token")) {
    showNotification("Anda harus login terlebih dahulu", "error");
    return <Navigate to="/login" />;
  }

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
