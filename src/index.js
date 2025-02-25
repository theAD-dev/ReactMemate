import React from 'react';
import { BrowserRouter } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';
import 'bootstrap/dist/css/bootstrap.min.css';
import './prime.css';
import './index.css';
import '../src/App.css';
import './global.scss';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import App from './App';
import "@fontsource/inter"; // Defaults to weight 400
import "@fontsource/roboto";
import { TrialHeightProvider } from './app/providers/trial-height-provider';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <TrialHeightProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster expand={true} richColors closeButton position="top-right" />
          <App />
        </QueryClientProvider>
      </TrialHeightProvider>
    </BrowserRouter>
  </React.StrictMode>
);
