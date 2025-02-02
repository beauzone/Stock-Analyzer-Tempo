import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { fetchStockData, StockDataPoint } from "../api/yahoo";
import {
  WatchlistStateSchema,
  ValidatedWatchlistState,
} from "./watchlistValidation";

export interface WatchlistStock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  data?: StockDataPoint[];
  lastUpdated?: string;
}

export interface Watchlist {
  id: string;
  name: string;
  stocks: WatchlistStock[];
  createdAt?: string;
  updatedAt?: string;
}

interface WatchlistState extends ValidatedWatchlistState {
  addWatchlist: (name: string) => void;
  removeWatchlist: (id: string) => void;
  addToWatchlist: (watchlistId: string, symbol: string, name: string) => void;
  removeFromWatchlist: (watchlistId: string, stockId: string) => void;
  updateStockPrice: (
    watchlistId: string,
    stockId: string,
    price: number,
    change: number,
  ) => void;
  exportData: () => string;
  importData: (jsonData: string) => void;
}

// Custom storage with migration handling
const storage = createJSONStorage(() => localStorage, {
  reviver: (key, value) => {
    if (
      typeof value === "string" &&
      value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    ) {
      return new Date(value);
    }
    return value;
  },
});

// Migration functions
const migrations = {
  0: (state: any) => ({
    ...state,
    version: 1,
    watchlists: state.watchlists.map((list: Watchlist) => ({
      ...list,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stocks: list.stocks.map((stock) => ({
        ...stock,
        lastUpdated: new Date().toISOString(),
      })),
    })),
  }),
  1: (state: any) => ({
    ...state,
    version: 2,
    watchlists: state.watchlists.map((list: Watchlist) => ({
      ...list,
      updatedAt: new Date().toISOString(),
    })),
  }),
  2: (state: any) => ({
    ...state,
    version: 3,
    watchlists: [
      {
        id: "1",
        name: "Watchlist",
        stocks: [
          {
            id: "aapl",
            symbol: "AAPL",
            name: "Apple Inc.",
            price: 0,
            change: 0,
            lastUpdated: new Date().toISOString(),
          },
          {
            id: "crwd",
            symbol: "CRWD",
            name: "CrowdStrike Holdings, Inc.",
            price: 0,
            change: 0,
            lastUpdated: new Date().toISOString(),
          },
          {
            id: "panw",
            symbol: "PANW",
            name: "Palo Alto Networks, Inc.",
            price: 0,
            change: 0,
            lastUpdated: new Date().toISOString(),
          },
          {
            id: "tsla",
            symbol: "TSLA",
            name: "Tesla, Inc.",
            price: 0,
            change: 0,
            lastUpdated: new Date().toISOString(),
          },
          {
            id: "nflx",
            symbol: "NFLX",
            name: "Netflix, Inc.",
            price: 0,
            change: 0,
            lastUpdated: new Date().toISOString(),
          },
          {
            id: "qqq",
            symbol: "QQQ",
            name: "Invesco QQQ Trust",
            price: 0,
            change: 0,
            lastUpdated: new Date().toISOString(),
          },
          {
            id: "spy",
            symbol: "SPY",
            name: "SPDR S&P 500 ETF Trust",
            price: 0,
            change: 0,
            lastUpdated: new Date().toISOString(),
          },
          {
            id: "msft",
            symbol: "MSFT",
            name: "Microsoft Corporation",
            price: 0,
            change: 0,
            lastUpdated: new Date().toISOString(),
          },
          {
            id: "meta",
            symbol: "META",
            name: "Meta Platforms, Inc.",
            price: 0,
            change: 0,
            lastUpdated: new Date().toISOString(),
          },
          {
            id: "amzn",
            symbol: "AMZN",
            name: "Amazon.com, Inc.",
            price: 0,
            change: 0,
            lastUpdated: new Date().toISOString(),
          },
          {
            id: "goog",
            symbol: "GOOG",
            name: "Alphabet Inc.",
            price: 0,
            change: 0,
            lastUpdated: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  }),
};

export const useWatchlistStore = create<WatchlistState>(
  persist(
    (set, get) => ({
      version: 3,
      watchlists: [
        {
          id: "1",
          name: "Watchlist",
          stocks: [
            {
              id: "aapl",
              symbol: "AAPL",
              name: "Apple Inc.",
              price: 0,
              change: 0,
              lastUpdated: new Date().toISOString(),
            },
            {
              id: "crwd",
              symbol: "CRWD",
              name: "CrowdStrike Holdings, Inc.",
              price: 0,
              change: 0,
              lastUpdated: new Date().toISOString(),
            },
            {
              id: "panw",
              symbol: "PANW",
              name: "Palo Alto Networks, Inc.",
              price: 0,
              change: 0,
              lastUpdated: new Date().toISOString(),
            },
            {
              id: "tsla",
              symbol: "TSLA",
              name: "Tesla, Inc.",
              price: 0,
              change: 0,
              lastUpdated: new Date().toISOString(),
            },
            {
              id: "nflx",
              symbol: "NFLX",
              name: "Netflix, Inc.",
              price: 0,
              change: 0,
              lastUpdated: new Date().toISOString(),
            },
            {
              id: "qqq",
              symbol: "QQQ",
              name: "Invesco QQQ Trust",
              price: 0,
              change: 0,
              lastUpdated: new Date().toISOString(),
            },
            {
              id: "spy",
              symbol: "SPY",
              name: "SPDR S&P 500 ETF Trust",
              price: 0,
              change: 0,
              lastUpdated: new Date().toISOString(),
            },
            {
              id: "msft",
              symbol: "MSFT",
              name: "Microsoft Corporation",
              price: 0,
              change: 0,
              lastUpdated: new Date().toISOString(),
            },
            {
              id: "meta",
              symbol: "META",
              name: "Meta Platforms, Inc.",
              price: 0,
              change: 0,
              lastUpdated: new Date().toISOString(),
            },
            {
              id: "amzn",
              symbol: "AMZN",
              name: "Amazon.com, Inc.",
              price: 0,
              change: 0,
              lastUpdated: new Date().toISOString(),
            },
            {
              id: "goog",
              symbol: "GOOG",
              name: "Alphabet Inc.",
              price: 0,
              change: 0,
              lastUpdated: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      addWatchlist: (name) => {
        console.log("[addWatchlist] Starting with name:", name);

        set((state) => {
          console.log("[addWatchlist] Current state:", state);
          console.log("[addWatchlist] Current watchlists:", state.watchlists);

          const newWatchlist = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            stocks: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          console.log("[addWatchlist] Created new watchlist:", newWatchlist);

          const updatedWatchlists = [...state.watchlists, newWatchlist];
          console.log(
            "[addWatchlist] Updated watchlists array:",
            updatedWatchlists,
          );

          const newState = {
            version: state.version,
            watchlists: updatedWatchlists,
          };

          try {
            console.log(
              "[addWatchlist] About to validate new state:",
              newState,
            );
            const validatedState = WatchlistStateSchema.parse(newState);
            console.log(
              "[addWatchlist] Validation successful. Validated state:",
              validatedState,
            );
            return validatedState;
          } catch (error) {
            console.error("[addWatchlist] Validation error:", error);
            return state;
          }
        });

        const currentState = get();
        console.log("[addWatchlist] State after update:", currentState);
      },
      removeWatchlist: (id) =>
        set((state) => {
          const newState = {
            watchlists: state.watchlists.filter((list) => list.id !== id),
          };
          try {
            WatchlistStateSchema.parse(newState);
            return newState;
          } catch (error) {
            console.error("Validation error:", error);
            return state;
          }
        }),
      addToWatchlist: (watchlistId, symbol, name) =>
        set((state) => {
          const newState = {
            watchlists: state.watchlists.map((list) =>
              list.id === watchlistId
                ? {
                    ...list,
                    updatedAt: new Date().toISOString(),
                    stocks: [
                      ...list.stocks,
                      {
                        id: Math.random().toString(36).substr(2, 9),
                        symbol,
                        name,
                        price: 0,
                        change: 0,
                        lastUpdated: new Date().toISOString(),
                      },
                    ],
                  }
                : list,
            ),
          };
          try {
            WatchlistStateSchema.parse(newState);
            return newState;
          } catch (error) {
            console.error("Validation error:", error);
            return state;
          }
        }),
      removeFromWatchlist: (watchlistId, stockId) =>
        set((state) => {
          const newState = {
            watchlists: state.watchlists.map((list) =>
              list.id === watchlistId
                ? {
                    ...list,
                    updatedAt: new Date().toISOString(),
                    stocks: list.stocks.filter((stock) => stock.id !== stockId),
                  }
                : list,
            ),
          };
          try {
            WatchlistStateSchema.parse(newState);
            return newState;
          } catch (error) {
            console.error("Validation error:", error);
            return state;
          }
        }),
      updateStockPrice: (watchlistId, stockId, price, change) =>
        set((state) => {
          const newState = {
            watchlists: state.watchlists.map((list) =>
              list.id === watchlistId
                ? {
                    ...list,
                    stocks: list.stocks.map((stock) =>
                      stock.id === stockId
                        ? {
                            ...stock,
                            price,
                            change,
                            lastUpdated: new Date().toISOString(),
                          }
                        : stock,
                    ),
                  }
                : list,
            ),
          };
          try {
            WatchlistStateSchema.parse(newState);
            return newState;
          } catch (error) {
            console.error("Validation error:", error);
            return state;
          }
        }),
      exportData: () => {
        const state = get();
        return JSON.stringify({
          version: state.version,
          watchlists: state.watchlists,
        });
      },
      importData: (jsonData: string) => {
        try {
          const data = JSON.parse(jsonData);
          const validatedData = WatchlistStateSchema.parse(data);
          set({
            version: validatedData.version,
            watchlists: validatedData.watchlists,
          });
        } catch (error) {
          console.error("Invalid import data:", error);
          throw new Error("Invalid watchlist data format");
        }
      },
    }),
    {
      name: "watchlist-store",
      version: 3,
      storage,
      migrate: (persistedState: any, version: number) => {
        let state = persistedState;
        while (version < 3) {
          if (migrations[version]) {
            state = migrations[version](state);
          }
          version++;
        }
        try {
          return WatchlistStateSchema.parse(state);
        } catch (error) {
          console.error("Migration validation error:", error);
          return state;
        }
      },
      partialize: (state) => ({
        version: state.version,
        watchlists: state.watchlists.map((list) => ({
          ...list,
          stocks: list.stocks.map((stock) => ({
            id: stock.id,
            symbol: stock.symbol,
            name: stock.name,
            price: 0,
            change: 0,
            lastUpdated: stock.lastUpdated,
          })),
          createdAt: list.createdAt,
          updatedAt: list.updatedAt,
        })),
      }),
    },
  ),
);
