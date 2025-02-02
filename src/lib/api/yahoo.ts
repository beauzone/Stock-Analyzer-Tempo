export interface StockDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const BASE_URL =
  "https://api.allorigins.win/raw?url=" +
  encodeURIComponent("https://query1.finance.yahoo.com/v8/finance/chart");

export async function fetchStockData(
  symbol: string,
  interval = "1d",
  range = "1mo",
): Promise<StockDataPoint[]> {
  try {
    const url = `${BASE_URL}/${symbol}?interval=${interval}&range=${range}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];

    return timestamps.map((time: number, index: number) => ({
      date: new Date(time * 1000).toISOString(),
      open: quotes.open[index] || quotes.close[index],
      high: quotes.high[index] || quotes.close[index],
      low: quotes.low[index] || quotes.close[index],
      close: quotes.close[index],
      volume: quotes.volume[index] || 0,
    }));
  } catch (error) {
    console.error("Error fetching from Yahoo Finance:", error);
    throw error;
  }
}

export function isMarketOpen(): boolean {
  const now = new Date();
  const nyTime = new Date(
    now.toLocaleString("en-US", { timeZone: "America/New_York" }),
  );
  const day = nyTime.getDay();
  const hour = nyTime.getHours();
  const minute = nyTime.getMinutes();

  // Check if it's a weekday
  if (day === 0 || day === 6) return false;

  // Convert current time to minutes since midnight
  const currentMinutes = hour * 60 + minute;

  // Market hours are 9:30 AM to 4:00 PM ET
  const marketOpen = 9 * 60 + 30; // 9:30 AM
  const marketClose = 16 * 60; // 4:00 PM

  return currentMinutes >= marketOpen && currentMinutes < marketClose;
}
