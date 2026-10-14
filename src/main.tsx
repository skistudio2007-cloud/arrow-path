import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {ErrorBoundary} from './components/ErrorBoundary.tsx';
import './index.css';

// Prevent unhandled errors or rejections from turning the WebView into a blank white screen
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.error('Captured window error:', event.error || event.message);
  });
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Captured unhandled rejection:', event.reason);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
