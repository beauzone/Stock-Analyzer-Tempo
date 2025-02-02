import React, { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { StockDataPoint } from "@/lib/api/yahoo";
import ChartRenderer from "./ChartRenderer";
import ChartSettings from "./ChartSettings";

interface StockChartProps {
  symbol?: string;
  data?: StockDataPoint[];
  isLoading?: boolean;
  error?: string;
  timeframe?: string;
  chartType?: "candlestick" | "line" | "bar";
  onTimeframeChange?: (timeframe: string) => void;
  onChartTypeChange?: (type: "candlestick" | "line" | "bar") => void;
}

const StockChart = ({
  symbol = "AAPL",
  data = [],
  isLoading = false,
  error,
  timeframe = "1D",
  chartType = "line",
  onTimeframeChange,
  onChartTypeChange,
}: StockChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartSettings, setChartSettings] = React.useState({
    showGrid: true,
    showVolume: true,
    showLegend: true,
    theme: "light",
    lineWidth: 2,
    gridOpacity: 0.1,
    upColor: "#26a69a",
    downColor: "#ef5350",
    indicators: [],
    indicatorSettings: {},
  });

  return (
    <Card className="w-full h-[560px] bg-background p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{symbol}</h2>
        <div className="flex items-center gap-2">
          <ChartSettings
            settings={chartSettings}
            onSettingsChange={setChartSettings}
          />
        </div>
      </div>

      <div
        className="relative h-[400px] bg-card rounded-md p-4 mb-4"
        ref={chartContainerRef}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center text-destructive">
            {error}
          </div>
        ) : data && data.length > 0 ? (
          <ChartRenderer
            data={data}
            type={chartType}
            containerRef={chartContainerRef}
            indicators={chartSettings.indicators}
            indicatorSettings={chartSettings.indicatorSettings}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        )}
      </div>
    </Card>
  );
};

export default StockChart;
