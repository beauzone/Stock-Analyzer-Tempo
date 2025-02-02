import { z } from "zod";

export const WatchlistStockSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  price: z.number(),
  change: z.number(),
  data: z.array(z.any()).optional(),
  lastUpdated: z.string().optional(),
});

export const WatchlistSchema = z.object({
  id: z.string(),
  name: z.string(),
  stocks: z.array(WatchlistStockSchema),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const WatchlistStateSchema = z.object({
  version: z.number(),
  watchlists: z.array(WatchlistSchema),
});

export type ValidatedWatchlistStock = z.infer<typeof WatchlistStockSchema>;
export type ValidatedWatchlist = z.infer<typeof WatchlistSchema>;
export type ValidatedWatchlistState = z.infer<typeof WatchlistStateSchema>;
