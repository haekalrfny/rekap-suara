import React from "react";

export default function Search({
  searchQuery,
  setSearchQuery,
  setCurrentPage,
}) {
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
  };
  return (
    <div>
      <label htmlFor="search" className="text-sm font-medium mb-1 text-black">
        Cari
      </label>
      <input
        id="search"
        type="text"
        placeholder="Cari TPS, Desa, atau Kecamatan..."
        value={searchQuery}
        onChange={handleSearch}
        className="border-b text-base md:text-sm border-gray-300 w-full py-2 focus:outline-none focus:border-gray-900"
      />
    </div>
  );
}
