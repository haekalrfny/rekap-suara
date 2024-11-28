import React, { useEffect, useState } from "react";
import { useNotif } from "../../context/NotifContext";
import ProgressBar from "../ProgressBar";
import Cookies from "js-cookie";
import instance from "../../api/api";
import Button from "../Button";
import Image from "../Image";
import Switch from "../Switch";
import NoData from "../../../public/no_data.svg";
import Input from "../Input";
import InputImage from "../InputImage";
import { useStateContext } from "../../context/StateContext";
import Loading from "../Loading";

export default function ModalDetail({ id, onCancel }) {
  const { loading, setLoading } = useStateContext();
  const [data, setData] = useState(null);
  const [dataById, setDataById] = useState(null);
  const [openImage, setOpenImage] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [type, setType] = useState("pilkada");

  const [kertasSuara, setKertasSuara] = useState("");
  const [suaraSah, setSuaraSah] = useState("");
  const [suaraTidakSah, setSuaraTidakSah] = useState("");
  const [image, setImage] = useState(null);
  const [paslon, setPaslon] = useState([]);

  const showNotification = useNotif();

  useEffect(() => {
    const getSuaraById = () => {
      setLoading(true);
      let config = {
        method: "get",
        url: `/suara/${type}/tps/${id}`,
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      };
      instance
        .request(config)
        .then((res) => {
          setData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setData(null);
          setLoading(false);
        });
    };
    const getDataById = () => {
      instance
        .request({
          method: "get",
          url: `/tps/id/${id}`,
          headers: { Authorization: `Bearer ${Cookies.get("token")}` },
        })
        .then((res) => {
          setDataById(res.data);
          setKertasSuara(res.data[type]?.kertasSuara);
          setSuaraSah(res.data[type]?.suaraSah);
          setSuaraTidakSah(res.data[type]?.suaraTidakSah);
          setPaslon(
            res.data[type === "pilgub" ? "pilgubSuara" : "pilkadaSuara"]
              .suaraPaslon
          );
        });
    };
    getDataById();
    getSuaraById();
  }, [id, type]);

  useEffect(() => {
    const totalSuaraSah = paslon.reduce(
      (sum, item) => sum + Number(item.suaraSah || 0),
      0
    );
    setSuaraSah(totalSuaraSah);
  }, [paslon]);

  const menuSwitch = [
    {
      name: "Pilkada KBB",
      value: "pilkada",
    },
    {
      name: "Pilkada Jabar",
      value: "pilgub",
    },
  ];

  const handleUpdate = () => {
    let data = {
      kertasSuara: Number(kertasSuara),
      suaraSah: Number(suaraSah),
      suaraTidakSah: Number(suaraTidakSah),
      suaraTidakTerpakai: Number(kertasSuara - (suaraSah + suaraTidakSah)),
      [type === "pilgub" ? "pilgubPaslon" : "pilkadaPaslon"]: paslon,
    };

    let config = {
      method: "patch",
      url: `/tps/update/${type}/${id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      data: data,
    };

    instance
      .request(config)
      .then((res) => {
        setIsEdit(false);
        showNotification("Berhasil memperbarui data", "success");
      })
      .catch((err) => {
        console.log(err);
        showNotification("Gagal memperbarui data", "error");
      });
  };

  return (
    <>
      <div className="w-full h-screen flex items-center justify-center  fixed z-10 inset-0 bg-black bg-opacity-30">
        <div className="w-[90%] md:w-[50%] lg:w-2/4 bg-white rounded-lg flex flex-col gap-4 p-6">
          <div>
            <h1 className="font-semibold text-xl">Detail TPS</h1>
            <p className="text-sm text-gray-600">Suara yang telah diterima</p>
            <div className="flex items-center justify-between">
              {!isEdit && (
                <Switch menu={menuSwitch} value={type} setValue={setType} />
              )}
              <button
                onClick={() => setIsEdit(!isEdit)}
                className="underline mt-3 "
              >
                {isEdit ? "Batal" : "Edit"}
              </button>
            </div>
          </div>
          {loading ? (
            <Loading />
          ) : isEdit ? (
            <div className="flex w-full gap-6">
              <div className="flex w-1/2 flex-col gap-1">
                {paslon.map((item, index) => (
                  <Input
                    key={index}
                    label={`Paslon ${index + 1}`}
                    value={item.suaraSah}
                    setValue={(newValue) => {
                      setPaslon((prev) =>
                        prev.map((paslonItem, paslonIndex) =>
                          paslonIndex === index
                            ? { ...paslonItem, suaraSah: Number(newValue) }
                            : paslonItem
                        )
                      );
                    }}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-1">
                <Input
                  label="Suara Sah"
                  value={suaraSah}
                  setValue={setSuaraSah}
                />
                <Input
                  label="Suara Tidak Sah"
                  value={suaraTidakSah}
                  setValue={setSuaraTidakSah}
                />
                <Input
                  label="Kertas Suara"
                  value={kertasSuara}
                  setValue={setKertasSuara}
                />
                {/* <InputImage value={image} setValue={setImage} label={"Foto"} /> */}
              </div>
            </div>
          ) : (
            <>
              {data ? (
                <>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Kecamatan</span>
                      <span className="text-gray-600">
                        {data?.tps?.kecamatan}
                      </span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Desa</span>
                      <span className="text-gray-600">{data?.tps?.desa}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Nomor TPS</span>
                      <span className="text-gray-600">
                        {data?.tps?.kodeTPS}
                      </span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Suara Sah</span>
                      <span className="text-gray-600">
                        {data?.tps?.[type]?.suaraSah} Suara
                      </span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Suara Tidak Sah</span>
                      <span className="text-gray-600">
                        {data?.tps?.[type]?.suaraTidakSah} Suara
                      </span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Suara Tidak Terpakai</span>
                      <span className="text-gray-600">
                        {data?.tps?.[type]?.suaraTidakTerpakai} Suara
                      </span>
                    </div>
                    <hr />
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Kertas Suara</span>
                      <span className="text-gray-600">
                        {data?.tps?.[type]?.kertasSuara} Kertas
                      </span>
                    </div>
                    <hr />
                  </div>
                  <div className="space-y-1">
                    {data?.suaraPaslon?.map((paslon, index) => (
                      <ProgressBar
                        key={index}
                        text={
                          `(${paslon?.paslon?.noUrut}) ` +
                          paslon?.paslon?.panggilan
                        }
                        current={paslon?.suaraSah}
                        total={data?.tps?.[type]?.suaraSah}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col  gap-6 items-center justify-center h-64">
                  <img src={NoData} className="w-40" />
                  <p className="text-gray-500 text-sm">belum terinput.</p>
                </div>
              )}
            </>
          )}

          {isEdit ? (
            <Button text={"Simpan"} onClick={handleUpdate} size={"sm"} />
          ) : (
            <>
              <div className="flex gap-3">
                {data && (
                  <Button
                    text={"Lihat Gambar"}
                    onClick={() => setOpenImage(true)}
                    size={"sm"}
                    outline={true}
                  />
                )}
                <Button text={"Tutup"} onClick={onCancel} size={"sm"} />
              </div>
            </>
          )}
        </div>
      </div>
      {openImage && (
        <Image url={data?.image} onCancel={() => setOpenImage(false)} />
      )}
    </>
  );
}
