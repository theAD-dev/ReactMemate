import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import ComingSoon from '../../../../shared/ui/coming-soon';


const RecurringJobs = () => {
    const { trialHeight } = useTrialHeight();

    return (
        <>
            <Helmet>
                <title>MeMate - Recurring Jobs</title>
            </Helmet>
            <div className='headSticky'>
                <h1>Quotes & Jobs</h1>
                <div className='contentMenuTab'>
                    <ul>
                        <li><Link to="/settings/quotesjobs/recurring-quotes">Recurring Quotes</Link></li>
                        <li className='menuActive'><Link to="/settings/quotesjobs/recurring-jobs">Recurring Jobs</Link></li>
                    </ul>
                </div>
            </div>
            <div className={`content_wrap_main d-flex align-items-center w-100`} style={{ height: `calc(100vh - 150px - ${trialHeight}px)` }}>
                <ComingSoon />
            </div>
        </>
    );
};

export default RecurringJobs;
