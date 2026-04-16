// components/stockDetail.js

import { fetchPriceHistory, fetchCurrentQuote } from '../api.js';
import { formatCurrency } from '../utils.js';
import { showToast } from '../script.js';

export async function initStockDetail(container, ticker) {
  // Container for the detail view
  const wrapper = document.createElement('div');
  wrapper.className = 'glass-card';
  wrapper.innerHTML = `<h2>Loading ${ticker} data...</h2>`;
  container.appendChild(wrapper);

  try {
    // Fetch current quote and price history (mock)
    const [quote, history] = await Promise.all([
      fetchCurrentQuote(ticker),
      fetchPriceHistory(ticker)
    ]);

    // Build HTML content
    wrapper.innerHTML = `
      <h2>${ticker} – $${formatCurrency(quote.price)}</h2>
      <p>Current Price: <strong>${formatCurrency(quote.price)}</strong></p>
      <p>Change: <strong>${quote.change.toFixed(2)}%</strong></p>
      <canvas id="chart-${ticker}" width="400" height="200"></canvas>
      <button class="btn" id="back-btn"><i class="fa-solid fa-arrow-left"></i> Back</button>
    `;

    // Render chart using Chart.js (already loaded via CDN)
    const ctx = document.getElementById(`chart-${ticker}`).getContext('2d');
    const labels = history.map(p => p.date);
    const data = history.map(p => p.close);
    // eslint-disable-next-line no-undef
    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: `${ticker} Price`,
          data,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.2,
          pointRadius: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { display: true, title: { display: true, text: 'Date' } },
          y: { display: true, title: { display: true, text: 'Price (USD)' } }
        }
      }
    });

    // Back button handler
    document.getElementById('back-btn').addEventListener('click', () => {
      window.location.hash = '#dashboard';
    });
  } catch (err) {
    console.error(err);
    wrapper.innerHTML = `<p>Error loading data for ${ticker}. Please try again later.</p>`;
    showToast('Failed to load stock data.');
  }
}
