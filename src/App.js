import React from 'react';
import { AuthProvider } from './components/Auth';
import { Routes, Route } from 'react-router-dom';
import Login from './components/layout/Login/Login';
import ForgotPassword from './components/layout/Login/ForgotPassword';
import CheckMail from './components/layout/Login/CheckMail';
import PasswordReset from './components/layout/Login/PasswordReset';
import OnboardingCreate from './components/layout/onboarding/OnboardingCreate';
import Requestdemo from './components/layout/requestdemo/Requestdemo';
import SignUp from './components/layout/requestdemo/SignUp';
import SelectCountry from './components/layout/requestdemo/SelectCountry';
import CompanyName from './components/layout/requestdemo/CompanyName';
import SelectDate from './components/layout/requestdemo/SelectDate';
import AllSet from './components/layout/requestdemo/AllSet';


function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="*" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/check-mail" element={<CheckMail />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/onboarding" element={<OnboardingCreate />} />
          <Route path="/requestdemo" element={<Requestdemo />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/selectcountry" element={<SelectCountry />} />
          <Route path="/companyname" element={<CompanyName  />} />
          <Route path="/selectdate" element={<SelectDate />} />
          <Route path="/allset" element={<AllSet />} />
        </Routes>
    </AuthProvider>  
  );
}

export default App;
