// utils.js - Helper utilities for StockFlow

/**
 * Format a number as currency (USD).
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

/**
 * Get data from localStorage, parsed as JSON. Returns defaultValue if not present.
 */
export function getFromStorage(key, defaultValue = null) {
  const raw = localStorage.getItem(key);
  if (!raw) return defaultValue;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse storage key', key, e);
    return defaultValue;
  }
}

/**
 * Save data to localStorage as JSON.
 */
export function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Simple debounce function.
 */
export function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Generate a random ID for holdings.
 */
export function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}
