import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import ComingSoon from '../../../../shared/ui/coming-soon';

const ExpensesAccount = () => {
    const { trialHeight } = useTrialHeight();

    return (
        <>
            <Helmet>
                <title>MeMate - Expenses Account</title>
            </Helmet>
            <div className='headSticky'>
                <h1>Accounting</h1>
                <div className='contentMenuTab'>
                    <ul>
                        <li><Link to="/settings/accounting/department-turnover-plan">Department Turnover Plan</Link></li>
                        <li><Link to="/settings/accounting/industry-service">Industry Service</Link></li>
                        <li className='menuActive'><Link to="/settings/accounting/expenses">Expenses</Link></li>
                    </ul>
                </div>
            </div>
            <div className={`content_wrap_main d-flex align-items-center w-100`} style={{ height: `calc(100vh - 150px - ${trialHeight}px)` }}>
                <ComingSoon />
            </div>
        </>
    );
};

export default ExpensesAccount;
