import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Input from "../components/Input";
import instance from "../api/api";
import { useStateContext } from "../context/StateContext";
import Button from "../components/Button";
import { useTokenContext } from "../context/TokenContext";
import { useNotif } from "../context/NotifContext";

export default function Akun() {
  const { token, admin } = useTokenContext();
  const id = Cookies.get("_id");
  const { setLoading } = useStateContext();
  const [data, setData] = useState(null);
  const showNotification = useNotif();
  const navigate = useNavigate();

  if (!token && !Cookies.get("token")) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    getDataById();
  }, [id]);

  const getDataById = () => {
    setLoading(true);
    let config = {
      method: "get",
      url: `/user/${id}`,
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    };

    instance(config)
      .then((res) => {
        setLoading(false);
        setData(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const logout = () => {
    showNotification("Logout Berhasil", "success");
    navigate("/");
    setTimeout(() => {
      Cookies.remove("token");
      Cookies.remove("_id");
      window.location.reload();
    }, 500);
  };

  return (
    <div className="w-full flex flex-col items-center md:pt-6 pb-10 gap-6">
      <div className="w-[90%] sm:w-2/4 flex flex-col gap-6">
        <div className="space-y-3">
          <h1 className="font-bold text-3xl">Akun</h1>
          <p className="font-light text-gray-600">Akun yang anda gunakan</p>
        </div>
        <form className="flex flex-col gap-3">
          <div>
            <h1 className="font-semibold text-xl">Akun anda</h1>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <p className="font-medium">Username</p>
              <p className="font-light text-gray-500">{data?.username}</p>
            </div>
            {!admin && (
              <>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Dapil</p>
                  <p className="font-light text-gray-500">{data?.dapil}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Kecamatan</p>
                  <p className="font-light text-gray-500">{data?.kecamatan}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Desa</p>
                  <p className="font-light text-gray-500">{data?.desa}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">TPS</p>
                  <p className="font-light text-gray-500">
                    TPS {data?.kodeTPS}
                  </p>
                </div>
              </>
            )}
            <div className="flex items-center justify-between">
              <p className="font-medium">Role</p>
              <p
                className={`py-0.5 px-3 font-medium text-sm rounded-xl ${
                  data?.role === "admin"
                    ? "bg-red-100 text-red-500"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {data?.role === "user" ? "Saksi" : "Admin"}
              </p>
            </div>
            <Button text={"Keluar"} onClick={logout} />
          </div>
        </form>
      </div>
    </div>
  );
}
