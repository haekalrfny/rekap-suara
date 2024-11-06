import React, { useEffect, useState } from "react";
import ProgressBar from "../ProgressBar";
import Cookies from "js-cookie";
import instance from "../../api/api";
import { useTokenContext } from "../../context/TokenContext";
export default function DataPerDaerah({ setValue }) {
  const [data, setData] = useState(null);
  const { user } = useTokenContext();

  useEffect(() => {
    if (!user?.district) {
      getReportPerDaerah();
    } else {
      getReportPerKecamatan();
    }
  }, [user]);

  const getReportPerDaerah = () => {
    let config = {
      method: "get",
      url: "/tps/report/tps",
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
      params: { kecamatan: user?.district },
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
        Suara {user?.district ? user?.district : "Kab. Bandung Barat"}
      </h2>
      <p className="text-gray-600 mb-4">Jumlah Suara yang Telah Diterima</p>
      {!user?.district && (
        <>
          <ProgressBar
            text={"Dapil"}
            current={data?.dapil.withSuara.pilkada}
            total={data?.dapil.total}
          />
          <ProgressBar
            text={"Kecamatan"}
            current={data?.kecamatan.withSuara.pilkada}
            total={data?.kecamatan.total}
          />
        </>
      )}
      <ProgressBar
        text={"Desa"}
        current={data?.desa.withSuara.pilkada}
        total={data?.desa.total}
      />
      <ProgressBar
        text={"TPS"}
        current={data?.tps.withSuara.pilkada}
        total={data?.tps.total}
      />
      <p className="text-sm  mt-1 lowercase">
        *data hanya untuk wilayah{" "}
        {user?.district ? user?.district : "Kab. Bandung Barat"}
      </p>
    </div>
  );
}
