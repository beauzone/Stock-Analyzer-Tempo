import React from "react";
import ChartTabs from "./ChartTabs";
import StockChart from "./StockChart";

interface ChartContainerProps {
  charts?: Array<{
    id: string;
    symbol: string;
    isActive: boolean;
    data?: Array<{
      date: string;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    }>;
  }>;
  onAddChart?: () => void;
  onCloseChart?: (id: string) => void;
  onSelectChart?: (id: string) => void;
}

const ChartContainer = ({
  charts = [
    {
      id: "1",
      symbol: "AAPL",
      isActive: true,
      data: [
        {
          date: "2024-01-01",
          open: 100,
          high: 105,
          low: 98,
          close: 102,
          volume: 1000000,
        },
        {
          date: "2024-01-02",
          open: 102,
          high: 108,
          low: 101,
          close: 107,
          volume: 1200000,
        },
      ],
    },
    {
      id: "2",
      symbol: "GOOGL",
      isActive: false,
      data: [
        {
          date: "2024-01-01",
          open: 150,
          high: 155,
          low: 148,
          close: 152,
          volume: 800000,
        },
        {
          date: "2024-01-02",
          open: 152,
          high: 158,
          low: 151,
          close: 157,
          volume: 900000,
        },
      ],
    },
  ],
  onAddChart = () => {},
  onCloseChart = () => {},
  onSelectChart = () => {},
}: ChartContainerProps) => {
  const activeChart = charts.find((chart) => chart.isActive) || charts[0];

  return (
    <div className="w-full h-full bg-background flex flex-col">
      <ChartTabs
        tabs={charts.map((chart) => ({
          id: chart.id,
          symbol: chart.symbol,
          isActive: chart.isActive,
        }))}
        onAddTab={onAddChart}
        onCloseTab={onCloseChart}
        onSelectTab={onSelectChart}
      />
      <div className="flex-1 p-4">
        <StockChart symbol={activeChart?.symbol} data={activeChart?.data} />
      </div>
    </div>
  );
};

export default ChartContainer;
