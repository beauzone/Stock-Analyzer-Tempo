import { useEffect } from "react";
import { useWatchlistStore } from "@/lib/store/watchlistStore";
import { stockWebSocket } from "@/lib/api/websocket";

export function useWatchlistPrices() {
  const { watchlists, updateStockPrice } = useWatchlistStore();

  useEffect(() => {
    // Subscribe to price updates for all stocks in all watchlists
    const subscriptions = new Set<string>();

    watchlists.forEach((watchlist) => {
      watchlist.stocks.forEach((stock) => {
        if (!subscriptions.has(stock.symbol)) {
          subscriptions.add(stock.symbol);

          stockWebSocket.subscribe(stock.symbol, (data) => {
            if (data.type === "price") {
              updateStockPrice(watchlist.id, stock.id, data.price, data.change);
            }
          });
        }
      });
    });

    // Cleanup subscriptions
    return () => {
      subscriptions.forEach((symbol) => {
        stockWebSocket.unsubscribe(symbol, () => {});
      });
    };
  }, [watchlists, updateStockPrice]);
}
