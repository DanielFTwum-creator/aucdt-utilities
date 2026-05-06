import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/themes.css';
import AdvancedAnalytics from './components/analytics/AdvancedAnalytics';
import { ThemeProvider } from './contexts/ThemeContext';
import { ExportProvider } from './contexts/ExportContext';
import { FilterProvider } from './contexts/FilterContext';
import { AuthGate } from './AuthGate';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthGate><ThemeProvider>
      <ExportProvider>
        <FilterProvider>
          <AdvancedAnalytics />
        </FilterProvider>
      </ExportProvider>
    </ThemeProvider></AuthGate>
  </React.StrictMode>
);
