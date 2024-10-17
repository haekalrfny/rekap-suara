import React from "react";
import { useDatabaseContext } from "../context/DatabaseContext";
import { Navigate } from "react-router-dom";
import PaslonCard from "../components/Paslon/PaslonCard";
import Cookies from "js-cookie";
import { useTokenContext } from "../context/TokenContext";

export default function Paslon() {
  const { paslonData } = useDatabaseContext();
  const { token } = useTokenContext();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="w-full flex flex-col items-center md:pt-6 pb-10 gap-6">
      <div className="w-[90%] sm:w-2/4 flex flex-col gap-6">
        <div className="space-y-3">
          <h1 className="font-bold text-3xl">Paslon</h1>
          <p className="font-light text-gray-600">
            Data suara pasangan calon Pilkada Bandung Barat 2024
          </p>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[90%]">
        {paslonData.map((item, index) => {
          return <PaslonCard item={item} key={index} />;
        })}
      </div>
    </div>
  );
}
