import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Star, Plus, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
}

interface Watchlist {
  id: string;
  name: string;
  stocks: WatchlistItem[];
}

interface SidebarProps {
  watchlists?: Watchlist[];
  onSelectStock?: (symbol: string) => void;
  onAddWatchlist?: () => void;
  onAddToWatchlist?: (watchlistId: string) => void;
}

const Sidebar = ({
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
        {
          id: "3",
          symbol: "MSFT",
          name: "Microsoft Corp.",
          price: 290.12,
          change: 0.8,
        },
      ],
    },
    {
      id: "2",
      name: "Tech Stocks",
      stocks: [
        {
          id: "4",
          symbol: "NVDA",
          name: "NVIDIA Corp.",
          price: 450.78,
          change: 2.3,
        },
        {
          id: "5",
          symbol: "AMD",
          name: "Advanced Micro Devices",
          price: 120.34,
          change: 1.7,
        },
      ],
    },
  ],
  onSelectStock = () => {},
  onAddWatchlist = () => {},
  onAddToWatchlist = () => {},
}: SidebarProps) => {
  return (
    <div className="w-[280px] h-full bg-background border-r flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search stocks..." className="pl-8" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {watchlists.map((watchlist) => (
            <Card key={watchlist.id} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">{watchlist.name}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onAddToWatchlist(watchlist.id)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {watchlist.stocks.map((stock) => (
                  <Button
                    key={stock.id}
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => onSelectStock(stock.symbol)}
                  >
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      <span>{stock.symbol}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>${stock.price}</span>
                      <span
                        className={
                          stock.change >= 0 ? "text-green-500" : "text-red-500"
                        }
                      >
                        {stock.change > 0 ? "+" : ""}
                        {stock.change}%
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <Button className="w-full" onClick={onAddWatchlist}>
          <Plus className="h-4 w-4 mr-2" />
          New Watchlist
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
