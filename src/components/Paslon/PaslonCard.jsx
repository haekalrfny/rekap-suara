import React from "react";
import Button from "../Button";
import { useStateContext } from "../../context/StateContext";
import PaslonCardLoad from "../Load/PaslonCardLoad";

export default function PaslonCard({ item, type }) {
  const { loading } = useStateContext();

  const getColorClass = (noUrut, type) => {
    const colors = {
      1:
        type === "pilkada"
          ? "bg-orange-100 text-orange-500"
          : "bg-green-100 text-green-500",
      2:
        type === "pilkada"
          ? "bg-blue-100 text-blue-500"
          : "bg-red-100 text-red-500",
      3:
        type === "pilkada"
          ? "bg-red-100 text-red-500"
          : "bg-blue-100 text-blue-500",
      4:
        type === "pilkada"
          ? "bg-green-100 text-green-500"
          : "bg-yellow-100 text-yellow-500",
    };
    return colors[noUrut] || "bg-gray-100 text-gray-500";
  };

  return (
    <>
      {loading ? (
        <PaslonCardLoad />
      ) : (
        <div className="rounded-md bg-white shadow p-6 flex flex-col justify-between gap-3 transition-transform transform hover:scale-105 ">
          <div className="space-y-3">
            <div>
              <p
                className={`text-xs py-0.5 px-3 w-max rounded-full ${getColorClass(
                  item.noUrut,
                  type
                )} font-semibold`}
              >
                No Urut {item.noUrut}
              </p>
            </div>
            <div>
              <p className="font-medium text-lg break-words">
                {item.ketua} - {item.wakilKetua}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div className="space-y-3">
              <p className="font-medium">Partai Pengusung :</p>
              {item.partai && item.partai.length > 0 ? (
                <div className="flex gap-2 flex-wrap">
                  {item.partai.map((i, idx) => (
                    <div
                      key={idx}
                      className="aspect-square w-8 h-8 overflow-hidden flex-shrink-0"
                    >
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
                window.location.href = `/paslon/${type}/${item._id}`;
              }}
              outline={true}
              size={"sm"}
              isFull={false}
            />
          </div>
        </div>
      )}
    </>
  );
}
