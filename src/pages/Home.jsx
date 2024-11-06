import React, { useEffect, useState, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BsArrowRightShort,
  BsClockHistory,
  BsSend,
  BsPersonCheck,
} from "react-icons/bs";
import { formatDistanceToNow, parseISO, setDefaultOptions } from "date-fns";
import { id } from "date-fns/locale";
import Charts from "../components/Charts";
import Button from "../components/Button";
import SaksiTextLoading from "../components/Load/SaksiTextLoading";
import JumbotronLoading from "../components/Load/JumbotronLoading";
import ChartLoading from "../components/Load/ChartLoading";
import DataPerDaerah from "../components/Report/DataPerDaerah";
import { useDatabaseContext } from "../context/DatabaseContext";
import { useTokenContext } from "../context/TokenContext";
import { useStateContext } from "../context/StateContext";
import Cookies from "js-cookie";
import instance from "../api/api";

setDefaultOptions({ locale: id });

export default function Home() {
  const navigate = useNavigate();
  const { token, admin, user } = useTokenContext();
  const { suaraByPaslon, suaraByDapil } = useDatabaseContext();
  const { loading } = useStateContext();
  const [data, setData] = useState(null);
  const [suaraByPaslonByKecamatan, setSuaraByPaslonByKecamatan] = useState([]);

  const lastUpdated = user?.district
    ? suaraByPaslonByKecamatan[0]?.["Last Updated"]
    : suaraByPaslon[0]?.["Last Updated"];
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

  // useCallback to stabilize setData
  const handleSetData = useCallback((newData) => {
    setData(newData);
  }, []);

  // Effect to fetch data based on user district
  useEffect(() => {
    if (user?.district) {
      setSuaraByPaslonByKecamatan([]); // Reset to avoid mixing data
      instance
        .get("/suara/pilkada/paslon/kecamatan", {
          params: { kecamatan: user.district },
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        })
        .then((res) => setSuaraByPaslonByKecamatan(res.data))
        .catch((err) => console.error("Error fetching data", err));
    }
  }, [user?.district]);

  return (
    <div className="w-full flex flex-col items-center md:pt-6 pb-10">
      <div className="sm:w-2/3 flex flex-col gap-12">
        {loading ? (
          <JumbotronLoading />
        ) : (
          <div className="space-y-6 text-center">
            <h1 className="text-4xl md:text-5xl font-semibold">temanbudi</h1>
            <p className="text-gray-600 font-light">
              "Kepemimpinan bukan soal kekuasaan, tapi soal tanggung jawab.
              Pemimpin yang jujur dan amanah adalah cermin kemajuan rakyatnya."
            </p>
          </div>
        )}
        {!admin && (
          <div className="flex items-center justify-center">
            <img
              src="./people.svg"
              alt="people"
              className="w-[90%] md:w-[350px]"
            />
          </div>
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
                  data={
                    user?.district ? suaraByPaslonByKecamatan : suaraByPaslon
                  }
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
                    data={suaraByDapil}
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
                data?.saksi?.total > 0 && (
                  <p className="text-center font-light mt-4 text-gray-600 max-w-full md:max-w-[90%]">
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
          {token && !admin && (
            <div className="flex flex-col  items-center gap-4 w-full">
              <p className="font-medium text-center">Menu</p>
              <div className="flex flex-col gap-1 w-full md:w-2/3">
                {[
                  { label: "Absen", icon: <BsPersonCheck />, link: "/absen" },
                  {
                    label: "Pilkada",
                    icon: <BsSend />,
                    link: "/suara-pilkada",
                  },
                  { label: "Pilgub", icon: <BsSend />, link: "/suara-pilgub" },
                  {
                    label: "Riwayat",
                    icon: <BsClockHistory />,
                    link: "/riwayat",
                  },
                ].map((button, index) => (
                  <React.Fragment key={index}>
                    <NavLink
                      to={button.link}
                      className="hover:bg-gray-100 py-2 px-3 rounded-md flex items-center justify-between"
                    >
                      <p>{button.label}</p>
                      {button.icon}
                    </NavLink>
                    {index < 3 && <hr />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
