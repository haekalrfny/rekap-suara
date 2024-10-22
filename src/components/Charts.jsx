import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Loading from "./Loading";
import { useStateContext } from "../context/StateContext";
import ChartLoading from "./Load/ChartLoading";

export default function Charts({ title, subtitle, data, name, value, color }) {
  const { loading } = useStateContext();
  return (
    <>
      {loading ? (
        <ChartLoading />
      ) : (
        <div className="p-6 w-full">
          <h2 className="text-2xl font-semibold mb-2">{title}</h2>
          <p className="text-gray-600 mb-4">{subtitle}</p>
          {!data || data.length === 0 ? (
            <div className="w-full h-[200px] flex items-center justify-center">
              <p className="text-gray-500 text-sm">Data tidak ada</p>
            </div>
          ) : (
            <div className="min-w-[90%] md:min-w-[400px]">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="1 1" />
                  <XAxis dataKey={name} tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="bump"
                    dataKey={value}
                    stroke={color || "black"}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </>
  );
}
