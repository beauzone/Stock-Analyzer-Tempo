import { StockDataPoint } from "../api/yahoo";
import { fetchStockData } from "../api/yahoo";

interface CacheItem {
  symbol: string;
  timeframe: string;
  data: StockDataPoint[];
  timestamp: number;
  lastAccessed: number;
  size: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  totalSize: number;
  itemCount: number;
}

class ChartCache {
  private dbName = "chart-cache";
  private storeName = "chart-data";
  private statsStore = "cache-stats";
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes
  private maxCacheSize = 50 * 1024 * 1024; // 50MB
  private maxItemCount = 100;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    totalSize: 0,
    itemCount: 0,
  };

  constructor() {
    this.loadStats();
  }

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 2);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName);
          store.createIndex("lastAccessed", "lastAccessed");
          store.createIndex("timestamp", "timestamp");
        }
        if (!db.objectStoreNames.contains(this.statsStore)) {
          db.createObjectStore(this.statsStore);
        }
      };
    });
  }

  private getCacheKey(symbol: string, timeframe: string): string {
    return `${symbol}-${timeframe}`;
  }

  private calculateItemSize(item: CacheItem): number {
    return new TextEncoder().encode(JSON.stringify(item)).length;
  }

  private async updateStats(hit: boolean, size?: number): Promise<void> {
    if (hit) {
      this.stats.hits++;
    } else {
      this.stats.misses++;
    }
    if (size !== undefined) {
      this.stats.totalSize += size;
      this.stats.itemCount++;
    }

    const db = await this.openDB();
    const transaction = db.transaction(this.statsStore, "readwrite");
    await transaction.objectStore(this.statsStore).put(this.stats, "stats");
  }

  private async loadStats(): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(this.statsStore, "readonly");
      const stats = await transaction.objectStore(this.statsStore).get("stats");
      if (stats) {
        this.stats = stats;
      }
    } catch (error) {
      console.error("Error loading cache stats:", error);
    }
  }

  private async evictItems(requiredSpace: number = 0): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction(this.storeName, "readwrite");
    const store = transaction.objectStore(this.storeName);
    const items: CacheItem[] = await new Promise((resolve) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
    });

    // Sort by last accessed time (oldest first)
    items.sort((a, b) => a.lastAccessed - b.lastAccessed);

    let spaceCleared = 0;
    let i = 0;

    // Remove items until we have enough space or reach max item count
    while (
      (this.stats.totalSize + requiredSpace > this.maxCacheSize ||
        this.stats.itemCount > this.maxItemCount) &&
      i < items.length
    ) {
      const item = items[i];
      await store.delete(this.getCacheKey(item.symbol, item.timeframe));
      spaceCleared += item.size;
      this.stats.totalSize -= item.size;
      this.stats.itemCount--;
      i++;
    }

    await this.updateStats(false);
  }

  async get(
    symbol: string,
    timeframe: string,
  ): Promise<StockDataPoint[] | null> {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.get(this.getCacheKey(symbol, timeframe));

        request.onerror = () => reject(request.error);
        request.onsuccess = async () => {
          const item = request.result as CacheItem;
          if (!item || Date.now() - item.timestamp > this.cacheExpiry) {
            await this.updateStats(false);
            resolve(null);
          } else {
            // Update last accessed time
            item.lastAccessed = Date.now();
            await store.put(item, this.getCacheKey(symbol, timeframe));
            await this.updateStats(true);
            resolve(item.data);
          }
        };
      });
    } catch (error) {
      console.error("Error reading from cache:", error);
      return null;
    }
  }

  async set(
    symbol: string,
    timeframe: string,
    data: StockDataPoint[],
  ): Promise<void> {
    try {
      const item: CacheItem = {
        symbol,
        timeframe,
        data,
        timestamp: Date.now(),
        lastAccessed: Date.now(),
        size: 0,
      };

      item.size = this.calculateItemSize(item);

      // Check if we need to evict items
      if (
        this.stats.totalSize + item.size > this.maxCacheSize ||
        this.stats.itemCount >= this.maxItemCount
      ) {
        await this.evictItems(item.size);
      }

      const db = await this.openDB();
      const transaction = db.transaction(this.storeName, "readwrite");
      await transaction
        .objectStore(this.storeName)
        .put(item, this.getCacheKey(symbol, timeframe));

      await this.updateStats(false, item.size);
    } catch (error) {
      console.error("Error writing to cache:", error);
    }
  }

  async preloadTimeframes(symbol: string): Promise<void> {
    const timeframes = ["1D", "1W", "1M"];
    await Promise.all(
      timeframes.map(async (timeframe) => {
        const cached = await this.get(symbol, timeframe.toLowerCase());
        if (!cached) {
          const data = await fetchStockData(
            symbol,
            "1d",
            timeframe.toLowerCase(),
          );
          await this.set(symbol, timeframe.toLowerCase(), data);
        }
      }),
    );
  }

  async getStats(): Promise<CacheStats> {
    return this.stats;
  }

  async clear(): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(
        [this.storeName, this.statsStore],
        "readwrite",
      );

      await Promise.all([
        transaction.objectStore(this.storeName).clear(),
        transaction.objectStore(this.statsStore).clear(),
      ]);

      this.stats = {
        hits: 0,
        misses: 0,
        totalSize: 0,
        itemCount: 0,
      };
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  }
}

export const chartCache = new ChartCache();
