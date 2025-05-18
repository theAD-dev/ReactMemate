// import React from 'react';
// import { HelmetProvider } from 'react-helmet-async';
// import { BrowserRouter } from "react-router-dom";
// import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
// import { PrimeReactProvider } from "primereact/api";
// import ReactDOM from 'react-dom/client';
// import { Toaster } from 'sonner';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import "primereact/resources/themes/lara-light-cyan/theme.css";
// import './shared/styles/prime.css';
// import './shared/styles/index.css';
// import './shared/styles/App.css';
// import './shared/styles/global.scss';
// import App from './App';
// import "@fontsource/inter";
// import "@fontsource/roboto";
// import { TrialHeightProvider } from './app/providers/trial-height-provider';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// const queryClient = new QueryClient();

// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <HelmetProvider>
//         <PrimeReactProvider>
//           <TrialHeightProvider>
//             <QueryClientProvider client={queryClient}>
//               <Toaster expand={true} richColors closeButton position="top-right" />
//               <App />
//             </QueryClientProvider>
//           </TrialHeightProvider>
//         </PrimeReactProvider>
//       </HelmetProvider>
//     </BrowserRouter>
//   </React.StrictMode>
// );

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
