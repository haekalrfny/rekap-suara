import React from "react";
import Button from "../Button";

export default function DesktopTPS({ data, openModal }) {
  return (
    <div className="hidden md:block overflow-x-auto rounded-md border">
      <table className="table-auto w-full text-center text-sm">
        <thead>
          <tr className="font-medium">
            <td className=" border-b px-4 py-2">Kecamatan</td>
            <td className=" border-b px-4 py-2">Desa</td>
            <td className=" border-b px-4 py-2">Nomor TPS</td>
            <td className=" border-b px-4 py-2">Jumlah Peserta</td>
            <td className=" border-b px-4 py-2">Suara Sah</td>
            <td className=" border-b px-4 py-2">Suara Tidak Sah</td>
            <td className=" border-b px-4 py-2">Suara Tidak Terpakai</td>
            <td className=" border-b px-4 py-2">Detail</td>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100 text-gray-600">
              <td className=" border-b px-4 py-2">{item.kecamatan}</td>
              <td className=" border-b px-4 py-2">{item.desa}</td>
              <td className=" border-b px-4 py-2">{item.kodeTPS}</td>
              <td className=" border-b px-4 py-2">{item.jumlahPeserta}</td>
              <td className=" border-b px-4 py-2">{item.jumlahSuaraSah}</td>
              <td className=" border-b px-4 py-2">
                {item.jumlahSuaraTidakSah}
              </td>
              <td className=" border-b px-4 py-2">
                {item.jumlahSuaraTidakTerpakai}
              </td>
              <td className="border-b flex items-center justify-center px-4 py-2">
                <Button
                  text="Detail"
                  onClick={() => openModal(item._id)}
                  size={"xs"}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
