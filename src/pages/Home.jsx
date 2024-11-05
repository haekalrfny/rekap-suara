import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const lastUpdated = user?.kecamatan
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
      outline={!admin}
    />
  );

  useEffect(() => {
    instance
      .get("/suara/byPaslon/kecamatan", {
        params: { kecamatan: user?.kecamatan },
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      })
      .then((res) => setSuaraByPaslonByKecamatan(res.data));
  }, [user]);

  return (
    <div className="w-full flex flex-col items-center md:pt-6 pb-10">
      <div className="w-[90%] sm:w-2/3 flex flex-col gap-6">
        {loading ? (
          <JumbotronLoading />
        ) : (
          <div className="space-y-6 text-center">
            <h1 className="text-5xl md:text-6xl font-semibold">hijisora</h1>
            <p className="text-gray-600 font-light">
              Kepemimpinan bukan soal kekuasaan, tapi soal tanggung jawab.
              Pemimpin yang jujur dan amanah adalah cermin kemajuan rakyatnya.
            </p>
          </div>
        )}
        {!admin && (
          <div className="flex items-center justify-center">
            <img
              src="./people.svg"
              alt="people"
              className="w-full  md:w-[350px]"
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
              <div className="flex flex-col lg:flex-row justify-between gap-4 mt-8">
                <Charts
                  title={`Suara Paslon ${user?.kecamatan || "Seluruh"}`}
                  subtitle="Total suara paslon yang Telah Diterima"
                  data={
                    user?.kecamatan ? suaraByPaslonByKecamatan : suaraByPaslon
                  }
                  name="Panggilan"
                  value="Total Suara"
                  type="bar"
                />
                {user?.kecamatan ? (
                  loading ? (
                    <ChartLoading />
                  ) : (
                    <DataPerDaerah setValue={setData} />
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
              {!user?.kecamatan && !loading && (
                <DataPerDaerah setValue={setData} />
              )}
              {loading ? (
                <SaksiTextLoading />
              ) : (
                data?.totalSaksi > 0 && (
                  <p className="text-center font-light mt-4 text-gray-600 max-w-[90%]">
                    <b className="text-black">
                      {data?.totalSaksiWithSuara} dari {data?.totalSaksi}
                    </b>{" "}
                    saksi telah menginput suara{" "}
                    <b className="text-black">{formattedLastUpdated}</b>
                  </p>
                )
              )}
            </>
          )}
          {token && !admin && (
            <div className="flex flex-col gap-4 w-full">
              <p className="font-medium">Menu</p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                {renderButton(
                  <div className="flex justify-between w-full items-center">
                    <p>Absen</p>
                    <BsPersonCheck />
                  </div>,
                  () => navigate("/absen"),
                  true
                )}
                {renderButton(
                  <div className="flex justify-between w-full items-center">
                    <p>Kirim Suara</p>
                    <BsSend className="ml-2" />
                  </div>,
                  () => navigate("/kirim-suara"),
                  true
                )}
                {renderButton(
                  <div className="flex justify-between w-full items-center">
                    <p>Riwayat</p>
                    <BsClockHistory className="ml-2" />
                  </div>,
                  () => navigate("/riwayat"),
                  true
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
