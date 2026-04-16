// api.js - Mock API wrapper for StockFlow

// In a real implementation this would call a stock data provider (Alpha Vantage, IEX, etc.)
// For now we provide static mock data and simple delayed promises to simulate network latency.

/** Simulate network delay */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/** Get mock price history for a ticker */
export async function fetchPriceHistory(ticker) {
  await delay(500); // simulate latency
  // Generate dummy data: last 30 days of closing prices
  const today = new Date();
  const data = [];
  let price = 100 + Math.random() * 20;
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    // random walk
    price += (Math.random() - 0.5) * 2;
    data.push({ date: date.toISOString().split('T')[0], close: parseFloat(price.toFixed(2)) });
  }
  return data;
}

/** Get current quote for a ticker */
export async function fetchCurrentQuote(ticker) {
  await delay(300);
  const price = 100 + Math.random() * 20;
  return { ticker, price: parseFloat(price.toFixed(2)), change: (Math.random() - 0.5) * 2 };
}

/** Placeholder for search suggestions */
export async function searchTickers(query) {
  await delay(200);
  const sample = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA'];
  return sample.filter(sym => sym.includes(query.toUpperCase()));
}
