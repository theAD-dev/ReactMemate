import React, { useState } from 'react'
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { ChevronLeft } from 'react-bootstrap-icons';
import { Button } from 'primereact/button';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { Sidebar } from 'primereact/sidebar';

import style from './client-order-history.module.scss';
import ClientOrderHistoryTable from './client-order-history-table';
import { clientOrderHistory, getClientById } from '../../../../../APIs/ClientsApi';
import IndivisualClientView from '../../../features/indivisual-client-view/indivisual-client-view';
import BusinessClientView from '../../../features/business-client-view/business-client-view';

const ClientOrderHistory = () => {
    const { id } = useParams();
    const [visible, setVisible] = useState(true);

    const clientDetails = useQuery({ queryKey: ['client-read'], queryFn: () => getClientById(id), enabled: !!id, retry: 1 });
    const clientOrders = useQuery({ queryKey: ['client-order'], queryFn: () => clientOrderHistory(id), enabled: !!id, retry: 1 });

    const handleSearch = (e) => { }

    return (
        <PrimeReactProvider className='client-order-history-page'>
            <div className='client-order-history' style={{ width: visible ? 'calc(100% - 559px)' : '100%' }}>
                <div className={`topbar`} style={{ padding: '4px 32px 4px 23px', position: 'relative', height: '48px' }}>
                    <div className='left-side d-flex align-items-center' style={{ gap: '16px' }}>
                        <div className='filtered-box'>
                            <Link to={"/clients"} className={`${style.gobackBtn}`}><ChevronLeft color='#1AB2FF' size={20} /> Go Back</Link>
                        </div>

                        <div className="searchBox" style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '5px', left: '8px' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M14.6777 12.9299C15.6661 11.5841 16.25 9.92275 16.25 8.125C16.25 3.63769 12.6123 0 8.125 0C3.63769 0 0 3.63769 0 8.125C0 12.6123 3.63769 16.25 8.125 16.25C9.92323 16.25 11.585 15.6658 12.9309 14.6769L12.9299 14.6777C12.9667 14.7277 13.0078 14.7756 13.053 14.8208L17.8661 19.6339C18.3543 20.122 19.1457 20.122 19.6339 19.6339C20.122 19.1457 20.122 18.3543 19.6339 17.8661L14.8208 13.053C14.7756 13.0078 14.7277 12.9667 14.6777 12.9299ZM15 8.125C15 11.922 11.922 15 8.125 15C4.32804 15 1.25 11.922 1.25 8.125C1.25 4.32804 4.32804 1.25 8.125 1.25C11.922 1.25 15 4.32804 15 8.125Z" fill="#98A2B3" />
                                </svg>
                            </div>
                            <input type="text" placeholder="Search" onChange={handleSearch} className="border search-resource" style={{ borderRadius: '4px', border: '1px solid #D0D5DD', paddingLeft: '36px', fontSize: '16px', height: '36px' }} />
                        </div>

                    </div>

                    <div className="featureName d-flex align-items-center" style={{ position: 'absolute', left: '47%' }}>
                        <h1 onClick={() => { setVisible(true) }} className={`${style.clientName} m-0 p-0 cursor-pointer`}>{clientDetails?.data?.name || ""}</h1>
                    </div>
                    <div className="right-side d-flex align-items-center" style={{ gap: '8px' }}>
                        <Button label="Download" onClick={() => { }} className='primary-text-button' text />
                    </div>
                </div>
                <ClientOrderHistoryTable clientOrders={clientOrders?.data || []} isPending={clientOrders?.isPending} />
            </div>
            <Sidebar visible={visible} position="right" onHide={() => setVisible(false)} modal={false} style={{ width: '559px' }}
                content={({ closeIconRef, hide }) => (
                    clientDetails?.data?.is_business
                        ? <BusinessClientView client={clientDetails?.data || {}} closeIconRef={closeIconRef} hide={hide} />
                        : clientDetails?.data?.is_business === false
                            ? <IndivisualClientView client={clientDetails?.data || {}} closeIconRef={closeIconRef} hide={hide} />
                            : "Loading ..."
                )}
            ></Sidebar>
        </PrimeReactProvider>
    )
}

export default ClientOrderHistory