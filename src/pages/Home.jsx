import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Charts from "../components/Charts";
import { useDatabaseContext } from "../context/DatabaseContext";
import { useTokenContext } from "../context/TokenContext";
import {
  BsArrowRightShort,
  BsClockHistory,
  BsSend,
  BsPersonCheck,
} from "react-icons/bs";
import { formatDistanceToNow, parseISO, setDefaultOptions } from "date-fns";
import { id } from "date-fns/locale";
import Button from "../components/Button";
import { useStateContext } from "../context/StateContext";
import SaksiTextLoading from "../components/Load/SaksiTextLoading";
import JumbotronLoading from "../components/Load/JumbotronLoading";
import ChartLoading from "../components/Load/ChartLoading";
import DataPerDaerah from "../components/Report/DataPerDaerah";
import Cookies from "js-cookie";
import instance from "../api/api";

setDefaultOptions({ locale: id });

export default function Home() {
  const navigate = useNavigate();
  const { token, admin, user } = useTokenContext();
  const { suaraByPaslon } = useDatabaseContext();
  const { loading } = useStateContext();
  const [data, setData] = useState(null);
  const [suaraByPaslonByKecamatan, setSuaraByPaslonByKecamatan] = useState([]);
  const lastUpdated = user?.kecamatan
    ? suaraByPaslonByKecamatan[0]?.["Last Updated"]
    : suaraByPaslon[0]?.["Last Updated"];
  const formattedLastUpdated = lastUpdated
    ? formatDistanceToNow(parseISO(lastUpdated), { addSuffix: true })
    : "Belum ada data";

  const renderLoadingState = () =>
    loading ? (
      <JumbotronLoading />
    ) : (
      <div className="space-y-6">
        <h1 className="text-5xl md:text-6xl font-semibold">Satuhati</h1>
        <p className="text-gray-600 font-light">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa
          dignissimos in nemo dolorem quo eligendi inventore quam repudiandae
          dicta nihil?
        </p>
      </div>
    );

  const renderButton = (text, onClick, login = false) => (
    <Button
      text={
        <div className="flex items-center justify-between gap-1">{text}</div>
      }
      onClick={onClick}
      isFull={login ? true : false}
      outline={!admin}
    />
  );

  const getKecamatanSuara = () => {
    let config = {
      method: "get",
      url: "/suara/byPaslon/kecamatan",
      params: { kecamatan: user?.kecamatan },
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    };
    instance.request(config).then((res) => {
      setSuaraByPaslonByKecamatan(res.data);
    });
  };

  useEffect(() => {
    getKecamatanSuara();
  }, [user]);

  return (
    <div className="w-full flex flex-col items-center md:pt-6 pb-10">
      <div className="w-[90%] sm:w-2/3 flex flex-col gap-6 text-center">
        {renderLoadingState()}
        {!admin && (
          <div className="flex items-center justify-center">
            <img
              src="./people.svg"
              alt="people"
              className="w-full md:w-[350px]"
            />
          </div>
        )}
        <div className={`flex flex-col justify-center items-center gap-10`}>
          {!token ? (
            <div>
              {renderButton(
                <>
                  <p>Masuk</p>
                  <BsArrowRightShort className="ml-2 text-xl" />
                </>,
                () => navigate("/login")
              )}
            </div>
          ) : admin ? (
            <>
              <div className="flex flex-col lg:flex-row justify-between gap-4 mt-8">
                <Charts
                  title={`Data Paslon ${user?.kecamatan ? user?.kecamatan : 'Seluruh'}`}
                  subtitle="Total suara paslon yang Telah Diterima"
                  data={
                    !user?.kecamatan ? suaraByPaslon : suaraByPaslonByKecamatan
                  }
                  name="Panggilan"
                  value="Total Suara"
                />
                {loading ? (
                  <ChartLoading />
                ) : (
                  <DataPerDaerah setValue={setData} />
                )}
              </div>
              {loading ? (
                <SaksiTextLoading />
              ) : data && data?.totalSaksi > 0 ? (
                <p className="text-center font-light mt-4 text-gray-600 max-w-[90%]">
                  <b className="text-black">
                    {data?.totalSaksiWithSuara} dari {data?.totalSaksi}
                  </b>{" "}
                  saksi telah menginput suara{" "}
                  <b className="text-black">{formattedLastUpdated}</b>
                </p>
              ) : null}
            </>
          ) : (
            token && (
              <div className="flex flex-col gap-4  w-full">
                <p className="font-medium">Menu</p>
                <div className="flex flex-col md:flex-row gap-3">
                  {renderButton(
                    <>
                      <p>Absen</p>
                      <BsPersonCheck />
                    </>,
                    () => navigate("/absen"),
                    true
                  )}
                  {renderButton(
                    <>
                      <p>Kirim Suara</p>
                      <BsSend className="ml-2" />
                    </>,
                    () => navigate("/kirim-suara"),
                    true
                  )}
                  {renderButton(
                    <>
                      <p>Riwayat</p>
                      <BsClockHistory className="ml-2" />
                    </>,
                    () => navigate("/riwayat"),
                    true
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
