import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../../components/layout/settings/Sidebar';

const SettingsLayout = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('');

  // Set the active tab based on the current path
  useEffect(() => {
    const path = location.pathname;

    // Extract the active tab from the path
    if (path.includes('/settings/generalinformation')) {
      if (path.includes('/profile')) {
        setActiveTab('profile');
      } else if (path.includes('/subscription')) {
        setActiveTab('subscription');
      } else if (path.includes('/bank-details')) {
        setActiveTab('generalinformation');
      } else if (path.includes('/region-and-language')) {
        setActiveTab('generalinformation');
      } else if (path.includes('/billing-info')) {
        setActiveTab('subscription');
      } else if (path.includes('/bills')) {
        setActiveTab('subscription');
      } else {
        setActiveTab('generalinformation');
      }
    } else if (path.includes('/settings/users')) {
      if (path.includes('/mobile-app')) {
        setActiveTab('desktop');
      } else {
        setActiveTab('desktop');
      }
    } else if (path.includes('/settings/calculators')) {
      setActiveTab('departments');
    } else if (path.includes('/settings/location')) {
      setActiveTab('locations');
    } else if (path.includes('/settings/templates')) {
      if (path.includes('/email-templates')) {
        setActiveTab('job-templates');
      } else if (path.includes('/email-signatures')) {
        setActiveTab('job-templates');
      } else if (path.includes('/proposal-templates')) {
        setActiveTab('job-templates');
      } else if (path.includes('/job-templates')) {
        setActiveTab('job-templates');
      } else if (path.includes('/sms-templates')) {
        setActiveTab('job-templates');
      } else {
        setActiveTab('job-templates');
      }
    } else if (path.includes('/settings/companyethos')) {
      setActiveTab('company-ethos');
    } else if (path.includes('/settings/integrations')) {
      setActiveTab('integrations');
    } else if (path.includes('/settings/quotesjobs')) {
      setActiveTab('recurring-quotes');
    } else if (path.includes('/settings/projectstatus')) {
      setActiveTab('organisation-setting');
    } else if (path.includes('/settings/termsandconditions')) {
      setActiveTab('terms-and-conditions');
    } else if (path.includes('/settings/customerssettings')) {
      if (path.includes('/industries')) {
        setActiveTab('industries');
      } else {
        setActiveTab('industries');
      }
    } else if (path.includes('/settings/accounting')) {
      setActiveTab('expenses');
    } else if (path.includes('/settings/notifications')) {
      setActiveTab('dashboard-notifications');
    }
  }, [location.pathname]);

  return (
    <div className='settings-wrap'>
      <Helmet>
        <title>MeMate - Settings</title>
      </Helmet>
      <div className="settings-wrapper">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="settings-content w-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
