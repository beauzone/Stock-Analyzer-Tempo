import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchStockData, StockDataPoint, isMarketOpen } from "../api/yahoo";
import { fetchHistoricalData as fetchPolygonData } from "../api/polygon";
import { stockWebSocket } from "../api/websocket";
import { chartCache } from "../cache/chartCache";
import { analyzeStock } from "../api/openai";

interface ChartSettings {
  timeframe: "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y" | "custom";
  chartType: "candlestick" | "line" | "bar";
}

interface StockState {
  currentPrices: { [symbol: string]: { price: number; change: number } };
  activeChartId: string | null;
  settings: { [chartId: string]: ChartSettings };
  aiAnalysis: { [chartId: string]: string };
  charts: {
    id: string;
    symbol: string;
    isActive: boolean;
    data?: StockDataPoint[];
    isLoading: boolean;
    error?: string;
  }[];
  addChart: (symbol: string) => void;
  removeChart: (id: string) => void;
  setActiveChart: (id: string) => void;
  updateChartData: (id: string, data: StockDataPoint[]) => void;
  setChartError: (id: string, error: string) => void;
  setChartLoading: (id: string, isLoading: boolean) => void;
  updateChartSettings: (id: string, settings: Partial<ChartSettings>) => void;
  fetchChartData: (id: string, timeframe?: string) => Promise<void>;
  analyzeStock: (id: string, query: string) => Promise<void>;
}

export const useStockStore = create<StockState>(
  persist(
    (set, get) => ({
      currentPrices: {},
      activeChartId: null,
      settings: {},
      aiAnalysis: {},
      charts: [],

      addChart: (symbol: string) => {
        set((state) => {
          // Check if there's already a chart with this symbol
          const existingChart = state.charts.find((c) => c.symbol === symbol);
          if (existingChart) {
            // If found, just make it active
            return {
              charts: state.charts.map((c) => ({
                ...c,
                isActive: c.id === existingChart.id,
              })),
              activeChartId: existingChart.id,
            };
          }

          // If not found, create a new chart
          const id = Math.random().toString(36).substr(2, 9);
          const newChart = {
            id,
            symbol,
            isActive: true,
            isLoading: true,
          };

          const updatedCharts = state.charts.map((c) => ({
            ...c,
            isActive: false,
          }));
          updatedCharts.push(newChart);

          return {
            charts: updatedCharts,
            activeChartId: id,
            settings: {
              ...state.settings,
              [id]: { timeframe: "1D", chartType: "line" },
            },
          };
        });

        // Only fetch data if it's a new chart
        const state = get();
        const chart = state.charts.find((c) => c.symbol === symbol);
        if (chart && !chart.data) {
          get().fetchChartData(chart.id);
        }
      },

      removeChart: (id: string) =>
        set((state) => {
          const updatedCharts = state.charts.filter((c) => c.id !== id);
          const newSettings = { ...state.settings };
          delete newSettings[id];

          return {
            charts: updatedCharts,
            settings: newSettings,
            activeChartId:
              id === state.activeChartId
                ? updatedCharts[0]?.id || null
                : state.activeChartId,
          };
        }),

      setActiveChart: (id: string) =>
        set((state) => ({
          charts: state.charts.map((c) => ({ ...c, isActive: c.id === id })),
          activeChartId: id,
        })),

      updateChartData: (id: string, data: StockDataPoint[]) =>
        set((state) => ({
          charts: state.charts.map((c) =>
            c.id === id ? { ...c, data, isLoading: false } : c,
          ),
        })),

      setChartError: (id: string, error: string) =>
        set((state) => ({
          charts: state.charts.map((c) =>
            c.id === id ? { ...c, error, isLoading: false } : c,
          ),
        })),

      setChartLoading: (id: string, isLoading: boolean) =>
        set((state) => ({
          charts: state.charts.map((c) =>
            c.id === id ? { ...c, isLoading } : c,
          ),
        })),

      updateChartSettings: (id: string, settings: Partial<ChartSettings>) =>
        set((state) => {
          const newSettings = {
            ...state.settings,
            [id]: { ...state.settings[id], ...settings },
          };
          return { settings: newSettings };
        }),

      fetchChartData: async (id, timeframe) => {
        const state = get();
        const chart = state.charts.find((c) => c.id === id);
        if (!chart) return;

        set((state) => ({
          charts: state.charts.map((c) =>
            c.id === id ? { ...c, isLoading: true, error: undefined } : c,
          ),
        }));

        try {
          const data = await fetchStockData(chart.symbol, "1d", "1mo");
          if (!data || data.length === 0) throw new Error("No data received");
          console.log("Fetched data:", data);

          set((state) => ({
            charts: state.charts.map((c) =>
              c.id === id ? { ...c, data, isLoading: false } : c,
            ),
          }));
        } catch (error) {
          console.error("Error fetching chart data:", error);
          set((state) => ({
            charts: state.charts.map((c) =>
              c.id === id
                ? { ...c, error: error.message, isLoading: false }
                : c,
            ),
          }));
        }
      },

      analyzeStock: async (id: string, query: string) => {
        const state = get();
        const chart = state.charts.find((c) => c.id === id);
        if (!chart) return;

        try {
          const analysis = await analyzeStock(chart.symbol, query, chart.data);
          set((state) => ({
            aiAnalysis: { ...state.aiAnalysis, [id]: analysis },
          }));
        } catch (error) {
          console.error("Error analyzing stock:", error);
        }
      },
    }),
    {
      name: "stock-store",
      partialize: (state) => ({
        settings: state.settings,
        charts: state.charts.map((chart) => ({
          id: chart.id,
          symbol: chart.symbol,
          isActive: chart.isActive,
        })),
      }),
    },
  ),
);
