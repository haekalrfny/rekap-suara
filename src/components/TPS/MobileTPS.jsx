import React from "react";
import Button from "../Button";

export default function MobileTPS({ data, openModal }) {
  return (
    <div className="w-full block space-y-4 md:hidden">
      {data.map((item, index) => (
        <div
          key={index}
          className="rounded-lg bg-white shadow-lg p-6 flex flex-col justify-between gap-4 border border-gray-200 transition-transform transform hover:scale-105"
        >
          <div className="space-y-3">
            <div>
              <p className="text-xs py-1 px-2 w-max rounded-full bg-gray-100 text-gray-600 font-semibold">
                {item.dapil}
              </p>
            </div>

            <div>
              <p className="font-semibold text-xl text-gray-800">
                {item.kecamatan}
              </p>
              <p className="font-medium text-lg text-gray-700">{item.desa}</p>
              <p className="font-medium text-lg text-gray-700">
                TPS {item.kodeTPS}
              </p>
            </div>
          </div>
          <div className="w-full flex justify-end">
            <Button
              text={"Detail"}
              onClick={() => openModal(item._id)}
              outline={true}
              size={"sm"}
              isFull={false}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
