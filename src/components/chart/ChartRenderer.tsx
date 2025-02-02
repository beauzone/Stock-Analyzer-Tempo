import React, { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
  LineStyle,
} from "lightweight-charts";
import { StockDataPoint } from "@/lib/api/yahoo";

interface ChartRendererProps {
  data: StockDataPoint[];
  type: "candlestick" | "line" | "bar";
  containerRef: React.RefObject<HTMLDivElement>;
  indicators?: ("sma" | "ema" | "rsi" | "macd" | "none")[];
  indicatorSettings?: {
    sma?: { period: number };
    ema?: { period: number };
    rsi?: { period: number };
    macd?: { fastPeriod: number; slowPeriod: number; signalPeriod: number };
  };
}

const ChartRenderer: React.FC<ChartRendererProps> = ({
  data,
  type,
  containerRef,
  indicators = [],
  indicatorSettings = {},
}) => {
  const chartRef = useRef<IChartApi | null>(null);
  const mainSeriesRef = useRef<
    ISeriesApi<"Candlestick"> | ISeriesApi<"Line"> | ISeriesApi<"Bar"> | null
  >(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = () => {
      if (chartRef.current && containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        chartRef.current.applyOptions({
          width,
          height: height - 20, // Subtract padding
        });
      }
    };

    const { width, height } = containerRef.current.getBoundingClientRect();
    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "rgba(0, 0, 0, 0.9)",
      },
      grid: {
        vertLines: { color: "rgba(197, 203, 206, 0.1)" },
        horzLines: { color: "rgba(197, 203, 206, 0.1)" },
      },
      width,
      height: height - 20, // Subtract padding
    });

    chartRef.current = chart;

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    // Clear existing series
    if (mainSeriesRef.current) {
      chartRef.current.removeSeries(mainSeriesRef.current);
    }

    // Format data
    const formattedData = data.map((item) => ({
      time: Math.floor(new Date(item.date).getTime() / 1000),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      value: item.close, // for line chart
    }));

    // Create main series
    switch (type) {
      case "candlestick":
        mainSeriesRef.current = chartRef.current.addCandlestickSeries({
          upColor: "#26a69a",
          downColor: "#ef5350",
          borderVisible: false,
          wickUpColor: "#26a69a",
          wickDownColor: "#ef5350",
        });
        break;
      case "line":
        mainSeriesRef.current = chartRef.current.addLineSeries({
          color: "#2962FF",
          lineWidth: 2,
        });
        break;
      case "bar":
        mainSeriesRef.current = chartRef.current.addBarSeries({
          upColor: "#26a69a",
          downColor: "#ef5350",
        });
        break;
    }

    if (mainSeriesRef.current) {
      mainSeriesRef.current.setData(formattedData);
      chartRef.current.timeScale().fitContent();
    }
  }, [data, type]);

  return null;
};

export default ChartRenderer;
