import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Charts from "../components/Charts";
import { useDatabaseContext } from "../context/DatabaseContext";
import { useTokenContext } from "../context/TokenContext";
import { formatNumber } from "../utils/formatNumber";
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

setDefaultOptions({ locale: id });

export default function Home() {
  const navigate = useNavigate();
  const { token, admin } = useTokenContext();
  const { suaraByPaslon } = useDatabaseContext();
  const { loading } = useStateContext();
  const [data, setData] = useState(null);
  const lastUpdated = suaraByPaslon[0]?.["Last Updated"];
  const formattedLastUpdated = lastUpdated
    ? formatDistanceToNow(parseISO(lastUpdated), { addSuffix: true })
    : "Belum ada data";

  const renderLoadingState = () =>
    loading ? (
      <JumbotronLoading />
    ) : (
      <h1 className="text-5xl md:text-6xl font-semibold">Beranda</h1>
    );

  const renderButton = (text, onClick) => (
    <Button
      text={
        <div className="flex items-center  justify-between gap-1">{text}</div>
      }
      onClick={onClick}
      isFull={true}
      outline={!admin}
    />
  );

  return (
    <div className="w-full flex flex-col items-center md:pt-6 pb-10">
      <div className="w-[90%] sm:w-2/3 flex flex-col gap-6 text-center">
        {renderLoadingState()}

        <div className="flex flex-col justify-center items-center gap-20">
          {!token ? (
            <>
              {renderButton(
                <>
                  <p>Masuk</p>
                  <BsArrowRightShort className="ml-2 text-xl" />
                </>,
                () => navigate("/login")
              )}
            </>
          ) : admin ? (
            <>
              <div className="flex flex-col lg:flex-row justify-between gap-4 mt-8">
                <Charts
                  title="Data per Paslon"
                  subtitle="Total suara paslon yang Telah Diterima"
                  data={suaraByPaslon}
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
                <div className="flex flex-col md:flex-row  gap-3">
                  {renderButton(
                    <>
                      <p>Absen</p>
                      <BsPersonCheck />
                    </>,
                    () => navigate("/absen")
                  )}
                  {renderButton(
                    <>
                      <p>Kirim Suara</p>
                      <BsSend className="ml-2" />
                    </>,
                    () => navigate("/kirim-suara")
                  )}
                  {renderButton(
                    <>
                      <p>Riwayat</p>
                      <BsClockHistory className="ml-2" />
                    </>,
                    () => navigate("/riwayat")
                  )}
                </div>
              </div>
            )
          )}
          {!admin && (
            <img
              src="./people.svg"
              alt="people"
              className="w-full md:w-[350px]"
            />
          )}
        </div>
      </div>
    </div>
  );
}
