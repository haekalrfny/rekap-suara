import React, { useState } from "react";
import Button from "../Button";

export default function PaslonCard({ item }) {
  const bgColor =
    item.noUrut === 1
      ? "bg-orange-100 text-orange-500"
      : item.noUrut === 2
      ? "bg-blue-100 text-blue-500"
      : item.noUrut === 3
      ? "bg-red-100 text-red-500"
      : item.noUrut === 4
      ? "bg-green-100 text-green-500"
      : "bg-gray-100 text-gray-500";

  return (
    <div>
      <div className="rounded-md bg-white shadow p-6 flex flex-col justify-between gap-3">
        <div className="space-y-3">
          <div>
            <p
              className={`text-xs py-0.5 px-3 w-max rounded-full ${bgColor} font-semibold`}
            >
              No Urut {item.noUrut}
            </p>
          </div>
          <div>
            <p className="font-medium text-lg">
              {item.namaCalonKetua} - {item.namaWakilKetua}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div className="space-y-3">
            <p className="font-medium">Partai Pengusung :</p>
            {item.partai && item.partai.length > 0 ? (
              <div className="flex gap-2">
                {item.partai.map((i, idx) => (
                  <div key={idx} className="aspect-square w-8">
                    <img
                      src={i.image}
                      alt={i.nama}
                      className="object-contain w-full h-full"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Independen</p>
            )}
          </div>
          <Button
            text={"Detail"}
            onClick={() => {
              window.location.href = `/paslon/${item._id}`;
            }}
            outline={true}
            size={"sm"}
            isFull={false}
          />
        </div>
      </div>
    </div>
  );
}
