import React from 'react';
import { BrowserRouter } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import '../src/App.css'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';


import App from './App';
import "@fontsource/inter"; // Defaults to weight 400
import "@fontsource/roboto"; // Defaults to weight 400


const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
