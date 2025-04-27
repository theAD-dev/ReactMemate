import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import ComingSoon from '../../../../shared/ui/coming-soon';


const AppNotifications = () => {
    const { trialHeight } = useTrialHeight();

    return (
        <>
            <Helmet>
                <title>MeMate - App Notifications</title>
            </Helmet>

            <div className="settings-content setModalelBoots w-100">
                <div className='headSticky'>
                    <h1>Notifications</h1>
                    <div className='contentMenuTab'>
                        <ul>
                            <li><Link to="/settings/notifications/dashboard-notifications">Dashboard Notifications</Link></li>
                            <li><Link to="/settings/notifications/email-notifications">Email Notifications</Link></li>
                            <li className='menuActive'><Link to="/settings/notifications/app-notifications">App Notifications</Link></li>
                        </ul>
                    </div>
                </div>
                <div className={`content_wrap_main d-flex align-items-center w-100`} style={{ height: `calc(100vh - 150px - ${trialHeight}px)` }}>
                    <ComingSoon />
                </div>
            </div>
        </>
    );
};

export default AppNotifications;
