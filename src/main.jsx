import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

window.storage = {
  get: async (key) => {
    const v = localStorage.getItem(key);
    return v ? { key, value: v, shared: false } : null;
  },
  set: async (key, value) => {
    localStorage.setItem(key, value);
    return { key, value, shared: false };
  },
  delete: async (key) => {
    localStorage.removeItem(key);
    return { key, deleted: true, shared: false };
  },
  list: async () => ({ keys: Object.keys(localStorage), shared: false }),
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
