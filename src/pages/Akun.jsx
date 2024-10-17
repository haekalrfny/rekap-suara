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
  const { token } = useTokenContext();
  const id = Cookies.get("_id");
  const { setLoading, setLoadingButton } = useStateContext();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
        setUsername(res.data.username);
        setName(res.data.name);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const updateUser = () => {
    setLoadingButton(true);
    if (password !== confirmPassword) {
      showNotification("Password dan Konfirmasi Password tidak sama", "error");
      setLoadingButton(false);
      return;
    }

    let data = {
      username,
      name,
      password,
    };

    let config = {
      method: "patch",
      url: `/user/update/${id}`,
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      data,
    };

    instance(config)
      .then((res) => {
        showNotification("Akun terupdate", "success");
        window.alert("Akun terupdate");
        setLoadingButton(false);
      })
      .catch((err) => {
        console.log(err);
        showNotification("Akun gagal diupdate", "error");
        setLoadingButton(false);
      });
  };

  const logout = () => {
    navigate("/");
    Cookies.remove("token");
    Cookies.remove("_id");
    window.location.reload();
  };

  return (
    <div className="w-full flex flex-col items-center md:pt-6 pb-10 gap-6">
      <div className="w-[90%] sm:w-2/4 flex flex-col gap-6">
        <div className="space-y-3">
          <h1 className="font-bold text-3xl">Akun</h1>
          <p className="font-light text-gray-600">
            Akun yang digunakan untuk login
          </p>
        </div>
        <form className="flex flex-col gap-3">
          <h1 className="font-semibold text-xl">Data diri</h1>
          <Input
            value={username}
            setValue={setUsername}
            name="username"
            label={"Username"}
            type={"text"}
            placeholder={"Username"}
          />
          <Input
            value={name}
            setValue={setName}
            name="name"
            label={"Nama Lengkap"}
            type={"text"}
            placeholder={"Nama Lengkap"}
          />
          <Input
            value={password}
            setValue={setPassword}
            name="password"
            label={"Password"}
            type={"password"}
            placeholder={"Password"}
          />
          <Input
            value={confirmPassword}
            setValue={setConfirmPassword}
            name="confirmPassword"
            label={"Confirm Password"}
            type={"password"}
            placeholder={"Confirm Password"}
          />
          <div className="flex flex-col md:flex-row gap-3">
            <Button text={"Ubah"} onClick={updateUser} outline={true} />
            <Button text={"Logout"} onClick={logout} />
          </div>
        </form>
      </div>
    </div>
  );
}
