import React from 'react';
import 'react-international-phone/style.css';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import './shared/styles/prime.css';
import './shared/styles/index.css';
import './shared/styles/App.css';
import './shared/styles/global.scss';
import 'leaflet/dist/leaflet.css';
import "@fontsource/inter";
import "@fontsource/roboto";
import App from './app/_app';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);