import axios from "axios";

const instance = axios.create({
  baseURL: "http://rekap-suara-server-production.up.railway.app",
});

export default instance;
