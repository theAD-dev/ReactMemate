import React from 'react'
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Filter } from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';

import PeoplesTable from './peoples-table';
import style from './people.module.scss';

const PeoplePage = () => {
    const handleSearch = (e) => { }
    return (
        <PrimeReactProvider className='peoples-page'>
            <div className="topbar" style={{ padding: '4px 46px', position: 'relative', height: '48px' }}>
                <div className='left-side d-flex align-items-center' style={{ gap: '16px' }}>
                    <div className='filtered-box'>
                        <button className={`${style.filterBox}`}><Filter /></button>
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

                <div className="featureName d-flex align-items-center" style={{ position: 'absolute', left: '47%', top: '6px' }}>
                    <h1 className="title p-0" style={{ marginRight: '16px' }}>People</h1>
                    <Button className={`${style.newButton}`}>New</Button>
                </div>
                <div className="right-side d-flex align-items-center" style={{ gap: '8px' }}>
                    <div className={`${style.totalActive}`}>Active: 130</div>
                    <div className={`${style.totalInActive}`}>In Active: 93</div>
                </div>
            </div>
            <PeoplesTable/>
        </PrimeReactProvider>
    )
}

export default PeoplePage