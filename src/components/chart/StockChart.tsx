import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

interface StockChartProps {
  symbol?: string;
  data?: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
  timeframe?: "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y";
  chartType?: "candlestick" | "line" | "bar";
}

const StockChart = ({
  symbol = "AAPL",
  data = [
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
    {
      date: "2024-01-03",
      open: 107,
      high: 110,
      low: 105,
      close: 106,
      volume: 900000,
    },
  ],
  timeframe = "1D",
  chartType = "candlestick",
}: StockChartProps) => {
  return (
    <Card className="w-full h-[560px] bg-background p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">{symbol}</h2>
          <span className="text-muted-foreground">$150.23 (+1.2%)</span>
        </div>

        <div className="flex items-center gap-2">
          <Select defaultValue={chartType}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="candlestick">Candlestick</SelectItem>
              <SelectItem value="line">Line</SelectItem>
              <SelectItem value="bar">Bar</SelectItem>
            </SelectContent>
          </Select>

          <Tabs defaultValue={timeframe} className="w-[300px]">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="1D">1D</TabsTrigger>
              <TabsTrigger value="1W">1W</TabsTrigger>
              <TabsTrigger value="1M">1M</TabsTrigger>
              <TabsTrigger value="3M">3M</TabsTrigger>
              <TabsTrigger value="1Y">1Y</TabsTrigger>
              <TabsTrigger value="5Y">5Y</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="relative h-[400px] bg-card rounded-md p-4 mb-4">
        {/* Placeholder for actual chart implementation */}
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          Chart Visualization Area
        </div>

        {/* Chart Controls */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Volume Panel */}
      <div className="h-[60px] bg-card rounded-md p-2">
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          Volume Chart Area
        </div>
      </div>
    </Card>
  );
};

export default StockChart;
