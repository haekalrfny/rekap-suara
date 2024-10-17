import React from "react";
import Button from "../Button";

export default function MobileTPS({ data, openModal }) {
  return (
    <div className=" w-full block space-y-3 md:hidden">
      {data.map((item, index) => (
        <div key={index} className="border rounded-lg p-6">
          <div className="space-y-3">
            <h2 className="font-semibold text-base mb-2 py-1 px-3 rounded-lg border w-max">
              {item.kodeTPS}
            </h2>
            <div className="text-gray-700 mb-1 flex justify-between items-center">
              <span className="font-semibold">Kecamatan</span>
              <span>{item.kecamatan}</span>
            </div>
            <div className="text-gray-700 mb-1 flex justify-between items-center">
              <span className="font-semibold">Desa</span>
              <span>{item.desa}</span>
            </div>
            <div className="text-gray-700 mb-1 flex justify-between items-center">
              <span className="font-semibold">Jumlah Peserta</span>
              <span>{item.jumlahPeserta}</span>
            </div>
            <div>
              <Button text={"Detail"} onClick={() => openModal(item._id)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
