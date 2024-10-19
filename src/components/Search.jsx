import React, { useState } from "react";
import { PiMagnifyingGlassBold } from "react-icons/pi";
import Button from "./Button";

export default function Search({ setSearchQuery, setCurrentPage }) {
  const [tempQuery, setTempQuery] = useState("");

  const handleSearch = () => {
    setSearchQuery(tempQuery);
    setCurrentPage(0);
  };

  return (
    <div>
      <label htmlFor="search" className="text-sm font-medium mb-1 text-black">
        Cari
      </label>
      <div className="flex items-center gap-3">
        <input
          id="search"
          type="text"
          placeholder="Cari TPS, Desa, Kecamatan atau Dapil..."
          value={tempQuery}
          onChange={(e) => setTempQuery(e.target.value)}
          className="border-b text-base md:text-sm border-gray-300 w-full py-2 focus:outline-none focus:border-gray-900"
        />
        <Button text={<PiMagnifyingGlassBold/>} onClick={handleSearch} outline={true} isFull={false}/>
      </div>
    </div>
  );
}
