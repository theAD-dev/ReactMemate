import React, { useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { CheckCircle, Download, Send, XCircle } from 'react-bootstrap-icons';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { useDebounce } from 'primereact/hooks';
import { ProgressSpinner } from 'primereact/progressspinner';
import { TieredMenu } from 'primereact/tieredmenu';
import { toast } from 'sonner';
import ExpensesTable from './expenses-table';
import style from './expenses.module.scss';
import { paidExpense, sendExpenseToXeroApi, unpaidExpense } from '../../../../APIs/expenses-api';
import { formatAUD } from '../../../../shared/lib/format-aud';
import ExpenseDropdown from '../../features/expenses-features/expense-filters/expense-dropdown';
import ExpenseFilters from '../../features/expenses-features/expense-filters/expense-filters';
import NewExpensesCreate from '../../features/expenses-features/new-expenses-create/new-expense-create';

const ExpensesPage = () => {
    const dt = useRef(null);
    const menu = useRef(null);
    const [searchParams] = useSearchParams();
    const isShowUnpaid = searchParams.get('isShowUnpaid');
    const [total, setTotal] = useState(0);
    const [totalMoney, setTotalMoney] = useState(0);
    const [visible, setVisible] = useState(false);
    const [refetch, setRefetch] = useState(false);
    const [isShowDeleted, setIsShowDeleted] = useState(isShowUnpaid ? true : false);
    const [selected, setSelected] = useState(null);
    const [inputValue, debouncedValue, setInputValue] = useDebounce('', 400);
    const [filter, setFilter] = useState({});

    // Wrapper function for setFilters to handle the expected pattern
    const setFilters = (updaterFunction) => {
        if (typeof updaterFunction === 'function') {
            setFilter(prev => updaterFunction(prev || {}));
        } else {
            setFilter(updaterFunction || {});
        }
    };

    const exportCSV = (selectionOnly) => {
        if (dt.current) {
            dt.current.exportCSV({ selectionOnly });
        } else {
            console.error('DataTable ref is null');
        }
    };

    const sendExpenseToXeroMutation = useMutation({
        mutationFn: (data) => sendExpenseToXeroApi(data),
        onSuccess: () => {
            setRefetch((refetch) => !refetch);
            setSelected(null);
            toast.success(`Expense successfully sent to Xero!`);
        },
        onError: (error) => {
            console.log('error: ', error);
            toast.error(`Failed to send the expense to xero. Please try again.`);
        }
    });

    const sendExpenseToXero = () => {
        const ids = selected.map(item => item.id);
        sendExpenseToXeroMutation.mutate({ ids: ids });
    };

    const paidMutation = useMutation({
        mutationFn: (data) => paidExpense(data),
        onSuccess: () => {
            setRefetch((refetch) => !refetch);
            setSelected(null);
            toast.success(`Expenses have been successfully marked as paid.`);
        },
        onError: (error) => {
            console.log('error: ', error);
            toast.error(`Failed to mark the expenses as paid. Please try again.`);
        }
    });

    const unpaidMutation = useMutation({
        mutationFn: (data) => unpaidExpense(data),
        onSuccess: () => {
            setRefetch((refetch) => !refetch);
            setSelected(null);
            toast.success(`Expenses have been successfully marked as unpaid.`);
        },
        onError: (error) => {
            console.log('error: ', error);
            toast.error(`Failed to mark the expenses as unpaid. Please try again.`);
        }
    });

    const handlePaidExpense = () => {
        const ids = selected.map(item => item.id);
        paidMutation.mutate({ ids: ids });
    };

    const handleUnPaidExpense = () => {
        const ids = selected.map(item => item.id);
        unpaidMutation.mutate({ ids: ids });
    };

    const handleUnpaid = () => {
        setIsShowDeleted(!isShowDeleted);
        if (isShowUnpaid === 'true' && isShowDeleted) {
            window.history.pushState({}, '', '/expenses');
        }
    };

    return (
        <div className='peoples-page'>
            <Helmet>
                <title>MeMate - Expenses</title>
            </Helmet>
            <div className={`topbar ${selected?.length ? style.active : ''}`} style={{ padding: '4px 32px 4px 23px', position: 'relative', height: '48px' }}>
                <div className='left-side d-flex align-items-center' style={{ gap: '16px' }}>
                    {
                        selected?.length ? (
                            <>
                                <h6 className={style.selectedCount}>Selected: {selected?.length}</h6>
                                <div className='filtered-box d-flex align-items-center gap-2'>
                                    <button className={`danger-outline-button ${style.actionButton}`} onClick={handleUnPaidExpense} disabled={unpaidMutation?.isPending}>Mark as Unpaid {unpaidMutation?.isPending ? <ProgressSpinner style={{ width: '20px', height: '20px' }} /> : <XCircle color='#B42318' size={20} />} </button>
                                    <button className={`success-outline-button ${style.actionButton}`} onClick={handlePaidExpense} disabled={paidMutation?.isPending}>Mark as Paid {paidMutation?.isPending ? <ProgressSpinner style={{ width: '20px', height: '20px' }} /> : <CheckCircle color='#067647' size={20} />} </button>
                                    <button className={`outline-button ${style.actionButton}`} onClick={sendExpenseToXero} disabled={sendExpenseToXeroMutation.isPending}>Send to Xero/MYOB
                                        {
                                            sendExpenseToXeroMutation.isPending
                                                ? <ProgressSpinner
                                                    style={{ width: "20px", height: "20px" }}
                                                /> : <Send color='#1D2939' size={20} />
                                        }
                                    </button>
                                    <button className={`${style.filterBox}`} onClick={() => exportCSV(true)}><Download /></button>
                                </div>
                            </>
                        )
                            : (
                                <>
                                    <div className='filtered-box'>
                                        <ExpenseDropdown filter={filter} setFilters={setFilters} />
                                        <TieredMenu model={[]} className={clsx(style.menu)} popup ref={menu} breakpoint="767px" />
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
                {
                    !selected?.length && (
                        <div className="featureName d-flex align-items-center" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                            <h1 className="title p-0" style={{ marginRight: '16px' }}>Expenses</h1>
                            <Button onClick={() => setVisible(true)} className={`${style.newButton}`}>New Expense</Button>
                        </div>
                    )
                }
                <div className="right-side d-flex align-items-center" style={{ gap: '8px' }}>
                    <Button className={isShowDeleted ? style.unpaidMoneyButton : style.allMoneyButton} onClick={handleUnpaid}>Unpaid</Button>
                    {isShowDeleted &&
                        <>
                            <h1 className={`${style.total} mb-0`}>Total</h1>
                            <div className={`${style.totalCount}`}>{total} Expenses</div>
                            <h1 className={style.totalMoney}>${formatAUD(totalMoney || 0.00)}</h1>
                        </>
                    }
                </div>
            </div>
            <ExpenseFilters filter={filter} setFilter={setFilter} />
            <ExpensesTable ref={dt} searchValue={debouncedValue} setTotal={setTotal} setTotalMoney={setTotalMoney}
                selected={selected} setSelected={setSelected}
                isShowDeleted={isShowDeleted}
                refetch={refetch}
                setRefetch={setRefetch}
                filter={filter}
            />
            <NewExpensesCreate visible={visible} setVisible={setVisible} setRefetch={setRefetch} />
        </div>
    );
};

export default ExpensesPage;