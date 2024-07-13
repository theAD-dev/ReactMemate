import React, { useState } from 'react';
import Sidebar from './Sidebar';

const OrganisationSetting = () => {
    const [activeTab, setActiveTab] = useState('organisation-setting');
 
    return (
        <>
        <div className='settings-wrap'>
        <div className="settings-wrapper">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="settings-content setModalelBoots">
                <div className='headSticky'>
                <h1>Organisation Setting </h1>
                
                </div>
                <div className={`content_wrap_main`}>
                <div className='content_wrapper'>
                    <div className="listwrapper">
                    
                  
                    </div>
                </div>
            </div>
            </div>
        </div>
        </div>
       
        </>
    );
}

export default OrganisationSetting;
