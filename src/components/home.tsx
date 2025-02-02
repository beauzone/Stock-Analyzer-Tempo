import React from "react";
import Sidebar from "./layout/Sidebar";
import ChartContainer from "./chart/ChartContainer";
import AnalysisTabs from "./analysis/AnalysisTabs";
import { useStockStore } from "@/lib/store/stockStore";
import { useWatchlistStore } from "@/lib/store/watchlistStore";

const Home = () => {
  const { watchlists } = useWatchlistStore();
  const { charts, aiAnalysis, addChart, analyzeStock } = useStockStore();

  React.useEffect(() => {
    if (watchlists[0]?.stocks[0]?.symbol && charts.length === 0) {
      addChart(watchlists[0].stocks[0].symbol);
    }
  }, [watchlists, charts, addChart]);

  const activeChart = charts.find((chart) => chart.isActive);

  return (
    <div className="h-full w-full bg-background flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChartContainer />
        <AnalysisTabs
          symbol={activeChart?.symbol}
          onAnalyze={(query) =>
            activeChart && analyzeStock(activeChart.id, query)
          }
          isLoading={false}
          aiAnalysis={activeChart ? aiAnalysis[activeChart.id] : undefined}
        />
      </div>
    </div>
  );
};

export default Home;
