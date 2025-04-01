import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import ComingSoon from '../../../../shared/ui/coming-soon';
import Sidebar from '../Sidebar';

const ExpensesAccount = () => {
    const { trialHeight } = useTrialHeight();
    const [activeTab, setActiveTab] = useState('expenses');

    return (
        <>
            <div className='settings-wrap'>
                <div className="settings-wrapper">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="settings-content setModalelBoots">
                        <div className='headSticky'>
                            <h1>Accounting</h1>
                            <div className='contentMenuTab'>
                                <ul>
                                    <li><Link to="/settings/accounting/department-turnover-plan">Department Turnover Plan</Link></li>
                                    <li className='menuActive'><Link to="/settings/accounting/expenses">Expenses</Link></li>
                                </ul>
                            </div>
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

export default ExpensesAccount;
