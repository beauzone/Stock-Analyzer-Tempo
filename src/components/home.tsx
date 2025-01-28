import React from "react";
import Sidebar from "./layout/Sidebar";
import ChartContainer from "./chart/ChartContainer";
import AnalysisTabs from "./analysis/AnalysisTabs";

interface HomeProps {
  watchlists?: Array<{
    id: string;
    name: string;
    stocks: Array<{
      id: string;
      symbol: string;
      name: string;
      price: number;
      change: number;
    }>;
  }>;
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
  news?: Array<{
    id: string;
    title: string;
    source: string;
    timestamp: string;
    summary: string;
  }>;
  onSelectStock?: (symbol: string) => void;
  onAddWatchlist?: () => void;
  onAddToWatchlist?: (watchlistId: string) => void;
  onAddChart?: () => void;
  onCloseChart?: (id: string) => void;
  onSelectChart?: (id: string) => void;
  onAnalyze?: (query: string) => Promise<string>;
  isAnalyzing?: boolean;
  aiAnalysis?: string;
}

const Home = ({
  watchlists = [
    {
      id: "1",
      name: "My Watchlist",
      stocks: [
        {
          id: "1",
          symbol: "AAPL",
          name: "Apple Inc.",
          price: 150.23,
          change: 1.2,
        },
        {
          id: "2",
          symbol: "GOOGL",
          name: "Alphabet Inc.",
          price: 2789.45,
          change: -0.5,
        },
      ],
    },
  ],
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
  ],
  news = [
    {
      id: "1",
      title: "Market Rally Continues as Tech Stocks Surge",
      source: "Financial Times",
      timestamp: "2 hours ago",
      summary:
        "Major technology stocks led a broad market rally as investors responded positively to recent earnings reports...",
    },
  ],
  onSelectStock = () => {},
  onAddWatchlist = () => {},
  onAddToWatchlist = () => {},
  onAddChart = () => {},
  onCloseChart = () => {},
  onSelectChart = () => {},
  onAnalyze = async (query: string) => `AI analysis for: ${query}`,
  isAnalyzing = false,
  aiAnalysis = "No analysis available yet. Try asking a question about the stock.",
}: HomeProps) => {
  return (
    <div className="h-screen w-screen bg-background flex overflow-hidden">
      <Sidebar
        watchlists={watchlists}
        onSelectStock={onSelectStock}
        onAddWatchlist={onAddWatchlist}
        onAddToWatchlist={onAddToWatchlist}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChartContainer
          charts={charts}
          onAddChart={onAddChart}
          onCloseChart={onCloseChart}
          onSelectChart={onSelectChart}
        />
        <AnalysisTabs
          symbol={charts.find((chart) => chart.isActive)?.symbol}
          news={news}
          onAnalyze={onAnalyze}
          isLoading={isAnalyzing}
          aiAnalysis={aiAnalysis}
        />
      </div>
    </div>
  );
};

export default Home;
