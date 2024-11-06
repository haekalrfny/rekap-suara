import React from "react";
import KirimSuara from "./KirimSuara";
import { useTokenContext } from "../context/TokenContext";
import { useDatabaseContext } from "../context/DatabaseContext";

export default function Pilkada() {
  const { isFilled } = useTokenContext();
  const { paslonData } = useDatabaseContext();
  return (
    <KirimSuara
      type="pilkada"
      name="Pilkada"
      paslon={paslonData}
      fill={isFilled}
    />
  );
}
