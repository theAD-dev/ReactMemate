import React from 'react';
import { Toaster } from 'sonner'
import { BrowserRouter } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import '../src/App.css'
import './global.scss'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';


import App from './App';
import "@fontsource/inter"; // Defaults to weight 400
import "@fontsource/roboto";


const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Toaster expand={true} richColors closeButton position="top-right"/>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
