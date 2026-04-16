// components/settings.js

import { getFromStorage, saveToStorage } from '../utils.js';
import { showToast } from '../script.js';

export function initSettings(container) {
  const prefs = getFromStorage('preferences', { theme: 'dark', apiKey: '' });

  const wrapper = document.createElement('div');
  wrapper.className = 'glass-card';
  wrapper.innerHTML = `
    <h2>Settings</h2>
    <label>
      <input type="checkbox" id="theme-toggle" ${prefs.theme === 'dark' ? 'checked' : ''} /> Dark Mode
    </label>
    <div style="margin-top:1rem;">
      <label for="api-key-input">API Key (optional)</label>
      <input type="text" id="api-key-input" placeholder="Enter API key" value="${prefs.apiKey}" />
    </div>
    <button class="btn" id="save-settings-btn" style="margin-top:1rem;"><i class="fa-solid fa-save"></i> Save Settings</button>
  `;
  container.appendChild(wrapper);

  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  });

  document.getElementById('save-settings-btn').addEventListener('click', () => {
    const newPrefs = {
      theme: themeToggle.checked ? 'dark' : 'light',
      apiKey: document.getElementById('api-key-input').value.trim()
    };
    saveToStorage('preferences', newPrefs);
    showToast('Settings saved.');
  });
}
