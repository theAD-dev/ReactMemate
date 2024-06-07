import React from 'react';
import { BrowserRouter} from "react-router-dom";
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import '../src/App.css'


import App from './App';
import "@fontsource/inter"; // Defaults to weight 400
import "@fontsource/roboto"; // Defaults to weight 400


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <React.StrictMode>
      <BrowserRouter>
    <App />
    </BrowserRouter>
  </React.StrictMode>
);
