import React from "react";
import KirimSuara from "./KirimSuara";
import { useTokenContext } from "../context/TokenContext";
import { useDatabaseContext } from "../context/DatabaseContext";

export default function Pilgub() {
  const { isFillPilgub } = useTokenContext();
  const { pilgubPaslon } = useDatabaseContext();
  return (
    <KirimSuara
      type="pilgub"
      name="Pilgub"
      paslon={pilgubPaslon}
      fill={isFillPilgub}
    />
  );
}
