import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Sidebar';

const DashboardNotifications = () => {
    const [activeTab, setActiveTab] = useState('dashboard-notifications');

    return (
        <>
        <div className='settings-wrap'>
        <div className="settings-wrapper">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="settings-content setModalelBoots">
                <div className='headSticky'>
                <h1>Notifications</h1>
                <div className='contentMenuTab'>
                <ul>
                       <li className='menuActive'><Link to="/settings/notifications/dashboard-notifications">Dashboard Notifications</Link></li>
                        <li><Link to="/settings/notifications/email-notifications">Email Notifications</Link></li>
                        <li><Link to="/settings/notifications/app-notifications">App Notifications</Link></li>
                    </ul>
                </div>
                </div>
                <div className={`content_wrap_main`}>
                <div className='content_wrapper'>
                    <div className="listwrapper">
                    <div className="topHeadStyle pb-4">
                        <div>
                        <h2>Dashboard Notifications</h2>
                        <p>Lorem Ipsum dolores</p>
                        </div>
                       
                    </div>
                    <div>
                      <ul>
                        <li>fdgd</li>
                        <li>fdgd</li>
                        <li>fdgd</li>
                        <li>fdgd</li>
                      </ul>
                    </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
        </div>
       
        </>
    );
};

export default DashboardNotifications;
 