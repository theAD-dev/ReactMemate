import React, { useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Download, Filter, Eye, EyeSlash } from 'react-bootstrap-icons';
import { Helmet } from 'react-helmet-async';
import clsx from 'clsx';
import { useDebounce } from 'primereact/hooks';
import { TieredMenu } from 'primereact/tieredmenu';
import { SupplierTable } from './supplier-table';
import style from './suppliers.module.scss';
import SupplierCreate from '../../features/supliers-features/supplier-create';

const SupplierPage = () => {
    const dt = useRef(null);
    const menu = useRef(null);
    const [refetch, setRefetch] = useState(false);
    const [totalSuppliers, setTotalSuppliers] = useState(0);
    const [visible, setVisible] = useState(false);
    const [isShowDeleted, setIsShowDeleted] = useState(false);
    const [selectedSuppliers, setSelectedSuppliers] = useState(null);
    const [inputValue, debouncedValue, setInputValue] = useDebounce('', 400);

    const exportCSV = (selectionOnly) => {
        if (dt.current) {
            dt.current.exportCSV({ selectionOnly });
        } else {
            console.error('DataTable ref is null');
        }
    };

    return (
        <div className='peoples-page'>
            <Helmet>
                <title>MeMate - Suppliers</title>
            </Helmet>
            <div className={`topbar ${selectedSuppliers?.length ? style.active : ''}`} style={{ padding: '4px 32px 4px 23px', position: 'relative', height: '48px' }}>
                <div className='left-side d-flex align-items-center' style={{ gap: '16px' }}>
                    {
                        selectedSuppliers?.length ? (
                            <>
                                <h6 className={style.selectedCount}>Selected: {selectedSuppliers?.length}</h6>
                                <div className='filtered-box'>
                                    <button className={`${style.filterBox}`} onClick={() => exportCSV(true)}><Download /></button>
                                </div>
                            </>
                        )
                            : (
                                <>
                                    <div className='filtered-box'>
                                        <button className={`${style.filterBox}`} onClick={(e) => menu.current.toggle(e)}><Filter size={20} /></button>
                                        <TieredMenu model={[{
                                            label: <div onClick={() => setIsShowDeleted(!isShowDeleted)} className='d-flex align-items-center text-nowrap gap-3 p'>
                                                {
                                                    isShowDeleted ? (<>Hide Deleted Clients <EyeSlash /></>)
                                                        : (<>Show Deleted Suppliers <Eye /></>)
                                                }
                                            </div>,
                                        }]} className={clsx(style.menu)} popup ref={menu} breakpoint="767px" />
                                    </div>

                                    <div className="searchBox" style={{ position: 'relative' }}>
                                        <div style={{ position: 'absolute', top: '2px', left: '6px' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M14.6777 12.9299C15.6661 11.5841 16.25 9.92275 16.25 8.125C16.25 3.63769 12.6123 0 8.125 0C3.63769 0 0 3.63769 0 8.125C0 12.6123 3.63769 16.25 8.125 16.25C9.92323 16.25 11.585 15.6658 12.9309 14.6769L12.9299 14.6777C12.9667 14.7277 13.0078 14.7756 13.053 14.8208L17.8661 19.6339C18.3543 20.122 19.1457 20.122 19.6339 19.6339C20.122 19.1457 20.122 18.3543 19.6339 17.8661L14.8208 13.053C14.7756 13.0078 14.7277 12.9667 14.6777 12.9299ZM15 8.125C15 11.922 11.922 15 8.125 15C4.32804 15 1.25 11.922 1.25 8.125C1.25 4.32804 4.32804 1.25 8.125 1.25C11.922 1.25 15 4.32804 15 8.125Z" fill="#98A2B3" />
                                            </svg>
                                        </div>
                                        <input type="text" placeholder="Search" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="border search-resource" style={{ borderRadius: '4px', width: '184px', border: '1px solid #D0D5DD', color: '#424242', paddingLeft: '36px', fontSize: '14px', height: '32px' }} />
                                    </div>
                                </>
                            )
                    }
                </div>

                <div className="featureName d-flex align-items-center" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                    <h1 className="title p-0" style={{ marginRight: '16px' }}>Suppliers</h1>
                    <Button onClick={() => setVisible(true)} className={`${style.newButton}`}>New</Button>
                </div>
                <div className="right-side d-flex align-items-center" style={{ gap: '8px' }}>
                    <h1 className={`${style.total} mb-0`}>Total</h1>
                    <div className={`${style.totalCount}`}>{totalSuppliers} Suppliers</div>
                </div>
            </div>
            <SupplierTable ref={dt} searchValue={debouncedValue} setTotalSuppliers={setTotalSuppliers} selectedSuppliers={selectedSuppliers} setSelectedSuppliers={setSelectedSuppliers} isShowDeleted={isShowDeleted} refetch={refetch} />
            <SupplierCreate visible={visible} setVisible={setVisible} refetch={setRefetch} />
        </div>
    );
};

export default SupplierPage;