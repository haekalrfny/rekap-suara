import axios from "axios";

const instance = axios.create({
  baseURL: "https://rekap-suara-server-production.up.railway.app",
});

export default instance;
