import React from "react";
import Button from "../Button";
import { useStateContext } from "../../context/StateContext";
import TableLoad from "../Load/TableLoad";

export default function DesktopTPS({ data, openModal }) {
  const { loading } = useStateContext();
  return (
    <>
      {loading ? (
        <TableLoad />
      ) : (
        <div className="hidden md:block overflow-x-auto rounded-md border">
          <table className="table-auto w-full text-center text-sm">
            <thead>
              <tr className="font-medium">
                <td className=" border-b px-4 py-2">DAPIL</td>
                <td className=" border-b px-4 py-2">KECAMATAN</td>
                <td className=" border-b px-4 py-2">DESA</td>
                <td className=" border-b px-4 py-2">NOMOR TPS</td>
                <td className=" border-b px-4 py-2">SUARA SAH</td>
                <td className=" border-b px-4 py-2">SUARA TIDAK SAH</td>
                <td className=" border-b px-4 py-2">TOTAL SUARA</td>
                <td className=" border-b px-4 py-2">Detail</td>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100 text-gray-600">
                  <td className=" border-b px-4 py-2">{item.dapil}</td>
                  <td className=" border-b px-4 py-2">{item.kecamatan}</td>
                  <td className=" border-b px-4 py-2">{item.desa}</td>
                  <td className=" border-b px-4 py-2">{item.kodeTPS}</td>
                  <td className=" border-b px-4 py-2">{item.jumlahSuaraSah}</td>
                  <td className=" border-b px-4 py-2">
                    {item.jumlahSuaraTidakSah}
                  </td>
                  <td className=" border-b px-4 py-2">{item.jumlahTotal}</td>
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
      )}
    </>
  );
}
