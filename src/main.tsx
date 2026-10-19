import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/cormorant-garamond/300.css';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/bai-jamjuree/300.css';
import '@fontsource/bai-jamjuree/400.css';
import '@fontsource/bai-jamjuree/500.css';
import './styles/tokens.css';
import './styles/global.css';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
