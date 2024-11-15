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
  fetchSuaraKecamatan,
} from "../functions/fetchData";
import Menu from "../components/Menu";
import Loading from "../components/Loading";

setDefaultOptions({ locale: id });

export default function Home() {
  const navigate = useNavigate();
  const { token, admin } = useTokenContext();
  const { loading, setLoading } = useStateContext();
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [suaraPaslon, setSuaraPaslon] = useState([]);
  const [suaraPaslonPilgub, setSuaraPaslonPilgub] = useState([]);
  const [suaraDapil, setSuaraDapil] = useState([]);
  const [suaraDapilPilgub, setSuaraDapilPilgub] = useState([]);
  const [suaraByPaslonByKecamatan, setSuaraByPaslonByKecamatan] = useState([]);
  const [suaraByPaslonByKecamatnPilgub, setSuaraByPaslonByKecamatanPilgub] =
    useState([]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const pilkadaPaslon = await fetchSuaraByPaslon("pilkada");
      setSuaraPaslon(pilkadaPaslon);
      const pilgubPaslon = await fetchSuaraByPaslon("pilgub");
      setSuaraPaslonPilgub(pilgubPaslon);
      const pilkadaDapil = await fetchSuaraByDapil("pilkada");
      setSuaraDapil(pilkadaDapil);
      const pilgubDapil = await fetchSuaraByDapil("pilgub");
      setSuaraDapilPilgub(pilgubDapil);
      const pilkadaSuaraKecamatan = await fetchSuaraKecamatan(
        "pilkada",
        user?.district
      );
      setSuaraByPaslonByKecamatan(pilkadaSuaraKecamatan);
      const pilgubSuaraKecamatan = await fetchSuaraKecamatan(
        "pilgub",
        user?.district
      );
      setSuaraByPaslonByKecamatanPilgub(pilgubSuaraKecamatan);
      const myUser = await fetchUserId();
      setUser(myUser.data);
      setLoading(false);
    };
    getData();
  }, [setLoading, user?.district]);

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

  const menuData = [
    { label: "Absensi", icon: <FaUserCheck />, link: "/absen" },
    {
      label: "Surat Suara",
      icon: <LuScroll />,
      link: "/kertas-suara",
    },
    {
      label: "Hasil Pilkada",
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
      <div className="w-full sm:w-2/4 flex flex-col gap-12">
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
        {!admin && (
          <>
            {loading ? (
              <div className="w-full h-64">
                <Loading />
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <img
                  src="./people.svg"
                  alt="people"
                  className="w-[90%] md:w-[350px]"
                />
              </div>
            )}
          </>
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
              <div className="flex flex-col lg:flex-row   items-center justify-between gap-4">
                {(user?.district ? suaraByPaslonByKecamatan : suaraPaslon)
                  ?.length > 0 ? (
                  <div className="w-full md:w-1/2">
                    <Charts
                      title={`Tabulasi ${user?.district || "Pilkada KBB"}`}
                      subtitle="Total suara paslon yang Telah Diterima"
                      data={
                        user?.district ? suaraByPaslonByKecamatan : suaraPaslon
                      }
                      name="Panggilan"
                      value="Total Suara"
                      type="bar"
                      color="pilbup"
                    />
                  </div>
                ) : null}

                {(user?.district
                  ? suaraByPaslonByKecamatnPilgub
                  : suaraPaslonPilgub
                )?.length > 0 ? (
                  <div className="w-full md:w-1/2">
                    <Charts
                      title={`Tabulasi ${user?.district || "Pilkada Jabar"}`}
                      subtitle="Total suara paslon yang Telah Diterima"
                      data={
                        user?.district
                          ? suaraByPaslonByKecamatnPilgub
                          : suaraPaslonPilgub
                      }
                      name="Panggilan"
                      value="Total Suara"
                      type="bar"
                      color="pilgub"
                    />
                  </div>
                ) : null}
              </div>

              {/* {!user?.district &&
                !loading &&
                (suaraDapil?.length > 0 || suaraDapilPilgub?.length > 0) && (
                  <div className="flex flex-col lg:flex-row bg-slate-50 rounded-xl items-center justify-between gap-4">
                    {suaraDapil?.length > 0 && (
                      <div className="w-full md:w-1/2">
                        <Charts
                          title="Rekap Per Dapil Pilkada KBB"
                          subtitle="Total suara tiap dapil"
                          data={suaraDapil}
                          name="dapil"
                          value="suara"
                          type="pie"
                          color={"pilbup"}
                        />
                      </div>
                    )}
                    {suaraDapilPilgub?.length > 0 && (
                      <div className="w-full md:w-1/2">
                        <Charts
                          title="Rekap Per Dapil Pilkada Jabar"
                          subtitle="Total suara tiap dapil"
                          data={suaraDapilPilgub}
                          name="dapil"
                          value="suara"
                          type="pie"
                          color={"pilgub"}
                        />
                      </div>
                    )}
                  </div>
                )} */}

              {admin && !loading && (
                <div className="flex flex-col lg:flex-row  items-center justify-between gap-4">
                  <div className="w-full md:w-1/2">
                    {loading ? (
                      <ChartLoading />
                    ) : (
                      <DataPerDaerah setValue={setData} type="pilkada" />
                    )}
                  </div>
                  <div className="w-full md:w-1/2">
                    {loading ? (
                      <ChartLoading />
                    ) : (
                      <DataPerDaerah setValue={setData} type="pilgub" />
                    )}
                  </div>
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
          {token && !admin && <Menu data={menuData} isFull={true} />}
        </div>
      </div>
    </div>
  );
}
