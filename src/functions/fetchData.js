import instance from "../api/api";
import Cookies from "js-cookie";

export const fetchTpsData = async () => {
  try {
    const res = await instance.get("/tps", {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching TPS data:", error);
    return [];
  }
};

export const fetchPaslonData = async () => {
  try {
    const res = await instance.get("/paslon/pilkada", {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });

    const sortedData = res.data.sort((a, b) => a.noUrut - b.noUrut);

    return sortedData;
  } catch (error) {
    console.error("Error fetching Paslon data:", error);
    return [];
  }
};

export const fetchPilgubPaslon = async () => {
  try {
    const res = await instance.get("/paslon/pilgub", {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });

    const sortedData = res.data.sort((a, b) => a.noUrut - b.noUrut);

    return sortedData;
  } catch (error) {
    console.error("Error fetching Pilgub Paslon data:", error);
    return [];
  }
};

export const fetchSuaraByPaslon = async () => {
  try {
    const res = await instance.get("/suara/pilkada/paslon", {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching Suara by Paslon data:", error);
    return [];
  }
};

export const fetchSuaraByDapil = async () => {
  try {
    const res = await instance.get("/tps/dapil/pilkada", {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching Suara by Dapil data:", error);
    return [];
  }
};

export const fetchSuaraByPaslonKecamatan = async (kecamatan) => {
  try {
    const res = await instance.get("/tps/dapil/pilkada", {
      headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      params: { kecamatan },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching Suara by Dapil data:", error);
    return [];
  }
};

export const fetchRiwayatPilbub = async () => {
  try {
    const res = await instance.get(
      `/suara/pilkada/user/${Cookies.get("_id")}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching Riwayat Pilgub data:", error);
    return [];
  }
};

export const fetchRiwayatPilgub = async () => {
  try {
    const res = await instance.get(`/suara/pilgub/user/${Cookies.get("_id")}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching Riwayat Pilgub data:", error);
    return [];
  }
};

export const fetchUserId = async () => {
  try {
    const res = await instance.get(`/user/${Cookies.get("_id")}`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return {
      data: res.data,
      attandance: res.data.attandance,
    };
  } catch (error) {
    console.error("Error fetching UserId data:", error);
    return {
      data: null,
      attandance: false,
    };
  }
};

export const fetchReportTPSKecamatan = async (kecamatan) => {
  try {
    const res = await instance.get(
      `/tps/report/kecamatan?kecamatan=${kecamatan}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching TPS Kecamatan data:", error);
    return [];
  }
};

export const fetchReportTPSDaerah = async () => {
  try {
    const res = await instance.get("/tps/report/tps", {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching TPS Kecamatan data:", error);
    return [];
  }
};