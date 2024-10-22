import React from "react";
import Charts from "../components/Charts";
import { useDatabaseContext } from "../context/DatabaseContext";
import { useTokenContext } from "../context/TokenContext";
import { formatNumber } from "../utils/formatNumber";
import { BsArrowRightShort, BsSend } from "react-icons/bs";
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
  const { token, admin } = useTokenContext();
  const { suaraByPaslon } = useDatabaseContext();
  const { loading } = useStateContext();
  const totalSaksi = formatNumber(suaraByPaslon[0]?.["Total Saksi"] || 0);
  const lastUpdated = suaraByPaslon[0]?.["Last Updated"];
  const formattedLastUpdated = lastUpdated
    ? formatDistanceToNow(parseISO(lastUpdated), { addSuffix: true })
    : "Belum ada data";

  const renderLoadingState = () =>
    loading ? (
      <JumbotronLoading />
    ) : (
      <>
        <h1 className="text-5xl md:text-6xl font-semibold">Dilan.tik</h1>
        <p className="font-light text-gray-600">
          Merekap dan Memonitor Suara Rakyat untuk Mewujudkan Pemimpin yang
          Berkualitas di Pilkada Bandung Barat 2024
        </p>
      </>
    );

  const renderButton = (text, onClick) => (
    <Button
      text={<div className="flex items-center">{text}</div>}
      onClick={onClick}
      isFull={false}
      outline={!admin}
    />
  );

  return (
    <div className="w-full flex flex-col items-center md:pt-6 pb-10">
      <div className="w-[90%] sm:w-2/3 flex flex-col gap-6 md:gap-10 text-center">
        {renderLoadingState()}

        <div className="flex flex-col justify-center items-center gap-20">
          {!token ? (
            <>
              {renderButton(
                <>
                  <p>Gabung sekarang</p>
                  <BsArrowRightShort className="ml-2 text-xl" />
                </>,
                () => (window.location.href = "/login")
              )}
            </>
          ) : admin ? (
            <>
              <div className=" flex flex-col lg:flex-row justify-between gap-4 mt-8">
                <Charts
                  title="Data per Paslon"
                  subtitle="Total suara paslon yang Telah Diterima"
                  data={suaraByPaslon}
                  name="Panggilan"
                  value="Total Suara"
                />
                {loading ? <ChartLoading /> : <DataPerDaerah />}
              </div>
              {loading ? (
                <SaksiTextLoading />
              ) : totalSaksi ? (
                <p className="text-center font-light mt-4 text-gray-600 max-w-[90%]">
                  <b className="text-black">{totalSaksi}</b> saksi telah
                  menginput suara{" "}
                  <b className="text-black">{formattedLastUpdated}</b>
                </p>
              ) : null}
            </>
          ) : (
            token &&
            renderButton(
              <>
                <p>Kirim Suara</p>
                <BsSend className="ml-2" />
              </>,
              () => (window.location.href = "/kirim-suara")
            )
          )}
          {!admin && (
            <img
              src="./people.svg"
              alt="people"
              className="w-full md:w-[500px]"
            />
          )}
        </div>
      </div>
    </div>
  );
}
