const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function analyzeStock(
  symbol: string,
  query: string,
  stockData: any,
) {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `You are a financial analyst AI. Analyze stock market data and provide insights. Be concise and focus on key metrics and trends.`,
          },
          {
            role: "user",
            content: `Analyze ${symbol} stock: ${query}\n\nStock Data: ${JSON.stringify(stockData)}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error analyzing stock:", error);
    throw new Error("Failed to analyze stock data");
  }
}
