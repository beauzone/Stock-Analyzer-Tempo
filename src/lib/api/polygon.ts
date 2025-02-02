import { StockDataPoint } from "./yahoo";

const POLYGON_API_KEY = import.meta.env.VITE_POLYGON_API_KEY;

if (!POLYGON_API_KEY) {
  console.error(
    "Polygon API key is not set. Please add VITE_POLYGON_API_KEY to your .env file",
  );
}

// Function to fetch historical data
export async function fetchHistoricalData(
  symbol: string,
  timeframe = "day",
  from: string,
  to: string,
): Promise<StockDataPoint[]> {
  try {
    const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/${timeframe}/${from}/${to}?apiKey=${POLYGON_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return (
      data.results?.map((bar: any) => ({
        date: new Date(bar.t).toISOString(),
        open: bar.o,
        high: bar.h,
        low: bar.l,
        close: bar.c,
        volume: bar.v,
      })) || []
    );
  } catch (error) {
    console.error("Error fetching historical data:", error);
    throw error;
  }
}

// Function to search stocks
export async function searchStocks(query: string) {
  try {
    const url = `https://api.polygon.io/v3/reference/tickers?search=${query}&active=true&sort=ticker&order=asc&limit=10&apiKey=${POLYGON_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return (
      data.results?.map((result: any) => ({
        symbol: result.ticker,
        name: result.name,
        exchange: result.primary_exchange,
      })) || []
    );
  } catch (error) {
    console.error("Error searching stocks:", error);
    return [];
  }
}
