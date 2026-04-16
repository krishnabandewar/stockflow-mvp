// components/dashboard.js

import { getFromStorage } from '../utils.js';
import { fetchCurrentQuote } from '../api.js';
import { formatCurrency } from '../utils.js';
import { showToast } from '../script.js';

export async function initDashboard(container) {
  const holdings = getFromStorage('portfolio', []);
  // Calculate total value using mock current quotes
  const quotes = await Promise.all(holdings.map(h => fetchCurrentQuote(h.ticker)));
  let totalValue = 0;
  holdings.forEach((h, i) => {
    const price = quotes[i].price;
    totalValue += price * h.quantity;
  });

  const card = document.createElement('div');
  card.className = 'glass-card';
  card.innerHTML = `
    <h2>Portfolio Overview</h2>
    <p>Total Value: <strong>${formatCurrency(totalValue)}</strong></p>
    <p>Holdings: ${holdings.length}</p>
    <button class="btn" id="add-holding-btn"><i class="fa-solid fa-plus"></i> Add Holding</button>
  `;
  container.appendChild(card);

  // Add click handler to open add holding modal (delegated to portfolio component)
  document.getElementById('add-holding-btn').addEventListener('click', () => {
    // Dispatch a custom event that portfolio component listens for
    const ev = new CustomEvent('openAddHolding');
    window.dispatchEvent(ev);
    showToast('Opening Add Holding modal...');
  });
}
