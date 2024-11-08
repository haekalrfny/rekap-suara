import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { BsArrowRightShort, BsSendFill } from "react-icons/bs";
import { FaUserCheck } from "react-icons/fa6";
import { LuScroll, LuHistory } from "react-icons/lu";
import { formatDistanceToNow, parseISO, setDefaultOptions } from "date-fns";
import { id } from "date-fns/locale";
import Charts from "../components/Charts";
import Button from "../components/Button";
import SaksiTextLoading from "../components/Load/SaksiTextLoading";
import JumbotronLoading from "../components/Load/JumbotronLoading";
import ChartLoading from "../components/Load/ChartLoading";
import DataPerDaerah from "../components/Report/DataPerDaerah";
import { useTokenContext } from "../context/TokenContext";
import { useStateContext } from "../context/StateContext";
import {
  fetchSuaraByPaslon,
  fetchSuaraByDapil,
  fetchUserId,
} from "../functions/fetchData";
import Cookies from "js-cookie";
import instance from "../api/api";
import Menu from "../components/Menu";
import Loading from "../components/Loading";

setDefaultOptions({ locale: id });

export default function Home() {
  const navigate = useNavigate();
  const { token, admin } = useTokenContext();
  const { loading, setLoading } = useStateContext();
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [suaraPaslon, setSuaraPaslon] = useState([]);
  const [suaraDapil, setSuaraDapil] = useState([]);
  const [suaraByPaslonByKecamatan, setSuaraByPaslonByKecamatan] = useState([]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const paslon = await fetchSuaraByPaslon();
      setSuaraPaslon(paslon);
      setLoading(false);
    };
    getData();
  }, [setLoading]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const dapil = await fetchSuaraByDapil();
      setSuaraDapil(dapil);
      setLoading(false);
    };
    getData();
  }, [setLoading]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const item = await fetchUserId();
      setUser(item.data);
      setLoading(false);
    };
    getData();
  }, [setLoading]);

  const lastUpdated = user?.district
    ? suaraByPaslonByKecamatan[0]?.["Last Updated"]
    : suaraPaslon[0]?.["Last Updated"];
  const formattedLastUpdated = lastUpdated
    ? formatDistanceToNow(parseISO(lastUpdated), { addSuffix: true })
    : "Belum ada data";

  const renderButton = (text, onClick, isFull = false) => (
    <Button
      text={<div className="flex items-center gap-1">{text}</div>}
      onClick={onClick}
      isFull={isFull}
      outline
    />
  );

  const handleSetData = useCallback((newData) => {
    setData(newData);
  }, []);

  useEffect(() => {
    if (user?.district) {
      setSuaraByPaslonByKecamatan([]);
      instance
        .get("/suara/pilkada/paslon/kecamatan", {
          params: { kecamatan: user.district },
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        })
        .then((res) => setSuaraByPaslonByKecamatan(res.data))
        .catch((err) => console.error("Error fetching data", err));
    }
  }, [user?.district]);

  const menuData = [
    { label: "Absensi", icon: <FaUserCheck />, link: "/absen" },
    {
      label: "Surat Suara",
      icon: <LuScroll />,
      link: "/kertas-suara",
    },
    {
      label: "Suara Pilkada",
      icon: <BsSendFill />,
      link: "/kirim-suara",
    },
    {
      label: "Riwayat",
      icon: <LuHistory />,
      link: "/riwayat",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center py-10">
      <div className="w-[90%] sm:w-2/3 flex flex-col gap-12">
        {loading ? (
          <JumbotronLoading />
        ) : (
          <div className="space-y-6 text-center ">
            <h1 className="text-4xl md:text-5xl font-semibold">temanbudi</h1>
            <p className="text-gray-600 font-light ">
              "Kepemimpinan bukan soal kekuasaan, tapi soal tanggung jawab.
              Pemimpin yang jujur dan amanah adalah cermin kemajuan rakyatnya."
            </p>
          </div>
        )}
        {loading ? (
          <div className="w-full h-64">
            <Loading />
          </div>
        ) : (
          !admin && (
            <div className="flex items-center justify-center">
              <img
                src="./people.svg"
                alt="people"
                className="w-[90%] md:w-[350px]"
              />
            </div>
          )
        )}
        <div className="flex flex-col justify-center items-center gap-10">
          {!token &&
            renderButton(
              <>
                <p>Masuk</p>
                <BsArrowRightShort className="ml-2 text-xl" />
              </>,
              () => navigate("/login")
            )}
          {admin && (
            <>
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <Charts
                  title={`Suara Paslon ${user?.district || "Seluruh"}`}
                  subtitle="Total suara paslon yang Telah Diterima"
                  data={user?.district ? suaraByPaslonByKecamatan : suaraPaslon}
                  name="Panggilan"
                  value="Total Suara"
                  type="bar"
                />
                {user?.district ? (
                  loading ? (
                    <ChartLoading />
                  ) : (
                    <DataPerDaerah setValue={handleSetData} />
                  )
                ) : (
                  <Charts
                    title="Suara Tiap Dapil"
                    subtitle="Total suara tiap dapil"
                    data={suaraDapil}
                    name="dapil"
                    value="suara"
                    type="pie"
                  />
                )}
              </div>
              {!user?.district && !loading && (
                <div className="w-full md:w-2/3">
                  <DataPerDaerah setValue={handleSetData} />
                </div>
              )}
              {loading ? (
                <SaksiTextLoading />
              ) : (
                !user?.district && (
                  <p className="text-center font-light mt-4 text-gray-600 max-w-[90%]">
                    <b className="text-black">
                      {data?.saksi?.withSuara?.pilkada} dari{" "}
                      {data?.saksi?.total}
                    </b>{" "}
                    saksi telah menginput suara{" "}
                    <b className="text-black">{formattedLastUpdated}</b>
                  </p>
                )
              )}
            </>
          )}
          {token && !admin && <Menu data={menuData} />}
        </div>
      </div>
    </div>
  );
}
