import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter,
  ComposedChart,
  Treemap,
  Sankey,
  RadarChart,
  Radar,
  PolarGrid,
} from "recharts";
import { useStateContext } from "../context/StateContext";
import ChartLoading from "./Load/ChartLoading";

const pilbupColors = ["#C2410C", "#1D4ED8", "#B91C1C", "#15803D", "#374151"];
const pilgubColors = ["#15803D", "#B91C1C", "#1D4ED8", "#d97706", "#374151"];

export default function Charts({
  title,
  subtitle,
  data,
  name,
  value,
  type,
  color,
}) {
  const { loading } = useStateContext();
  const [colors, setColors] = useState(
    color === "pilbup" ? pilbupColors : pilgubColors
  );

  return (
    <>
      {loading ? (
        <ChartLoading />
      ) : !data || data.length === 0 ? null : (
        <div className="p-6 w-full">
          <h2 className="text-2xl font-semibold mb-2">{title}</h2>
          <p className="text-gray-600 mb-4">{subtitle}</p>
          <div className="min-w-[90%] md:min-w-[400px]">
            <ResponsiveContainer width="100%" height={250}>
              {type === "bar" ? (
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="1 1" />
                  <XAxis dataKey={name} tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, "dataMax + 10%"]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={value} radius={[5, 5, 0, 0]}>
                    <LabelList
                      dataKey={value}
                      position="center"
                      formatter={(val) => {
                        const total = data.reduce(
                          (sum, item) => sum + item[value],
                          0
                        );
                        const percentage = ((val / total) * 100).toFixed(1);
                        return `${percentage}%`;
                      }}
                      style={{ fill: "#ffffff", fontSize: 12 }}
                    />
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              ) : type === "line" ? (
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="1 1" />
                  <XAxis dataKey={name} tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, "dataMax + 10%"]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey={value} stroke={colors[0]}>
                    <LabelList dataKey={value} position="top" />
                  </Line>
                </LineChart>
              ) : type === "pie" ? (
                <PieChart>
                  <Tooltip />
                  <Legend />
                  <Pie
                    data={data}
                    dataKey={value}
                    nameKey={name}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#000"
                    label
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              ) : type === "area" ? (
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="1 1" />
                  <XAxis dataKey={name} tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, "dataMax + 10%"]} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey={value}
                    stroke={colors[0]}
                    fillOpacity={0.5}
                    fill={colors[0]}
                  />
                </AreaChart>
              ) : type === "radialbar" ? (
                <RadialBarChart
                  width={250}
                  height={250}
                  innerRadius="10%"
                  outerRadius="80%"
                  data={data}
                >
                  <RadialBar
                    minAngle={15}
                    background
                    clockWise={true}
                    dataKey={value}
                    fill={colors[0]}
                  />
                  <Tooltip />
                </RadialBarChart>
              ) : type === "scatter" ? (
                <ScatterChart>
                  <CartesianGrid />
                  <XAxis dataKey={name} />
                  <YAxis />
                  <Tooltip />
                  <Scatter name="Data Points" data={data} fill={colors[0]} />
                </ScatterChart>
              ) : type === "composed" ? (
                <ComposedChart data={data}>
                  <XAxis dataKey={name} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={value} fill={colors[0]} />
                  <Line type="monotone" dataKey={value} stroke={colors[1]} />
                </ComposedChart>
              ) : type === "treemap" ? (
                <Treemap
                  width={400}
                  height={250}
                  data={data}
                  dataKey={value}
                  aspectRatio={1}
                  stroke="#fff"
                  fill={colors[0]}
                />
              ) : type === "sankey" ? (
                <Sankey
                  width={400}
                  height={250}
                  data={data}
                  node={{ color: colors[0] }}
                  link={{ color: colors[0] }}
                />
              ) : type === "radar" ? (
                <RadarChart outerRadius={90} data={data}>
                  <PolarGrid stroke="#d1d5db" />
                  <Radar
                    name={name}
                    dataKey={value}
                    stroke={colors[0]}
                    fill={colors[0]}
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                  <Legend />
                </RadarChart>
              ) : (
                <div className="text-red-500">Chart type tidak dikenal</div>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
}
