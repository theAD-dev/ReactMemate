import React, { useRef, useState } from 'react'
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { CheckCircle, Download, Eye, EyeSlash, Filter, Printer, Send, XCircle } from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';
import { useDebounce } from 'primereact/hooks';

import style from './invoice.module.scss';
import NewExpensesCreate from '../../features/expenses-features/new-expenses-create/new-expense-create';
import { TieredMenu } from 'primereact/tieredmenu';
import clsx from 'clsx';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { paidExpense, unpaidExpense } from '../../../../APIs/expenses-api';
import { ProgressSpinner } from 'primereact/progressspinner';
import InvoiceTable from './invoices-table';
import { sendInvoiceToXeroApi } from '../../../../APIs/invoice-api';

const InvoicePage = () => {
    const dt = useRef(null);
    const menu = useRef(null);
    const [total, setTotal] = useState(0);
    const [visible, setVisible] = useState(false);
    const [refetch, setRefetch] = useState(false);
    const [isShowDeleted, setIsShowDeleted] = useState(false);
    const [selected, setSelected] = useState(null);
    const [inputValue, debouncedValue, setInputValue] = useDebounce('', 400);

    const exportCSV = (selectionOnly) => {
        if (dt.current) {
            dt.current.exportCSV({ selectionOnly });
        } else {
            console.error('DataTable ref is null');
        }
    };

    const paidMutation = useMutation({
        mutationFn: (data) => paidExpense(data),
        onSuccess: () => {
            setRefetch((refetch) => !refetch);
            setSelected(null);
            toast.success(`Expenses have been successfully marked as paid.`);
        },
        onError: (error) => {
            toast.error(`Failed to mark the expenses as paid. Please try again.`);
        }
    });

    const handlePaidExpense = () => {
        const ids = selected.map(item => item.id);
        paidMutation.mutate({ ids: ids });
    }

    const sendInvoiceToXeroMutation = useMutation({
        mutationFn: (data) => sendInvoiceToXeroApi(data),
        onSuccess: () => {
            setRefetch((refetch) => !refetch);
            setSelected(null);
            toast.success(`Invoice successfully sent to Xero!`);
        },
        onError: (error) => {
            toast.error(`Failed to send the invoice to xero. Please try again.`);
        }
    });

    const sendInvoiceToXero = () => {
        const ids = selected.map(item => item.unique_id);
        sendInvoiceToXeroMutation.mutate({ ids: ids });
    }

    return (
        <PrimeReactProvider className='peoples-page'>
            <div className={`topbar ${selected?.length ? style.active : ''}`} style={{ padding: '4px 32px 4px 23px', position: 'relative', height: '48px' }}>
                <div className='left-side d-flex align-items-center' style={{ gap: '16px' }}>
                    {
                        selected?.length ? (
                            <>
                                <h6 className={style.selectedCount}>Selected: {selected?.length}</h6>
                                <div className='filtered-box d-flex align-items-center gap-2'>
                                    <button className={`outline-button ${style.actionButton}`} onClick={sendInvoiceToXero}>Send to Xero/MYOB
                                        {
                                            sendInvoiceToXeroMutation.isPending
                                                ? <ProgressSpinner
                                                    style={{ width: "20px", height: "20px" }}
                                                /> : <Send color='#1D2939' size={20} />
                                        }
                                    </button>
                                    <button className={`${style.filterBox}`} onClick={() => exportCSV(true)}><Download /></button>
                                    <button className={`${style.filterBox}`} onClick={() => { }}><Printer /></button>
                                </div>
                            </>
                        )
                            : (
                                <>
                                    <div className='filtered-box'>
                                        <button className={`${style.filterBox}`} onClick={(e) => menu.current.toggle(e)}><Filter /></button>
                                        <TieredMenu model={[{
                                            label: <div onClick={() => setIsShowDeleted(!isShowDeleted)} className='d-flex align-items-center text-nowrap gap-3 p'>
                                                {
                                                    isShowDeleted ? (<>Hide Deleted <EyeSlash /></>)
                                                        : (<>Show Deleted <Eye /></>)
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
                                        <input type="text" placeholder="Search" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="border search-resource" style={{ borderRadius: '4px', width: '184px', border: '1px solid #D0D5DD', color: '#98A2B3', paddingLeft: '36px', fontSize: '14px', height: '32px' }} />
                                    </div>
                                </>
                            )
                    }
                </div>

                <div className="featureName d-flex align-items-center" style={{ position: 'absolute', left: '47%', top: '6px' }}>
                    <h1 className="title p-0 mt-1" style={{ marginRight: '16px' }}>Invoices</h1>
                </div>
                <div className="right-side d-flex align-items-center" style={{ gap: '8px' }}>
                </div>
            </div>
            <InvoiceTable ref={dt} searchValue={debouncedValue} setTotal={setTotal}
                selected={selected} setSelected={setSelected}
                isShowDeleted={isShowDeleted}
                refetch={refetch}
                setRefetch={setRefetch}
            />
            <NewExpensesCreate visible={visible} setVisible={setVisible} setRefetch={setRefetch} />
        </PrimeReactProvider>
    )
}

export default InvoicePage