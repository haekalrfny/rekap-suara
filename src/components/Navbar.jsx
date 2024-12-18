import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown, FiMenu } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import Button from "./Button";
import { useTokenContext } from "../context/TokenContext";

const Navbar = () => {
  const { token, admin } = useTokenContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  const toggleDesktopDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileDropdown = () => {
    setMobileDropdownOpen(!mobileDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target)
      ) {
        setMobileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-20 flex justify-between items-center px-6">
      <ul className="hidden md:flex">
        <li className="font-semibold">temanbudi</li>
      </ul>

      {/* Menu Mobile */}
      <div className="md:hidden flex items-center">
        <button onClick={toggleMobileMenu} className="">
          <FiMenu className="text-2xl" />
        </button>
        <span className="ml-4 text-xl md:text-base font-semibold">
          temanbudi
        </span>
      </div>

      {/* Menu Desktop */}
      <ul
        className={`flex space-x-6 text-sm font-medium ${
          mobileMenuOpen ? "block" : "hidden"
        } md:flex`}
      >
        <li>
          <Link to="/" className="hover:text-gray-800">
            Beranda
          </Link>
        </li>
        {!admin && (
          <>
            <li>
              <div className="flex items-center cursor-pointer">
                <Link
                  to={token ? "/absen" : "/login"}
                  className="hover:text-gray-800"
                >
                  Absensi
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center cursor-pointer">
                <Link
                  to={token ? "/kertas-suara" : "/login"}
                  className="hover:text-gray-800"
                >
                  Surat Suara
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center cursor-pointer">
                <Link
                  to={token ? "/kirim-suara" : "/login"}
                  className="hover:text-gray-800"
                >
                  Hasil Pilkada
                </Link>
              </div>
            </li>
          </>
        )}
        {admin && (
          <>
            <li>
              <div className="flex items-center cursor-pointer">
                <Link
                  to={token ? "/kirim-suara/admin" : "/login"}
                  className="hover:text-gray-800"
                >
                  Hasil Pilkada
                </Link>
              </div>
            </li>
            <li className="relative" ref={desktopDropdownRef}>
              <div
                className="flex items-center cursor-pointer"
                onClick={toggleDesktopDropdown}
              >
                <span className="hover:text-gray-800">Informasi</span>
                <FiChevronDown
                  className={`ml-1 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
              {dropdownOpen && (
                <div className="absolute left-0 mt-1 w-40 bg-white border rounded-md shadow-lg z-10">
                  <Link
                    to={token ? "/tps" : "/login"}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setDropdownOpen(false);
                      setMobileMenuOpen(false);
                    }}
                  >
                    TPS
                  </Link>
                  <Link
                    to={token ? "/tps/all" : "/login"}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setDropdownOpen(false);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Semua TPS
                  </Link>
                  {/* <Link
                  to="/paslon"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setDropdownOpen(false);
                    setMobileMenuOpen(false);
                  }}
                >
                  Paslon
                </Link> */}
                  <Link
                    to="/users"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      setDropdownOpen(false);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Users
                  </Link>
                </div>
              )}
            </li>
          </>
        )}
        {!admin && (
          <li>
            <div className="flex items-center cursor-pointer">
              <Link
                to={token ? "/riwayat" : "/login"}
                className="hover:text-gray-800"
              >
                Riwayat
              </Link>
            </div>
          </li>
        )}
      </ul>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-white z-20 md:hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <span className="font-semibold text-xl md:text-base">
              temanbudi
            </span>
            <button onClick={toggleMobileMenu}>
              <AiOutlineClose className="text-2xl" />
            </button>
          </div>
          <ul className="flex flex-col space-y-4 p-4 text-lg">
            <li>
              <Link
                to="/"
                className="hover:text-gray-400"
                onClick={toggleMobileMenu}
              >
                Beranda
              </Link>
            </li>
            {!admin && (
              <>
                <li>
                  <Link
                    to={token ? "/absen" : "/login"}
                    className="hover:text-gray-400"
                    onClick={toggleMobileMenu}
                  >
                    Absensi
                  </Link>
                </li>
                <li>
                  <Link
                    to={token ? "/kertas-suara" : "/login"}
                    className="hover:text-gray-400"
                    onClick={toggleMobileMenu}
                  >
                    Surat Suara
                  </Link>
                </li>
                <li>
                  <Link
                    to={token ? "/kirim-suara" : "/login"}
                    className="hover:text-gray-400"
                    onClick={toggleMobileMenu}
                  >
                    Hasil Pilkada
                  </Link>
                </li>
              </>
            )}
            {admin && (
              <>
                <li>
                  <Link
                    to={token ? "/kirim-suara/admin" : "/login"}
                    className="hover:text-gray-400"
                    onClick={toggleMobileMenu}
                  >
                    Hasil Pilkada
                  </Link>
                </li>
                <li className="relative" ref={mobileDropdownRef}>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={toggleMobileDropdown}
                  >
                    <span className="hover:text-gray-400">Informasi</span>
                    <FiChevronDown
                      className={`ml-1 transition-transform ${
                        mobileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {mobileDropdownOpen && (
                    <div>
                      <Link
                        to={token ? "/tps" : "/login"}
                        className="block  py-1.5 rounded hover:bg-gray-100"
                        onClick={() => {
                          setMobileDropdownOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        - TPS
                      </Link>
                      <Link
                        to={token ? "/tps/all" : "/login"}
                        className="block  py-1.5 rounded hover:bg-gray-100"
                        onClick={() => {
                          setMobileDropdownOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        - Semua TPS
                      </Link>
                      {/* <Link
                      to="/paslon"
                      className="block  py-1.5 rounded hover:bg-gray-100"
                      onClick={() => {
                        setMobileDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      - Paslon
                    </Link> */}
                      <Link
                        to="/users"
                        className="block  py-1.5 rounded hover:bg-gray-100"
                        onClick={() => {
                          setMobileDropdownOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        - Users
                      </Link>
                    </div>
                  )}
                </li>
              </>
            )}
            {!admin && (
              <li>
                <Link
                  to={token ? "/riwayat" : "/login"}
                  className="hover:text-gray-400"
                  onClick={toggleMobileMenu}
                >
                  Riwayat
                </Link>
              </li>
            )}
            {!token && (
              <li>
                <Link
                  to="/login"
                  className="border bg-black text-white hover:bg-white hover:border-black hover:text-black text-base md:text-xs py-2 px-4 rounded-lg cursor-pointer block text-center"
                  onClick={toggleMobileMenu}
                >
                  Masuk
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}

      <ul className="flex items-center space-x-4">
        {!token && (
          <li>
            <Button
              text={"Masuk"}
              onClick={() => (window.location.href = "/login")}
              isFull={false}
              size={"xs"}
            />
          </li>
        )}
        {token && (
          <>
            <li>
              <Button
                text={"Akun"}
                size={"sm"}
                onClick={() => (window.location.href = "/akun")}
              />
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
