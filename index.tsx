import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThirdwebProvider } from 'thirdweb/react';
import { ThemeProvider } from './context/ThemeContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <ThirdwebProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </ThirdwebProvider>
);