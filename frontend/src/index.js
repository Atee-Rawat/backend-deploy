import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ✅ Register Mobsted service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/PWALessSDKWorker.js')
      .then((registration) => {
        console.log('✅ Mobsted SW registered:', registration);
      })
      .catch((error) => {
        console.error('❌ Mobsted SW registration failed:', error);
      });
  });
}

reportWebVitals();
