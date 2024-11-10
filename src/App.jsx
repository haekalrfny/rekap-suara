import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
// components
import Navbar from "./components/Navbar";
// pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import KirimSuara from "./pages/KirimSuara";
import TPS from "./pages/TPS";
import Paslon from "./pages/Paslon";
import PaslonDetail from "./pages/PaslonDetail";
import Akun from "./pages/Akun";
// context
import { StateContext } from "../src/context/StateContext";
import { NotifProvider } from "../src/context/NotifContext";
import { TokenContext } from "./context/TokenContext";
import Riwayat from "./pages/Riwayat";
import Absen from "./pages/Absen";
import KertasSuara from "./pages/KertasSuara";
import Users from "./pages/Users";

export default function App() {
  return (
    <TokenContext>
      <StateContext>
        <NotifProvider>
          <Router>
            <Routes>
              <Route element={<LayoutWithSidebar />}>
                <Route index path="/" element={<Home />} />
                <Route index path="/kirim-suara" element={<KirimSuara />} />
                <Route index path="/kertas-suara" element={<KertasSuara />} />
                <Route index path="/tps" element={<TPS />} />
                <Route index path="/paslon" element={<Paslon />} />
                <Route index path="/paslon/:id" element={<PaslonDetail />} />
                <Route index path="/akun" element={<Akun />} />
                <Route index path="/users" element={<Users />} />
                <Route index path="/riwayat" element={<Riwayat />} />
                <Route index path="/absen" element={<Absen />} />
              </Route>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Router>
        </NotifProvider>
      </StateContext>
    </TokenContext>
  );
}

function LayoutWithSidebar() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="p-4 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
