import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import ComingSoon from '../../../../shared/ui/coming-soon';
import Sidebar from '../Sidebar';

const CompanyEthos = () => {
    const { trialHeight } = useTrialHeight();
    const [activeTab, setActiveTab] = useState('company-ethos');

    return (
        <>
            <Helmet>
                <title>MeMate - Company Ethos</title>
            </Helmet>
            <div className='settings-wrap'>
                <div className="settings-wrapper">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="settings-content setModalelBoots">
                        <div className='headSticky'>
                            <h1>Company Ethos</h1>
                        </div>
                        <div className={`content_wrap_main d-flex align-items-center w-100`} style={{ height: `calc(100vh - 150px - ${trialHeight}px)` }}>
                            <ComingSoon />
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default CompanyEthos;
