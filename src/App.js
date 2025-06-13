import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Components from '../src/ui/memate-select';
import PublicInvoice from './components/Business/Pages/invoices/public-invoice/public-invoice';
import QuotationEmail from './components/layout/browser-web/quotation-email';
import { protectedRoutes } from './components/layout/Header';
import ChangePassword from './components/layout/Login/change-password';
import CheckMail from './components/layout/Login/check-mail';
import ForgotPassword from './components/layout/Login/forgot-password';
import Login from './components/layout/Login/login-page';
import PasswordReset from './components/layout/Login/password-reset';
import Companyname from './components/layout/onboarding/Companyname';
import Create from './components/layout/onboarding/Create';
import Discovermemate from './components/layout/onboarding/Discovermemate';
import PasswordCreate from './components/layout/onboarding/password-create';
import Regionalsettings from './components/layout/onboarding/Regionalsettings';
import ResendEmail from './components/layout/onboarding/ResendEmail';
import Verifymail from './components/layout/onboarding/Verifymail';
import AllSet from './components/layout/requestdemo/AllSet';
import CompanyName from './components/layout/requestdemo/CompanyName';
import SelectDate from './components/layout/requestdemo/select-date';
import SelectCountry from './components/layout/requestdemo/SelectCountry';
import SignUp from './components/layout/requestdemo/SignUp';
import Demo from './components/layout/settings/Demo';
import Suspended from './components/layout/suspended';
import AccountOverdue from './pages/account-overdue/account-overdue';
import Logout from './pages/setting/logout/logout';
import NotFoundTemplate from './ui/404-template/not-found-template';
import StripeContainer from './ui/strip-payment/strip-payment';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path='/logout' element={<Logout />} />
      <Route path='/suspended' element={<Suspended />} />
      <Route path="/account-overdue" element={<AccountOverdue />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/check-mail" element={<CheckMail />} />
      <Route path="/password-reset" element={<PasswordReset />} />
      <Route path="/profile/change-password/:token" element={<ChangePassword />} />
      <Route path="/requestdemo" element={<SignUp />} />
      <Route path="/select-country" element={<SelectCountry />} />
      <Route path="/companyname" element={<CompanyName />} />
      <Route path="/selectdate" element={<SelectDate />} />
      <Route path="/allset" element={<AllSet />} />

      <Route path="/onboarding" element={<Create />} />
      <Route path="/verify-mail/:uuid" element={<Verifymail />} />
      <Route path="/company-name/:uuid" element={<Companyname />} />
      <Route path="/regional-settings/:uuid" element={<Regionalsettings />} />
      <Route path="/discover-memate/:uuid" element={<Discovermemate />} />
      <Route path="/create-password/:uuid" element={<PasswordCreate />} />
      <Route path="/resend-email" element={<ResendEmail />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/ui/components" element={<Components />} />
      <Route path="/quote/:id" element={<QuotationEmail />} />
      <Route path="/invoice/:id" element={<PublicInvoice />} />
      <Route path='/payment/:clientSecret/:publishKey' element={<StripeContainer />} />
      <Route path="/404" element={<NotFoundTemplate />} />
      <Route path="*" element={<Navigate to={"/404"} />} />

      {protectedRoutes}
    </Routes>
  );
}

export default App;
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