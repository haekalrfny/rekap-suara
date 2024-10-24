import React, { useEffect, useState } from "react";
import ProgressBar from "../ProgressBar";
import Cookies from "js-cookie";
import instance from "../../api/api";
export default function DataPerDaerah({ setValue }) {
  const [data, setData] = useState(null);
  console.log(data)

  useEffect(() => {
    getReportPerDaerah();
  }, []);

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

  return (
    <div className="w-full flex flex-col gap-2 p-6 md:min-w-[400px]">
      <h2 className="text-2xl font-semibold">Data per Daerah</h2>
      <p className="text-gray-600 mb-4">Jumlah Suara yang Telah Diterima</p>
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
      <p className="text-sm  mt-1">
        *data hanya untuk wilayah Kab. Bandung Barat
      </p>
    </div>
  );
}
