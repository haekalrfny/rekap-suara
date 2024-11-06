import React from "react";
import Button from "../Button";
import { useStateContext } from "../../context/StateContext";
import TableLoad from "../Load/TableLoad";

export default function DesktopTPS({ data, openModal }) {
  const { loading } = useStateContext();
  console.log(data);
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
                <td className=" border-b px-4 py-2">PILKADA</td>
                <td className=" border-b px-4 py-2">PILGUB</td>
                <td className=" border-b px-4 py-2">Detail</td>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100 text-gray-600">
                  <td className="border-b px-4 py-2">{item.dapil}</td>
                  <td className="border-b px-4 py-2">{item.kecamatan}</td>
                  <td className="border-b px-4 py-2">{item.desa}</td>
                  <td className="border-b px-4 py-2">{item.kodeTPS}</td>

                  <td className="border-b px-4 py-2 text-xs">
                    {(item.pilkada?.suaraSah ||
                      item.pilkada?.suaraTidakSah ||
                      item.pilkada?.suaraTidakTerpakai ||
                      item.pilkada?.kertasSuara) && (
                      <>
                        <div className="mb-0.5 font-semibold text-gray-700">
                          Suara
                        </div>
                        <div>
                          {item.pilkada?.suaraSah && (
                            <p>Sah: {item.pilkada.suaraSah}</p>
                          )}
                          {item.pilkada?.suaraTidakSah && (
                            <p>Tidak Sah: {item.pilkada.suaraTidakSah}</p>
                          )}
                          {item.pilkada?.suaraTidakTerpakai && (
                            <p>
                              Tidak Terpakai: {item.pilkada.suaraTidakTerpakai}
                            </p>
                          )}
                          {item.pilkada?.kertasSuara && (
                            <p>Kertas Suara: {item.pilkada.kertasSuara}</p>
                          )}
                        </div>
                      </>
                    )}
                  </td>

                  <td className="border-b px-4 py-2 text-xs">
                    {(item.pilgub?.suaraSah ||
                      item.pilgub?.suaraTidakSah ||
                      item.pilgub?.suaraTidakTerpakai ||
                      item.pilgub?.kertasSuara) && (
                      <>
                        <div className="mb-0.5 font-semibold text-gray-700">
                          Suara
                        </div>
                        <div>
                          {item.pilgub?.suaraSah && (
                            <p>Sah: {item.pilgub.suaraSah}</p>
                          )}
                          {item.pilgub?.suaraTidakSah && (
                            <p>Tidak Sah: {item.pilgub.suaraTidakSah}</p>
                          )}
                          {item.pilgub?.suaraTidakTerpakai && (
                            <p>
                              Tidak Terpakai: {item.pilgub.suaraTidakTerpakai}
                            </p>
                          )}
                          {item.pilgub?.kertasSuara && (
                            <p>Kertas Suara: {item.pilgub.kertasSuara}</p>
                          )}
                        </div>
                      </>
                    )}
                  </td>

                  <td className="border-b px-4 py-2">
                    <Button
                      text="Detail"
                      onClick={() => openModal(item._id)}
                      size="xs"
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
