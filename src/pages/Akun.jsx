import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FaExternalLinkAlt } from "react-icons/fa";
import { HiOutlineExternalLink } from "react-icons/hi";
import instance from "../api/api";
import { useStateContext } from "../context/StateContext";
import Button from "../components/Button";
import { useTokenContext } from "../context/TokenContext";
import { useNotif } from "../context/NotifContext";
import Image from "../components/Image";

export default function Akun() {
  const { token, admin, user } = useTokenContext();
  const [showImage, setShowImage] = useState(false);
  const showNotification = useNotif();
  const navigate = useNavigate();

  if (!token && !Cookies.get("token")) {
    showNotification("Anda harus login terlebih dahulu", "error");
    return <Navigate to="/login" />;
  }
  
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
                      {user?.isAttending ? "Hadir" : "Tidak Hadir"}
                      {user?.isAttending && user?.attendanceImage && (
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
                    <p className="font-light text-gray-500">{user?.dapil}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Kecamatan</p>
                    <p className="font-light text-gray-500">
                      {user?.kecamatan}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Desa</p>
                    <p className="font-light text-gray-500">{user?.desa}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">TPS</p>
                    <p className="font-light text-gray-500">
                      TPS {user?.kodeTPS}
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
          </form>
        </div>
      </div>
      {showImage && (
        <Image
          url={user?.attendanceImage}
          onCancel={() => setShowImage(false)}
        />
      )}
    </>
  );
}
