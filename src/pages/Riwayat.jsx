import React, { useEffect, useState } from "react";
import HeadingLoad from "../components/Load/HeadingLoad";
import { useStateContext } from "../context/StateContext";
import instance from "../api/api";
import Cookies from "js-cookie";

export default function Riwayat() {
  const { loading } = useStateContext();
  const [data, setData] = useState([]);
  const id = Cookies.get("_id");

  useEffect(() => {
    const getRiwayat = () => {
      let config = {
        method: "get",
        url: `/suara/user/${id}`,
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      };
      instance(config).then((res) => {
        console.log(res.data);
        setData(res.data);
      });
    };
    getRiwayat();
  }, []);

  return (
    <div className="w-full flex justify-center md:pt-6 pb-10">
      <div className="w-[90%] sm:w-2/4 flex flex-col gap-6">
        {loading ? (
          <HeadingLoad />
        ) : (
          <div className="space-y-3">
            <h1 className="font-bold text-3xl">Riwayat</h1>
            <p className="font-light text-gray-600">
              Riwayat Penghitungan Suara Anda
            </p>
          </div>
        )}
        <div className="space-y-3">
          {data.map((i, idx) => (
            <div key={idx} className="space-y-3">
              <p className="text-sm text-gray-600 mb-2">
                {new Date(i.createdAt).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
                ,{" "}
                {new Date(i.createdAt).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-700">Dapil</p>
                  <p className="text-gray-600">{i.tps?.dapil}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-700">Kecamatan</p>
                  <p className="text-gray-600">{i.tps?.kecamatan}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-700">Desa</p>
                  <p className="text-gray-600">{i.tps?.desa}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-700">TPS</p>
                  <p className="text-gray-600">TPS {i.tps?.kodeTPS}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-700">Total Suara Sah</p>
                  <p className="text-gray-600">{i.tps?.jumlahSuaraSah} Suara</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-700">Suara Tidak Sah</p>
                  <p className="text-gray-600">
                    {i.tps?.jumlahSuaraTidakSah} Suara
                  </p>
                </div>
              </div>
              <div className="overflow-hidden rounded-xl border">
                <table className="table-auto w-full text-justify text-base md:text-sm">
                  <thead>
                    <tr>
                      <td className="border font-semibold px-4 py-2">
                        Paslon
                      </td>
                      <td className="border font-semibold px-4 py-2">Suara</td>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    {i.suaraPaslon.map((item, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">
                          {item.paslon?.panggilan}
                        </td>
                        <td className="border px-4 py-2">
                          {item.jumlahSuaraSah} Suara
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
