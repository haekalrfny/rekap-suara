import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { HiOutlineExternalLink } from "react-icons/hi";
import instance from "../api/api";
import { useStateContext } from "../context/StateContext";
import Button from "../components/Button";
import { useTokenContext } from "../context/TokenContext";
import { useNotif } from "../context/NotifContext";
import Image from "../components/Image";
import { fetchUserId } from "../functions/fetchData";
import Loading from "../components/Loading";

export default function Akun() {
  const { token, admin } = useTokenContext();
  const [user, setUser] = useState(null);
  const { setLoading, loading } = useStateContext();
  const [showImage, setShowImage] = useState(false);
  const showNotification = useNotif();
  const navigate = useNavigate();

  if (!token && !Cookies.get("token")) {
    showNotification("Anda harus login terlebih dahulu", "error");
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const data = await fetchUserId();
      setUser(data.data);
      setLoading(false);
    };
    getData();
  }, [setLoading]);

  const logout = () => {
    showNotification("Logout Berhasil", "success");
    navigate("/");
    setTimeout(() => {
      Cookies.remove("token");
      Cookies.remove("_id");
      Cookies.remove("username");
      window.location.reload();
    }, 500);
  };

  return (
    <>
      <div className="w-full flex flex-col items-center md:pt-6 pb-10 gap-6">
        <div className="w-[90%] sm:w-2/4 flex flex-col gap-6">
          <div className="space-y-3">
            <h1 className="font-bold text-3xl">Akun</h1>
            <p className="font-light text-gray-600">
              Akun yang Sedang Digunakan Saat Ini
            </p>
          </div>
          <form className="flex flex-col gap-3">
            <div>
              <h1 className="font-semibold text-xl">Profile</h1>
            </div>
            {loading ? (
              <Loading />
            ) : (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Username</p>
                  <p className="font-light text-gray-500">{user?.username}</p>
                </div>
                {!admin && (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Keterangan</p>
                      <p className="font-light text-gray-500 flex items-center gap-1">
                        {user?.attandance ? "Hadir" : "Tidak Hadir"}
                        {user?.attandance && user?.image && (
                          <div
                            onClick={() => setShowImage(true)}
                            className="p-0.5 rounded-md cursor-pointer hover:bg-gray-100"
                          >
                            <HiOutlineExternalLink />
                          </div>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Dapil</p>
                      <p className="font-light text-gray-500">
                        {user?.tps?.dapil}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Kecamatan</p>
                      <p className="font-light text-gray-500">
                        {user?.tps?.kecamatan}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Desa</p>
                      <p className="font-light text-gray-500">
                        {user?.tps?.desa}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">TPS</p>
                      <p className="font-light text-gray-500">
                        TPS {user?.tps?.kodeTPS}
                      </p>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between">
                  <p className="font-medium">Role</p>
                  <p
                    className={`py-0.5 px-3 font-medium text-sm rounded-xl ${
                      user?.role === "admin"
                        ? "bg-red-100 text-red-500"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {user?.role === "user" ? "Saksi" : "Admin"}
                  </p>
                </div>
                <Button text={"Keluar"} onClick={logout} />
              </div>
            )}
          </form>
        </div>
      </div>
      {showImage && (
        <Image url={user?.image} onCancel={() => setShowImage(false)} />
      )}
    </>
  );
}
