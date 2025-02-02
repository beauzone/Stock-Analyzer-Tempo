type WebSocketCallback = (data: any) => void;

interface BatchUpdate {
  symbol: string;
  updates: Array<{ price: number; timestamp: number }>;
}

class StockWebSocketManager {
  private subscriptions: Map<string, Set<WebSocketCallback>> = new Map();
  private lastPrices: Map<string, { price: number; previousClose: number }> =
    new Map();
  private throttleTimers: Map<string, NodeJS.Timeout> = new Map();
  private batchTimers: Map<string, NodeJS.Timeout> = new Map();
  private batchUpdates: Map<string, BatchUpdate> = new Map();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 1000;
  private throttleDelay: number = 500;
  private batchDelay: number = 1000;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private lastMessageTime: number = Date.now();
  private connectionStatus: "connected" | "disconnected" | "reconnecting" =
    "disconnected";

  constructor() {
    this.startHealthCheck();
  }

  private startHealthCheck() {
    this.healthCheckInterval = setInterval(() => {
      this.checkConnection();
    }, 5000);
  }

  private checkConnection() {
    const timeSinceLastMessage = Date.now() - this.lastMessageTime;
    if (timeSinceLastMessage > 10000 && this.connectionStatus === "connected") {
      console.warn(
        "No messages received for 10 seconds, initiating reconnection...",
      );
      this.handleReconnect();
    }
  }

  private updateConnectionStatus(
    status: "connected" | "disconnected" | "reconnecting",
  ) {
    this.connectionStatus = status;
    this.notifyStatusChange(status);
  }

  private notifyStatusChange(status: string) {
    for (const callbacks of this.subscriptions.values()) {
      callbacks.forEach((callback) => callback({ type: "status", status }));
    }
  }

  private async handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      this.notifyError("Connection lost. Please refresh the page.");
      return;
    }

    this.updateConnectionStatus("reconnecting");
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;

    console.log(`Attempting to reconnect in ${delay}ms...`);
    await new Promise((resolve) => setTimeout(resolve, delay));

    try {
      this.resubscribeAll();
    } catch (error) {
      console.error("Reconnection failed:", error);
      this.handleReconnect();
    }
  }

  private resubscribeAll() {
    for (const [symbol] of this.subscriptions) {
      this.fetchLatestPrice(symbol);
    }
  }

  private async fetchLatestPrice(symbol: string) {
    try {
      const response = await fetch(
        `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`)}`,
      );
      const data = await response.json();
      const result = data.chart.result[0];
      const lastPrice = result.meta.regularMarketPrice;
      const previousClose = result.meta.previousClose;

      this.processPriceUpdate(symbol, lastPrice, previousClose);
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
    }
  }

  private processPriceUpdate(
    symbol: string,
    price: number,
    previousClose: number,
  ) {
    const change = ((price - previousClose) / previousClose) * 100;
    const callbacks = this.subscriptions.get(symbol);
    if (callbacks) {
      const update = {
        type: "price",
        symbol,
        price,
        change,
      };
      callbacks.forEach((callback) => callback(update));
    }
  }

  private notifyError(message: string) {
    for (const callbacks of this.subscriptions.values()) {
      callbacks.forEach((callback) => callback({ type: "error", message }));
    }
  }

  subscribe(symbol: string, callback: WebSocketCallback) {
    if (!this.subscriptions.has(symbol)) {
      this.subscriptions.set(symbol, new Set());
      this.fetchLatestPrice(symbol);
    }
    this.subscriptions.get(symbol)!.add(callback);
    callback({ type: "status", status: this.connectionStatus });
  }

  unsubscribe(symbol: string, callback: WebSocketCallback) {
    const callbacks = this.subscriptions.get(symbol);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.subscriptions.delete(symbol);
        this.cleanupSymbol(symbol);
      }
    }
  }

  private cleanupSymbol(symbol: string) {
    const throttleTimer = this.throttleTimers.get(symbol);
    if (throttleTimer) {
      clearTimeout(throttleTimer);
      this.throttleTimers.delete(symbol);
    }

    const batchTimer = this.batchTimers.get(symbol);
    if (batchTimer) {
      clearTimeout(batchTimer);
      this.batchTimers.delete(symbol);
    }

    this.batchUpdates.delete(symbol);
  }

  cleanup() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    for (const timer of this.throttleTimers.values()) {
      clearTimeout(timer);
    }
    for (const timer of this.batchTimers.values()) {
      clearTimeout(timer);
    }

    this.subscriptions.clear();
    this.lastPrices.clear();
    this.throttleTimers.clear();
    this.batchTimers.clear();
    this.batchUpdates.clear();
  }
}

export const stockWebSocket = new StockWebSocketManager();
