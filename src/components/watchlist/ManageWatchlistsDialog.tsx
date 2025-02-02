import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { useWatchlistStore } from "@/lib/store/watchlistStore";
import { Separator } from "@/components/ui/separator";

interface ManageWatchlistsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ManageWatchlistsDialog({
  open,
  onOpenChange,
}: ManageWatchlistsDialogProps) {
  const { watchlists, removeWatchlist } = useWatchlistStore();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Watchlists</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {watchlists.map((watchlist, index) => (
              <div key={watchlist.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium leading-none">
                      {watchlist.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {watchlist.stocks.length} stocks
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeWatchlist(watchlist.id)}
                    disabled={index === 0} // Prevent deleting the default watchlist
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {index < watchlists.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
