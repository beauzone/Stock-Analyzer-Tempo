import React from "react";
import StockSearchDialog from "../search/StockSearchDialog";
import ChartTabs from "./ChartTabs";
import StockChart from "./StockChart";
import { useStockStore } from "@/lib/store/stockStore";

const ChartContainer = () => {
  const {
    charts,
    settings,
    addChart,
    removeChart,
    setActiveChart,
    updateChartSettings,
  } = useStockStore();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const activeChart = charts.find((chart) => chart.isActive) || charts[0];
  const activeChartSettings = activeChart ? settings[activeChart.id] : null;

  return (
    <div className="w-full h-full bg-background flex flex-col">
      <ChartTabs
        tabs={charts.map((chart) => ({
          id: chart.id,
          symbol: chart.symbol,
          isActive: chart.isActive,
        }))}
        onAddTab={() => setIsSearchOpen(true)}
        onCloseTab={removeChart}
        onSelectTab={setActiveChart}
      />
      <div className="flex-1 p-4">
        {activeChart && (
          <StockChart
            symbol={activeChart.symbol}
            data={activeChart.data}
            isLoading={activeChart.isLoading}
            error={activeChart.error}
            timeframe={activeChartSettings?.timeframe}
            chartType={activeChartSettings?.chartType}
            onTimeframeChange={(timeframe) =>
              activeChart && updateChartSettings(activeChart.id, { timeframe })
            }
            onChartTypeChange={(chartType) =>
              activeChart && updateChartSettings(activeChart.id, { chartType })
            }
          />
        )}
      </div>
      <StockSearchDialog
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        onSelect={addChart}
      />
    </div>
  );
};

export default ChartContainer;
