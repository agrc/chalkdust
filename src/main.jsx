import '@arcgis/core/assets/esri/themes/light/main.css';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/tailwind.css';

if (import.meta.env.VITE_FIREBASE_CONFIG) {
  const app = initializeApp(JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG));
  getAnalytics(app);
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
