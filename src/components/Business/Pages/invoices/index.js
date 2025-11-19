import React, { useEffect, useRef, useState } from 'react';
import { Download, Printer, Send } from 'react-bootstrap-icons';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Button } from 'primereact/button';
import { useDebounce } from 'primereact/hooks';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import style from './invoice.module.scss';
import InvoiceTable from './invoices-table';
import { paidExpense } from '../../../../APIs/expenses-api';
import { sendInvoiceToXeroApi } from '../../../../APIs/invoice-api';
import { formatAUD } from '../../../../shared/lib/format-aud';
import NewExpensesCreate from '../../features/expenses-features/new-expenses-create/new-expense-create';
import CreateStatement from '../../features/invoice-features/create-statement/create-statement';
import InvoiceDropdown from '../../features/invoice-features/invoice-filters/invoice-dropdown';
import InvoicesFilters from '../../features/invoice-features/invoice-filters/invoices-filters';

const InvoicePage = () => {
    const dt = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const isShowUnpaid = searchParams.get('isShowUnpaid');
    const searchParamValue = searchParams.get('search');
    const targetId = searchParams.get('targetId');
    const [total, setTotal] = useState(0);
    const [totalMoney, setTotalMoney] = useState(0);
    const [filter, setFilters] = useState({});
    const [isStatementCreationPossible, setIsStatementCreationPossible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [refetch, setRefetch] = useState(false);
    const [isShowDeleted, setIsShowDeleted] = useState(isShowUnpaid ? true : false);
    const [selected, setSelected] = useState(null);
    const [inputValue, debouncedValue, setInputValue] = useDebounce('', 400);
    const [shouldHighlight, setShouldHighlight] = useState(false);

    const exportCSV = (selectionOnly) => {
        if (!selected || selected.length === 0) {
            toast.error('Please select invoices to export');
            return;
        }

        // Format date function similar to the table
        const formatDate = (timestamp) => {
            try {
                const date = new Date(timestamp * 1000);
                const day = date.getDate();
                const monthAbbreviation = new Intl.DateTimeFormat("en-US", {
                    month: "short",
                }).format(date);
                const year = date.getFullYear();
                return `${day} ${monthAbbreviation} ${year}`;
            } catch (error) {
                console.log('error: ', error);
                return '';
            }
        };

        // Transform data to match your CSV format exactly like print function
        const csvData = selected.map(invoice => ({
            'Invoice ID': invoice.number || '',
            'Created at': invoice.created ? formatDate(invoice.created) : '',
            'Customer A→Z': invoice.client?.name || '',
            'Invoice Reference': invoice.reference || '',
            'Due Date': invoice.due_date ? formatDate(invoice.due_date) : '',
            'Total invoice': invoice.amount ? `$${formatAUD(invoice.amount)}` : '$0.00',
            'To be paid': invoice.to_be_paid ? `$${formatAUD(invoice.to_be_paid)}` : '$0.00',
        }));

        // Convert to CSV and download
        exportToCSV(csvData, `invoices_${new Date().toISOString().split('T')[0]}.csv`);
    };

    // Helper function to convert data to CSV
    const exportToCSV = (data, filename) => {
        if (data.length === 0) {
            toast.error('No data to export');
            return;
        }

        const headers = Object.keys(data[0]);
        const csvHeaders = headers.map(header => `"${header}"`).join(',');
        const csvRows = data.map(row => 
            headers.map(header => `"${(row[header] || '').toString().replace(/"/g, '""')}"`).join(',')
        );

        const csvContent = [csvHeaders, ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const printInvoices = () => {
        if (!selected || selected.length === 0) {
            toast.error('Please select invoices to print');
            return;
        }

        // Format date function similar to the table
        const formatDate = (timestamp) => {
            try {
                const date = new Date(timestamp * 1000);
                const day = date.getDate();
                const monthAbbreviation = new Intl.DateTimeFormat("en-US", {
                    month: "short",
                }).format(date);
                const year = date.getFullYear();
                return `${day} ${monthAbbreviation} ${year}`;
            } catch (error) {
                console.log('error: ', error);
                return '';
            }
        };

        const printWindow = window.open('', '_blank');
        const totalAmount = selected.reduce((sum, inv) => sum + (inv.amount || 0), 0);
        const totalOutstanding = selected.reduce((sum, inv) => sum + (inv.to_be_paid || 0), 0);

        printWindow.document.write(`
            <html>
                <head>
                    <title>&nbsp;</title>
                    <style>
                        body { 
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                            margin: 20px; 
                            line-height: 1.4;
                        }
                        .header { 
                            text-align: center; 
                            margin-bottom: 30px; 
                            border-bottom: 1px solid #dedede;
                            padding-bottom: 0px;
                        }
                        .meta-info { 
                            text-align: right; 
                            margin-bottom: 20px; 
                            color: #666;
                            font-size: 14px;
                        }
                        table { 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin-top: 20px; 
                            font-size: 8px;
                        }
                        th, td { 
                            border: 1px solid #ddd; 
                            padding: 10px; 
                            text-align: left; 
                        }
                        th { 
                            background-color: #f8f9fa; 
                            font-weight: bold;
                            color: #333;
                        }
                        tr:nth-child(even) { 
                            background-color: #f9f9f9; 
                        }
                        .total-row {
                            font-weight: bold;
                            background-color: #e9ecef !important;
                        }
                        @media print {
                            body { margin: 0; }
                            .no-print { display: none; }
                            @page {
                                margin: 0.5in;
                                size: A4;
                                @bottom-left {
                                    content: "Generated on ${new Date().toLocaleString()}";
                                    font-size: 8px;
                                    color: #666;
                                }
                                @bottom-right {
                                    content: "Page " counter(page) " of " counter(pages);
                                    font-size: 8px;
                                    color: #666;
                                }
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h4>Invoices Report</h4>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Invoice ID</th>
                                <th style="white-space: nowrap;">Created At</th>
                                <th>Customer</th>
                                <th>Invoice Reference</th>
                                <th style="white-space: nowrap;">Due Date</th>
                                <th>Total Invoice</th>
                                <th>To be Paid</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${selected.map(invoice => `
                                <tr>
                                    <td>${invoice.number || ''}</td>
                                    <td style="white-space: nowrap;">${invoice.created ? formatDate(invoice.created) : ''}</td>
                                    <td>${invoice.client?.name || ''}</td>
                                    <td>${invoice.reference || ''}</td>
                                    <td style="white-space: nowrap;">${invoice.due_date ? formatDate(invoice.due_date) : ''}</td>
                                    <td>$${formatAUD(invoice.amount || 0)}</td>
                                    <td>$${formatAUD(invoice.to_be_paid || 0)}</td>
                                </tr>
                            `).join('')}
                            <tr class="total-row">
                                <td colspan="5"><strong>Total</strong></td>
                                <td><strong>$${formatAUD(totalAmount)}</strong></td>
                                <td><strong>$${formatAUD(totalOutstanding)}</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </body>
            </html>
        `);
        printWindow.document.close();
        
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
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

    const sendInvoiceToXeroMutation = useMutation({
        mutationFn: (data) => sendInvoiceToXeroApi(data),
        onSuccess: () => {
            setRefetch((refetch) => !refetch);
            setSelected(null);
            toast.success(`Invoice successfully sent to Xero!`);
        },
        onError: (error) => {
            console.log('error: ', error);
            toast.error(`Failed to send the invoice to xero. Please try again.`);
        }
    });

    const sendInvoiceToXero = () => {
        const ids = selected.map(item => item.unique_id);
        sendInvoiceToXeroMutation.mutate({ ids: ids });
    };

    const handleUnpaid = () => {
        setIsShowDeleted(!isShowDeleted);
        if (isShowUnpaid === 'true' && isShowDeleted) {
            window.history.pushState({}, '', '/invoices');
        }
    };

    useEffect(() => {
        if (selected?.length) {
            const findSameSupplier = selected.every(item => item?.client?.id === selected[0].client?.id);
            setIsStatementCreationPossible(findSameSupplier);
        }else {
            setIsStatementCreationPossible(false);
        }
    }, [selected]);

    // Handle search from notification redirect
    useEffect(() => {
        if (searchParamValue && targetId) {
            // Set the search input value which will trigger debounce
            setInputValue(searchParamValue);
            // Mark that we should highlight once data loads
            setShouldHighlight(true);
        }
    }, [searchParamValue, targetId, setInputValue]);

    // Wait for debounced value to change and data to load, then highlight
    useEffect(() => {
        if (!shouldHighlight || !targetId || debouncedValue !== searchParamValue) return;

        const highlightAndScroll = (row) => {
            row.classList.add('highlight-row');
            setTimeout(() => row.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
            
            // Remove highlight after 6 seconds
            setTimeout(() => {
                row.classList.remove('highlight-row');
                setShouldHighlight(false);
                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.delete('search');
                newSearchParams.delete('targetId');
                setSearchParams(newSearchParams, { replace: true });
            }, 6000);
        };

        const attemptHighlight = (delay, isRetry = false) => {
            return setTimeout(() => {
                const targetRow = document.querySelector(`.row-id-${targetId}`);
                if (targetRow) {
                    highlightAndScroll(targetRow);
                } else if (!isRetry) {
                    // Retry once after additional delay
                    const retryTimer = attemptHighlight(1500, true);
                    return () => clearTimeout(retryTimer);
                } else {
                    setShouldHighlight(false);
                    console.warn('Target row not found:', targetId);
                }
            }, delay);
        };

        const timer = attemptHighlight(800);
        return () => clearTimeout(timer);
    }, [shouldHighlight, targetId, debouncedValue, searchParamValue, searchParams, setSearchParams]);

    return (
        <div className='peoples-page'>
            <Helmet>
                <title>MeMate - Invoices</title>
            </Helmet>
            <div className={`topbar ${selected?.length ? style.active : ''}`} style={{ padding: '4px 32px 4px 23px', position: 'relative', height: '48px' }}>
                <div className='left-side d-flex align-items-center' style={{ gap: '16px' }}>
                    {
                        selected?.length ? (
                            <>
                                <h6 className={style.selectedCount}>Selected: {selected?.length}</h6>
                                <div className='filtered-box d-flex align-items-center gap-2'>
                                    <button className={`outline-button ${style.actionButton}`} disabled={sendInvoiceToXeroMutation.isPending} onClick={sendInvoiceToXero}>Send to Xero/MYOB
                                        {
                                            sendInvoiceToXeroMutation.isPending
                                                ? <ProgressSpinner
                                                    style={{ width: "20px", height: "20px" }}
                                                /> : <Send color='#1D2939' size={20} />
                                        }
                                    </button>
                                    <button className={`${style.filterBox}`} onClick={() => exportCSV(true)}><Download /></button>
                                    <button className={`${style.filterBox}`} onClick={printInvoices}><Printer /></button>
                                </div>
                            </>
                        )
                            : (
                                <>
                                    <div className='filtered-box'>
                                        <InvoiceDropdown setFilters={setFilters} filter={filter} />
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
                    <h1 className="title p-0">Invoices</h1>
                </div>
                <div className="right-side d-flex align-items-center" style={{ gap: '8px' }}>
                    {isStatementCreationPossible && <CreateStatement invoices={selected} />}
                    <Button className={isShowDeleted ? style.unpaidInvoice : style.allInvoice} onClick={handleUnpaid}>Unpaid</Button>
                    {isShowDeleted && <>
                        <h1 className={`${style.total} mb-0`}>Total</h1>
                        <div className={`${style.totalCount}`}>{total} Invoice</div>
                        <h1 className={style.totalMoney}>${formatAUD(totalMoney || 0.00)}</h1>
                    </>
                    }
                </div>
            </div>
            {
                Object.keys(filter)?.length > 0 && (
                    <InvoicesFilters filter={filter} setFilters={setFilters} />
                )
            }
            <InvoiceTable ref={dt} searchValue={debouncedValue} setTotal={setTotal} setTotalMoney={setTotalMoney}
                selected={selected} setSelected={setSelected}
                isShowDeleted={isShowDeleted}
                refetch={refetch}
                setRefetch={setRefetch}
                isFilterEnabled={Object.keys(filter)?.length > 0}
                filters={filter}
            />
            <NewExpensesCreate visible={visible} setVisible={setVisible} setRefetch={setRefetch} />
        </div>
    );
};

export default InvoicePage;