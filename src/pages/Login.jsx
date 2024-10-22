import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useStateContext } from "../context/StateContext";
import { useNotif } from "../context/NotifContext";
import instance from "../api/api";
import Input from "../components/Input";
import Button from "../components/Button";
import Cookies from "js-cookie";
import { useTokenContext } from "../context/TokenContext";

export default function Login() {
  const { token } = useTokenContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setLoadingButton } = useStateContext();
  const navigate = useNavigate();
  const showNotification = useNotif();

  if (Cookies.get("token") && token) {
    return <Navigate to="/" />;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    setLoadingButton(true);

    if (!username || !password) {
      setLoadingButton(false);
      showNotification("Username dan Password harus diisi", "error");
      return false;
    }

    instance
      .request({
        method: "post",
        url: "/login",
        headers: { "Content-Type": "application/json" },
        data: { username, password },
      })
      .then((res) => {
        const { token, user } = res.data;
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        Cookies.set("token", token, { expires });
        Cookies.set("_id", user._id, { expires });
        Cookies.set("username", user.username, { expires });
        showNotification("Berhasil Masuk", "success");
        setLoadingButton(false);
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        setLoadingButton(false);
        showNotification("Gagal Login", "error");
        console.log(err);
      })
      .finally(() => setLoadingButton(false));
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[85%] sm:w-2/4 lg:w-1/4 flex flex-col">
        <div>
          <h1 className="font-semibold text-3xl text-black">Masuk</h1>
          <p className="text-gray-500 font-light text-sm">
            Masukkan Informasi Anda untuk Melanjutkan
          </p>
        </div>
        <form onSubmit={handleLogin} className="w-full mt-6">
          <Input
            value={username}
            setValue={setUsername}
            name={"username"}
            label={"Username"}
            type={"text"}
            placeholder={"Masukkan Username"}
          />
          <Input
            value={password}
            setValue={setPassword}
            name={"password"}
            label={"Password"}
            type={"password"}
            placeholder={"Masukkan Password"}
          />

          <Button text={"Masuk"} onClick={handleLogin} />
        </form>
      </div>
    </div>
  );
}
