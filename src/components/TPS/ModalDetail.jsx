import React, { useEffect, useState } from "react";
import ProgressBar from "../ProgressBar";
import Cookies from "js-cookie";
import instance from "../../api/api";
import Button from "../Button";
import Image from "../Image";
import Switch from "../Switch";

export default function ModalDetail({ id, onCancel }) {
  const [data, setData] = useState(null);
  const [openImage, setOpenImage] = useState(false);
  const [type, setType] = useState("pilkada");
  useEffect(() => {
    getDataById();
  }, [id]);
  const getDataById = () => {
    let config = {
      method: "get",
      url: `/suara/${type}/tps/${id}`,
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    };
    instance.request(config).then((res) => {
      setData(res.data);
    });
  };

  const menuSwitch = [
    {
      name: "Pilkada KBB",
      value: "pilkada",
    },
    {
      name: "Pilkada Jabar",
      value: "pilgub",
    },
  ];

  return (
    <>
      <div className="w-full h-screen flex items-center justify-center fixed z-10 inset-0 bg-black bg-opacity-30">
        <div className="w-[90%] md:w-[50%] lg:w-1/3 bg-white rounded-lg flex flex-col gap-4 p-6">
          <div>
            <h1 className="font-semibold text-xl">Detail TPS</h1>
            <p className="text-sm text-gray-600">Suara yang telah diterima</p>
            <Switch menu={menuSwitch} value={type} setValue={setType} />
          </div>
          {data ? (
            <>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Kecamatan</span>
                  <span className="text-gray-600">{data?.tps?.kecamatan}</span>
                </div>
                <hr />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Desa</span>
                  <span className="text-gray-600">{data?.tps?.desa}</span>
                </div>
                <hr />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Nomor TPS</span>
                  <span className="text-gray-600">{data?.tps?.kodeTPS}</span>
                </div>
                <hr />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Suara Sah</span>
                  <span className="text-gray-600">
                    {data?.tps?.[type]?.suaraSah} Suara
                  </span>
                </div>
                <hr />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Suara Tidak Sah</span>
                  <span className="text-gray-600">
                    {data?.tps?.[type]?.suaraTidakSah} Suara
                  </span>
                </div>
                <hr />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Suara Tidak Terpakai</span>
                  <span className="text-gray-600">
                    {data?.tps?.[type]?.suaraTidakTerpakai} Suara
                  </span>
                </div>
                <hr />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Kertas Suara</span>
                  <span className="text-gray-600">
                    {data?.tps?.[type]?.kertasSuara} Kertas
                  </span>
                </div>
                <hr />
              </div>
              <div className="space-y-1">
                {data?.suaraPaslon?.map((paslon, index) => (
                  <ProgressBar
                    key={index}
                    text={
                      `(${paslon?.paslon?.noUrut}) ` + paslon?.paslon?.panggilan
                    }
                    current={paslon?.suaraSah}
                    total={data?.tps?.[type]?.suaraSah}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col  gap-6 items-center justify-center h-64">
              <img src="./no_data.svg" className="w-40" />
              <p className="text-gray-500 text-sm">belum terinput.</p>
            </div>
          )}
          <div className="flex gap-3">
            {data && (
              <Button
                text={"Lihat Gambar"}
                onClick={() => setOpenImage(true)}
                size={"sm"}
                outline={true}
              />
            )}
            <Button text={"Tutup"} onClick={onCancel} size={"sm"} />
          </div>
        </div>
      </div>
      {openImage && (
        <Image url={data?.image} onCancel={() => setOpenImage(false)} />
      )}
    </>
  );
}
