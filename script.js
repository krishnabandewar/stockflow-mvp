// script.js - Main entry point for StockFlow SPA

// Import component modules
import { initDashboard } from './components/dashboard.js';
import { initPortfolio } from './components/portfolio.js';
import { initSettings } from './components/settings.js';
import { initStockDetail } from './components/stockDetail.js';

// Simple router based on hash changes
function router() {
  const root = document.getElementById('app-root');
  const hash = location.hash || '#dashboard';
  root.innerHTML = '';

  if (hash.startsWith('#dashboard')) {
    initDashboard(root);
  } else if (hash.startsWith('#portfolio')) {
    initPortfolio(root);
  } else if (hash.startsWith('#settings')) {
    initSettings(root);
  } else if (hash.startsWith('#stock/')) {
    const ticker = hash.split('/')[1];
    initStockDetail(root, ticker);
  } else {
    initDashboard(root);
  }
  setActiveNav(hash);
}

function setActiveNav(activeHash) {
  const links = document.querySelectorAll('.app-nav .nav-link');
  links.forEach(link => {
    if (link.getAttribute('href') === activeHash.split('/')[0]) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Apply stored preferences (theme) on load
function applyPreferences() {
  try {
    const prefs = JSON.parse(localStorage.getItem('preferences')) || { theme: 'dark' };
    if (prefs.theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  } catch (e) {
    console.error('Failed to load preferences', e);
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
  applyPreferences();
  router();
});

// Global toast utility
export function showToast(message, duration = 3000) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.background = 'rgba(0,0,0,0.7)';
  toast.style.color = '#fff';
  toast.style.padding = '0.8rem 1.2rem';
  toast.style.borderRadius = '8px';
  toast.style.zIndex = '2000';
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}
