import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { StockDataPoint } from "@/lib/api/yahoo";

interface VolumeChartProps {
  data: StockDataPoint[];
  upColor?: string;
  downColor?: string;
}

const VolumeChart: React.FC<VolumeChartProps> = ({
  data,
  upColor = "#26a69a",
  downColor = "#ef5350",
}) => {
  // Add previous close price to determine if each bar should be green or red
  const volumeData = data.map((point, index) => ({
    ...point,
    color:
      index > 0
        ? point.close >= data[index - 1].close
          ? upColor
          : downColor
        : upColor,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={volumeData}>
        <XAxis
          dataKey="date"
          tickFormatter={(date) => new Date(date).toLocaleDateString()}
          height={20}
          tick={{ fontSize: 10 }}
        />
        <YAxis
          tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
          width={60}
          tick={{ fontSize: 10 }}
        />
        <Tooltip
          labelFormatter={(date) => new Date(date).toLocaleDateString()}
          formatter={(value: any) => [
            `${(value / 1000000).toFixed(1)}M`,
            "Volume",
          ]}
        />
        <Bar dataKey="volume" fill="currentColor" opacity={0.8} stroke="none">
          {volumeData.map((entry, index) => (
            <cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default VolumeChart;
