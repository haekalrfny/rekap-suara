import React, { useEffect, useState } from "react";
import ProgressBar from "../ProgressBar";
import Cookies from "js-cookie";
import instance from "../../api/api";
import { useTokenContext } from "../../context/TokenContext";
export default function DataPerDaerah({ setValue }) {
  const [data, setData] = useState(null);
  const { user } = useTokenContext();

  useEffect(() => {
    if (!user?.kecamatan) {
      getReportPerDaerah();
    } else {
      getReportPerKecamatan();
    }
  }, [user]);

  const getReportPerDaerah = () => {
    let config = {
      method: "get",
      url: "/tps/report/all",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    };
    instance
      .request(config)
      .then((res) => {
        setData(res.data);
        setValue(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getReportPerKecamatan = () => {
    let config = {
      method: "get",
      url: "/tps/report/kecamatan",
      params: { kecamatan: user?.kecamatan },
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    };
    instance
      .request(config)
      .then((res) => {
        setData(res.data);
        setValue(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="w-full flex flex-col gap-2 p-6 md:min-w-[400px]">
      <h2 className="text-2xl font-semibold">
        Suara {user?.kecamatan ? user?.kecamatan : "Kab. Bandung Barat"}
      </h2>
      <p className="text-gray-600 mb-4">Jumlah Suara yang Telah Diterima</p>
      {!user?.kecamatan && (
        <>
          <ProgressBar
            text={"Dapil"}
            current={data?.totalDapilWithSuara}
            total={data?.totalDapil}
          />
          <ProgressBar
            text={"Kecamatan"}
            current={data?.totalKecamatanWithSuara}
            total={data?.totalKecamatan}
          />
        </>
      )}
      <ProgressBar
        text={"Desa"}
        current={data?.totalDesaWithSuara}
        total={data?.totalDesa}
      />
      <ProgressBar
        text={"TPS"}
        current={data?.totalTPSWithSuara}
        total={data?.totalTPS}
      />
      <p className="text-sm  mt-1 lowercase">
        *data hanya untuk wilayah{" "}
        {user?.kecamatan ? user?.kecamatan : "Kab. Bandung Barat"}
      </p>
    </div>
  );
}
