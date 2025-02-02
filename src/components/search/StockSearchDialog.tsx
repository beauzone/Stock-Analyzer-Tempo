import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Loader2, Plus, Minus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useWatchlistStore } from "@/lib/store/watchlistStore";

interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
}

interface StockSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (symbol: string) => void;
}

const searchStocks = async (query: string): Promise<SearchResult[]> => {
  try {
    const response = await fetch(
      `https://api.polygon.io/v3/reference/tickers?search=${encodeURIComponent(query)}&active=true&sort=ticker&order=asc&limit=10&apiKey=${import.meta.env.VITE_POLYGON_API_KEY}`,
    );
    const data = await response.json();

    return data.results.map((result: any) => ({
      symbol: result.ticker,
      name: result.name,
      exchange: result.primary_exchange,
    }));
  } catch (error) {
    console.error("Error searching stocks:", error);
    return [];
  }
};

export default function StockSearchDialog({
  open,
  onOpenChange,
  onSelect,
}: StockSearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { watchlists, addToWatchlist, removeFromWatchlist } =
    useWatchlistStore();
  const defaultWatchlist = watchlists[0];

  const isInWatchlist = (symbol: string) => {
    return defaultWatchlist?.stocks.some((stock) => stock.symbol === symbol);
  };

  const handleToggleWatchlist = (symbol: string, name: string) => {
    if (!defaultWatchlist) return;

    if (isInWatchlist(symbol)) {
      const stockToRemove = defaultWatchlist.stocks.find(
        (s) => s.symbol === symbol,
      );
      if (stockToRemove) {
        removeFromWatchlist(defaultWatchlist.id, stockToRemove.id);
      }
    } else {
      addToWatchlist(defaultWatchlist.id, symbol, name);
    }
  };

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await searchStocks(value);
      setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (symbol: string) => {
    onSelect(symbol);
    onOpenChange(false);
    setQuery("");
    setResults([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search Stocks</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by symbol or company name..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              {results.map((result, index) => (
                <div key={result.symbol}>
                  {index > 0 && <Separator className="my-2" />}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      className="flex-1 justify-start text-left"
                      onClick={() => handleSelect(result.symbol)}
                    >
                      <div className="flex flex-col items-start">
                        <div className="font-medium">{result.symbol}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[280px]">
                          {result.name}
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        handleToggleWatchlist(result.symbol, result.name)
                      }
                    >
                      {isInWatchlist(result.symbol) ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : query.length > 0 ? (
            <div className="text-center text-muted-foreground">
              No results found
            </div>
          ) : null}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
