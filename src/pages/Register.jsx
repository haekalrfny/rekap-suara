import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context/StateContext";
import { useNotif } from "../context/NotifContext";
import instance from "../api/api";
import Input from "../components/Input";
import Button from "../components/Button";
import Cookies from "js-cookie";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setLoadingButton } = useStateContext();
  const navigate = useNavigate();
  const showNotification = useNotif();

  const handleRegister = (e) => {
    e.preventDefault();
    setLoadingButton(true);

    if (!username || !password || !name || !confirmPassword) {
      setLoadingButton(false);
      showNotification("Field harus diisi", "error");
      return false;
    }

    if (password !== confirmPassword) {
      setLoadingButton(false);
      showNotification("Password dan Konfirmasi Password tidak sama", "error");
      return false;
    }

    instance
      .request({
        method: "post",
        url: "/register",
        headers: { "Content-Type": "application/json" },
        data: { name, username, password, role: "user" },
      })
      .then((res) => {
        const { token, _id } = res.data;
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        Cookies.set("token", token, { expires });
        Cookies.set("_id", _id, { expires });
        showNotification("Berhasil Daftar", "success");
        setLoadingButton(false);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      })
      .catch((err) => {
        setLoadingButton(false);
        console.log(err);
      })
      .finally(() => setLoadingButton(false));
  };

  const options = [
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
  ];

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[85%] sm:w-2/4 lg:w-1/4 flex flex-col">
        <div>
          <h1 className="font-semibold text-3xl text-black">Daftar</h1>
          <p className="text-gray-500 font-light text-sm">
            Silahkan masukkan username dan password
          </p>
        </div>
        <form onSubmit={handleRegister} className="w-full mt-6">
          <Input
            value={name}
            setValue={setName}
            name={"nama"}
            label={"Nama"}
            type={"text"}
            placeholder={"Masukkan Nama Lengkap"}
            required={true}
          />
          <Input
            value={username}
            setValue={setUsername}
            name={"username"}
            label={"Username"}
            type={"text"}
            placeholder={"Masukkan Username"}
            required={true}
          />
          <Input
            value={password}
            setValue={setPassword}
            name={"password"}
            label={"Password"}
            type={"password"}
            placeholder={"Masukkan Password"}
            required={true}
          />
          <Input
            value={confirmPassword}
            setValue={setConfirmPassword}
            name={"confirmPassword"}
            label={"Konfirmasi Password"}
            type={"password"}
            placeholder={"Masukkan Konfirmasi Password"}
            required={true}
          />
          <Button text={"Daftar"} onClick={handleRegister} />
        </form>
        <div className="mt-4 text-sm">
          <p>
            Sudah punya akun?{" "}
            <a href="/login" className="underline">
              Masuk
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
