import React, { useEffect, useState } from "react";
import ProgressBar from "../ProgressBar";
import {
  fetchUserId,
  fetchReportTPSKecamatan,
  fetchReportTPSDaerah,
} from "../../functions/fetchData";

export default function DataPerDaerah({ setValue, type }) {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const item = user.district
          ? await fetchReportTPSKecamatan(user.district)
          : await fetchReportTPSDaerah();
        setData(item);
        setValue(item);
      }
    };
    fetchData();
  }, [user, setValue]);

  useEffect(() => {
    const loadUser = async () => {
      const item = await fetchUserId();
      setUser(item.data);
    };
    loadUser();
  }, []);

  return (
    <div className="w-full flex flex-col gap-2 p-6 md:min-w-[400px]">
      <h2 className="text-2xl font-semibold">
        {type === "pilkada" ? "Pilkada KBB" : "Pilkada Jabar"}{" "}
        {user?.district || ""}
      </h2>
      <p className="text-gray-600 mb-4">Jumlah Suara yang Telah Diterima</p>
      {!user?.district && (
        <>
          <ProgressBar
            text="Dapil"
            current={data?.dapil.withSuara[type]}
            total={data?.dapil.total}
          />
          <ProgressBar
            text="Kecamatan"
            current={data?.kecamatan.withSuara[type]}
            total={data?.kecamatan.total}
          />
        </>
      )}
      <ProgressBar
        text="Desa"
        current={data?.desa.withSuara[type]}
        total={data?.desa.total}
      />
      <ProgressBar
        text="TPS"
        current={data?.tps.withSuara[type]}
        total={data?.tps.total}
      />
      <p className="text-sm mt-1 lowercase">
        *data hanya untuk wilayah {user?.district || "Kab. Bandung Barat"}
      </p>
    </div>
  );
}
