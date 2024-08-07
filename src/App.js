import React from 'react';
import { AuthProvider } from './components/Auth';
import { Routes, Route } from 'react-router-dom';
import Login from './components/layout/Login/Login';
import ForgotPassword from './components/layout/Login/ForgotPassword';
import CheckMail from './components/layout/Login/CheckMail';
import PasswordReset from './components/layout/Login/PasswordReset';
import SignUp from './components/layout/requestdemo/SignUp';
import SelectCountry from './components/layout/requestdemo/SelectCountry';
import CompanyName from './components/layout/requestdemo/CompanyName';
import SelectDate from './components/layout/requestdemo/SelectDate';
import AllSet from './components/layout/requestdemo/AllSet';
import Create from './components/layout/onboarding/Create';
import Verifymail from './components/layout/onboarding/Verifymail';
import Companyname from './components/layout/onboarding/Companyname';
import Regionalsettings from './components/layout/onboarding/Regionalsettings';
import Discovermemate from './components/layout/onboarding/Discovermemate';
import ResendEmail from './components/layout/onboarding/ResendEmail';
import ChangePassword from './components/layout/Login/ChangePassword';
import Demo from './components/layout/settings/Demo';

function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="*" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/check-mail" element={<CheckMail />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/profile/change-password/:token" element={<ChangePassword />} />
          <Route path="/requestdemo" element={<SignUp />} />
          <Route path="/selectcountry" element={<SelectCountry />} />
          <Route path="/companyname" element={<CompanyName  />} />
          <Route path="/selectdate" element={<SelectDate />} />
          <Route path="/allset" element={<AllSet />} />
          <Route path="/onboarding" element={<Create />} />
          <Route path="/verify-mail" element={<Verifymail />} />
          <Route path="/company-name" element={<Companyname />} />
          <Route path="/regional-settings" element={<Regionalsettings />} />
          <Route path="/discover-memate" element={<Discovermemate />} />
          <Route path="/resend-email" element={<ResendEmail />} />
          <Route path="/demo" element={<Demo />} />
        </Routes>
    </AuthProvider>  
  );
}

export default App;
