// components/portfolio.js

import { getFromStorage, saveToStorage, formatCurrency, generateId } from '../utils.js';
import { showToast } from '../script.js';

export function initPortfolio(container) {
  const holdings = getFromStorage('portfolio', []);

  const wrapper = document.createElement('div');
  wrapper.className = 'glass-card';
  wrapper.innerHTML = `<h2>My Portfolio</h2>`;

  const table = document.createElement('table');
  table.className = 'table';
  table.innerHTML = `
    <thead>
      <tr>
        <th>Ticker</th>
        <th>Quantity</th>
        <th>Purchase Price</th>
        <th>Current Value</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody id="portfolio-body"></tbody>
  `;
  wrapper.appendChild(table);

  const addBtn = document.createElement('button');
  addBtn.className = 'btn';
  addBtn.id = 'add-holding-btn-portfolio';
  addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Holding';
  wrapper.appendChild(addBtn);

  container.appendChild(wrapper);

  function renderTable() {
    const tbody = document.getElementById('portfolio-body');
    tbody.innerHTML = '';
    holdings.forEach((h, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${h.ticker}</td>
        <td>${h.quantity}</td>
        <td>${formatCurrency(h.purchasePrice)}</td>
        <td>${formatCurrency(h.quantity * h.currentPrice)}</td>
        <td>
          <button class="btn edit-btn" data-idx="${idx}"><i class="fa-solid fa-pen"></i></button>
          <button class="btn delete-btn" data-idx="${idx}"><i class="fa-solid fa-trash"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Initial render
  renderTable();

  // Listen for custom event to open modal from dashboard or elsewhere
  window.addEventListener('openAddHolding', openAddModal);

  addBtn.addEventListener('click', openAddModal);

  function openAddModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal">
        <h2>Add Holding</h2>
        <input type="text" id="ticker-input" placeholder="Ticker (e.g., AAPL)" />
        <input type="number" id="quantity-input" placeholder="Quantity" min="1" />
        <input type="number" id="price-input" placeholder="Purchase Price" step="0.01" min="0" />
        <button class="btn" id="save-holding-btn"><i class="fa-solid fa-save"></i> Save</button>
        <button class="btn" id="cancel-holding-btn"><i class="fa-solid fa-times"></i> Cancel</button>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('cancel-holding-btn').addEventListener('click', () => modal.remove());
    document.getElementById('save-holding-btn').addEventListener('click', () => {
      const ticker = document.getElementById('ticker-input').value.trim().toUpperCase();
      const quantity = parseInt(document.getElementById('quantity-input').value, 10);
      const purchasePrice = parseFloat(document.getElementById('price-input').value);
      if (!ticker || isNaN(quantity) || isNaN(purchasePrice)) {
        showToast('Please fill all fields correctly.');
        return;
      }
      const newHolding = {
        id: generateId(),
        ticker,
        quantity,
        purchasePrice,
        currentPrice: purchasePrice // placeholder, will be updated later
      };
      holdings.push(newHolding);
      saveToStorage('portfolio', holdings);
      renderTable();
      modal.remove();
      showToast('Holding added.');
    });
  }

  // Edit & Delete handlers
  container.addEventListener('click', e => {
    if (e.target.closest('.edit-btn')) {
      const idx = parseInt(e.target.closest('.edit-btn').dataset.idx, 10);
      editHolding(idx);
    } else if (e.target.closest('.delete-btn')) {
      const idx = parseInt(e.target.closest('.delete-btn').dataset.idx, 10);
      holdings.splice(idx, 1);
      saveToStorage('portfolio', holdings);
      renderTable();
      showToast('Holding removed.');
    }
  });

  function editHolding(idx) {
    const holding = holdings[idx];
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.innerHTML = `
      <div class="modal">
        <h2>Edit Holding</h2>
        <input type="text" id="edit-ticker" value="${holding.ticker}" />
        <input type="number" id="edit-quantity" value="${holding.quantity}" min="1" />
        <input type="number" id="edit-price" value="${holding.purchasePrice}" step="0.01" min="0" />
        <button class="btn" id="save-edit-btn"><i class="fa-solid fa-save"></i> Save</button>
        <button class="btn" id="cancel-edit-btn"><i class="fa-solid fa-times"></i> Cancel</button>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('cancel-edit-btn').addEventListener('click', () => modal.remove());
    document.getElementById('save-edit-btn').addEventListener('click', () => {
      const ticker = document.getElementById('edit-ticker').value.trim().toUpperCase();
      const quantity = parseInt(document.getElementById('edit-quantity').value, 10);
      const purchasePrice = parseFloat(document.getElementById('edit-price').value);
      if (!ticker || isNaN(quantity) || isNaN(purchasePrice)) {
        showToast('Invalid input.');
        return;
      }
      holding.ticker = ticker;
      holding.quantity = quantity;
      holding.purchasePrice = purchasePrice;
      saveToStorage('portfolio', holdings);
      renderTable();
      modal.remove();
      showToast('Holding updated.');
    });
  }
}
