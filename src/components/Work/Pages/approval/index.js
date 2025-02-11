import React from 'react';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Filter } from 'react-bootstrap-icons';

import style from './approval.module.scss';
import ApprovalTable from './approval-table';

const ApprovalPage = () => {
    const handleSearch = (e) => { }
    return (
        <PrimeReactProvider className='approval-page'>
            <div className="topbar" style={{ padding: '4px 46px', position: 'relative', height: '48px' }}>
                <div className='left-side d-flex align-items-center' style={{ gap: '16px' }}>
                    <div className='filtered-box'>
                        <button className={`${style.filterBox}`}><Filter size={20}/></button>
                    </div>
                    <div className="searchBox" style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '2px', left: '6px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M14.6777 12.9299C15.6661 11.5841 16.25 9.92275 16.25 8.125C16.25 3.63769 12.6123 0 8.125 0C3.63769 0 0 3.63769 0 8.125C0 12.6123 3.63769 16.25 8.125 16.25C9.92323 16.25 11.585 15.6658 12.9309 14.6769L12.9299 14.6777C12.9667 14.7277 13.0078 14.7756 13.053 14.8208L17.8661 19.6339C18.3543 20.122 19.1457 20.122 19.6339 19.6339C20.122 19.1457 20.122 18.3543 19.6339 17.8661L14.8208 13.053C14.7756 13.0078 14.7277 12.9667 14.6777 12.9299ZM15 8.125C15 11.922 11.922 15 8.125 15C4.32804 15 1.25 11.922 1.25 8.125C1.25 4.32804 4.32804 1.25 8.125 1.25C11.922 1.25 15 4.32804 15 8.125Z" fill="#98A2B3" />
                            </svg>
                        </div>
                        <input type="text" placeholder="Search" onChange={handleSearch} className="border search-resource" style={{ borderRadius: '4px', width: '184px', border: '1px solid #D0D5DD', color: '#98A2B3', paddingLeft: '36px', fontSize: '14px', height: '32px' }} />
                    </div>
                </div>

                <div className="featureName d-flex align-items-center" style={{ position: 'absolute', left: '48%', top: '6px' }}>
                    <h1 className="title p-0 mt-1">Approval</h1>
                </div>

                <div className="right-side d-flex align-items-center" style={{ gap: '8px' }}>
                    <h1 className={`${style.total} mb-0`}>Total</h1>
                    <div className={`${style.totalCount}`}>30 Jobs</div>
                </div>
            </div>

            <div className="topbar d-flex justify-content-center text-center" style={{ padding: '4px 46px', position: 'relative', height: '48px', borderTop: '1px solid #dedede', borderBottom: '0px solid #dedede', background: '#F9FAFB' }}>
                <div className='d-flex align-items-center' style={{ gap: '32px' }}>
                    <button className='border-0' style={{ background: 'transparent' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.35355 1.80514C8.54882 2.0004 8.54882 2.31698 8.35355 2.51224L2.70711 8.15869L8.35355 13.8051C8.54882 14.0004 8.54882 14.317 8.35355 14.5122C8.15829 14.7075 7.84171 14.7075 7.64645 14.5122L1.64645 8.51224C1.45118 8.31698 1.45118 8.0004 1.64645 7.80514L7.64645 1.80514C7.84171 1.60988 8.15829 1.60988 8.35355 1.80514Z" fill="#344054" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.3536 1.80514C12.5488 2.0004 12.5488 2.31698 12.3536 2.51224L6.70711 8.15869L12.3536 13.8051C12.5488 14.0004 12.5488 14.317 12.3536 14.5122C12.1583 14.7075 11.8417 14.7075 11.6464 14.5122L5.64645 8.51224C5.45118 8.31698 5.45118 8.0004 5.64645 7.80514L11.6464 1.80514C11.8417 1.60988 12.1583 1.60988 12.3536 1.80514Z" fill="#344054" />
                        </svg>
                    </button>
                    <span className='font-14' style={{ color: '#344054' }}>Week 35 | 26 Aug -1 Sep</span>
                    <button className='border-0' style={{ background: 'transparent' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.64645 1.80514C3.84171 1.60988 4.15829 1.60988 4.35355 1.80514L10.3536 7.80514C10.5488 8.0004 10.5488 8.31698 10.3536 8.51224L4.35355 14.5122C4.15829 14.7075 3.84171 14.7075 3.64645 14.5122C3.45118 14.317 3.45118 14.0004 3.64645 13.8051L9.29289 8.15869L3.64645 2.51224C3.45118 2.31698 3.45118 2.0004 3.64645 1.80514Z" fill="#344054" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.64645 1.80514C7.84171 1.60988 8.15829 1.60988 8.35355 1.80514L14.3536 7.80514C14.5488 8.0004 14.5488 8.31698 14.3536 8.51224L8.35355 14.5122C8.15829 14.7075 7.84171 14.7075 7.64645 14.5122C7.45118 14.317 7.45118 14.0004 7.64645 13.8051L13.2929 8.15869L7.64645 2.51224C7.45118 2.31698 7.45118 2.0004 7.64645 1.80514Z" fill="#344054" />
                        </svg>
                    </button>
                </div>
            </div>
            <ApprovalTable />
        </PrimeReactProvider>
    )
}

export default ApprovalPage