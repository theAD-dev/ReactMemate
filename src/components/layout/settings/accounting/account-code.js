import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import { useAccountCodeGetQuery } from '../../../../entities/setting/accounting/department-turnover-plan/models/get-accounting-list.query';

const AccountCode = () => {
    const { trialHeight } = useTrialHeight();
    const [accountCodes, setAccountCodes] = useState([]);
    const accountCodeQuery = useAccountCodeGetQuery();

    useEffect(() => {
        if (accountCodeQuery?.data) {
            const codes = accountCodeQuery?.data.flatMap(code =>
                code.codes.map(item => ({
                    ...item,
                    category: code.category
                }))
            );
            setAccountCodes(codes);
        }
    }, [accountCodeQuery?.data]);

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
                        <li><Link to="/settings/accounting/industry-service">Supplier Categories</Link></li>
                        <li className='menuActive'><Link to="/settings/accounting/account-code">Account Codes</Link></li>
                    </ul>
                </div>
            </div>
            <div className={`content_wrap_main w-100`} style={{ paddingBottom: `${trialHeight}px` }}>
                <div className='content_wrapper w-100'>
                    <div className="listwrapper">
                        <div className="topHeadStyle pb-3">
                            <h2>Account Codes</h2>
                        </div>

                        <DataTable className='w-100' showGridlines rowGroupMode="rowspan" groupRowsBy="category" value={accountCodes || []} tableStyle={{ minWidth: '100%', border: '1px solid #f2f2f2' }}>
                            <Column header="#" body={(data, options) => options.rowIndex + 1}></Column>
                            <Column field="category" header="Category"></Column>
                            <Column field="code" header="Codes"></Column>
                            <Column field="name" header="Account Name"></Column>
                            <Column field='description' header="Description"></Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AccountCode;
