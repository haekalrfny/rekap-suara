import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context/StateContext";
import { useNotif } from "../context/NotifContext";
import instance from "../api/api";
import Input from "../components/Input";
import Button from "../components/Button";
import Cookies from "js-cookie";
import Dropdown from "../components/Dropdown";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setLoadingButton } = useStateContext();
  const navigate = useNavigate();
  const showNotification = useNotif();

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [pin, setPin] = useState("");
  const correctPin = "akdwaldmgnoe1p140dadxqppfg";

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const handlePinSubmit = () => {
    if (pin === correctPin) {
      setIsModalOpen(false);
      showNotification("PIN benar", "success");
    } else {
      showNotification("PIN salah, coba lagi", "error");
    }
  };

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
        data: { name, username, password, role },
      })
      .then((res) => {
        const { token, user } = res.data;
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        Cookies.set("token", token, { expires });
        Cookies.set("_id", user._id, { expires });
        Cookies.set("username", user.username, { expires });
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

  

  return (
    <div className="w-full h-screen flex justify-center items-center">
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-[85%] sm:w-1/2 md:w-2/4 lg:w-1/4">
            <h2 className="text-2xl font-semibold mb-4">Masukkan PIN</h2>
            <Input
              value={pin}
              setValue={setPin}
              name={"pin"}
              label={"PIN"}
              type={"password"}
              placeholder={"Masukkan PIN untuk akses"}
              required={true}
            />
            <Button text={"Submit"} onClick={handlePinSubmit} />
          </div>
        </div>
      )}

      {!isModalOpen && (
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
            <Dropdown
              value={role}
              setValue={setRole}
              name={"role"}
              label={"Role"}
              options={[
                { value: "user", label: "Saksi" },
                { value: "admin", label: "Admin" },
              ]}
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
      )}
    </div>
  );
}
