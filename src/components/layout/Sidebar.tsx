import React, { useState } from "react";
import { useWatchlistPrices } from "@/lib/hooks/useWatchlistPrices";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useWatchlistStore } from "@/lib/store/watchlistStore";
import StockSearchDialog from "../search/StockSearchDialog";
import { useStockStore } from "@/lib/store/stockStore";
import NewWatchlistDialog from "../watchlist/NewWatchlistDialog";
import ManageWatchlistsDialog from "../watchlist/ManageWatchlistsDialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Sidebar = () => {
  useWatchlistPrices();
  const [filterText, setFilterText] = useState("");
  const { watchlists } = useWatchlistStore();
  const { addChart } = useStockStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedWatchlist, setSelectedWatchlist] = useState(watchlists[0]?.id);
  const [isNewWatchlistOpen, setIsNewWatchlistOpen] = useState(false);
  const [isManageWatchlistsOpen, setIsManageWatchlistsOpen] = useState(false);

  const currentWatchlist = watchlists.find((w) => w.id === selectedWatchlist);

  const handleStockSelect = (symbol: string) => {
    addChart(symbol);
  };

  const handleWatchlistSelect = (value: string) => {
    if (value === "new") {
      setIsNewWatchlistOpen(true);
    } else if (value === "manage") {
      setIsManageWatchlistsOpen(true);
    } else {
      setSelectedWatchlist(value);
    }
  };

  const filteredStocks = currentWatchlist?.stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(filterText.toLowerCase()) ||
      stock.name.toLowerCase().includes(filterText.toLowerCase()),
  );

  return (
    <div className="w-[280px] h-full bg-background border-r flex flex-col">
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-8"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Select
            value={selectedWatchlist}
            onValueChange={handleWatchlistSelect}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a watchlist" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {watchlists.map((list) => (
                  <SelectItem key={list.id} value={list.id}>
                    {list.name}
                  </SelectItem>
                ))}
                <SelectSeparator />
                <SelectItem value="new">New Watchlist</SelectItem>
                <SelectItem value="manage">Manage Watchlists</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-1">
          {filteredStocks?.map((stock) => (
            <Button
              key={stock.id}
              variant="ghost"
              className="w-full justify-between h-auto py-2 px-3"
              onClick={() => handleStockSelect(stock.symbol)}
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">{stock.symbol}</span>
                <span className="text-xs text-muted-foreground">
                  {stock.name}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span>${stock.price.toFixed(2)}</span>
                <span
                  className={`text-xs ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {stock.change > 0 ? "+" : ""}
                  {stock.change.toFixed(2)}%
                </span>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>

      <StockSearchDialog
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        onSelect={handleStockSelect}
      />

      <NewWatchlistDialog
        open={isNewWatchlistOpen}
        onOpenChange={setIsNewWatchlistOpen}
      />

      <ManageWatchlistsDialog
        open={isManageWatchlistsOpen}
        onOpenChange={setIsManageWatchlistsOpen}
      />
    </div>
  );
};

export default Sidebar;
