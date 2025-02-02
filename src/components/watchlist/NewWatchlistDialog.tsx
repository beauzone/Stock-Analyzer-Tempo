import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWatchlistStore } from "@/lib/store/watchlistStore";

interface NewWatchlistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NewWatchlistDialog({
  open,
  onOpenChange,
}: NewWatchlistDialogProps) {
  const [name, setName] = React.useState("");
  const { addWatchlist } = useWatchlistStore();

  const handleSubmit = (e: React.FormEvent) => {
    console.log("NewWatchlistDialog - handleSubmit called");
    console.log("Current name value:", name);
    e.preventDefault();
    if (name.trim()) {
      console.log("Calling addWatchlist with:", name.trim());
      addWatchlist(name.trim());
      console.log("addWatchlist called");
      setName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Watchlist</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Watchlist Name</Label>
            <Input
              id="name"
              placeholder="Enter watchlist name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
