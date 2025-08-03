

import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { CloseButton } from 'react-bootstrap';
import { FilePdf, Link45deg, InfoCircle, ThreeDotsVertical, Files, FileEarmarkSpreadsheet, Trash, PlusLg, Coin, Calendar3Event, Bank, Stripe, Cash, CreditCard, CurrencyDollar } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { ControlledMenu, useClick } from '@szhsin/react-menu';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { toast } from 'sonner';
import style from './invoice.module.scss';
import { deleteInvoice, getListOfInvoice } from '../../../../APIs/invoice-api';
import { fetchduplicateData } from '../../../../APIs/SalesApi';
import { useAuth } from '../../../../app/providers/auth-provider';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import { PERMISSIONS } from '../../../../shared/lib/access-control/permission';
import { hasPermission } from '../../../../shared/lib/access-control/role-permission';
import { formatAUD } from '../../../../shared/lib/format-aud';
import Loader from '../../../../shared/ui/loader/loader';
import ImageAvatar from '../../../../ui/image-with-fallback/image-avatar';
import NoDataFoundTemplate from '../../../../ui/no-data-template/no-data-found-template';
import InvoicePartialPayment from '../../features/invoice-features/invoice-partial-payment/invoice-partial-payment';
import ResendInvoiceEmail from '../../features/invoice-features/resend-email/resend-email';
import SendInvoiceEmail from '../../features/invoice-features/send-email/send-email';

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

const InvoiceTable = forwardRef(({ searchValue, setTotal, setTotalMoney, selected, setSelected, isShowDeleted, refetch, setRefetch, isFilterEnabled, filters }, ref) => {
    const { role } = useAuth();
    const observerRef = useRef(null);
    const navigate = useNavigate();
    const { trialHeight } = useTrialHeight();
    const [invoices, setInvoices] = useState([]);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState({ sortField: 'number', sortOrder: -1 });
    const [tempSort, setTempSort] = useState({ sortField: 'number', sortOrder: -1 });
    const [hasMoreData, setHasMoreData] = useState(true);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [invoiceData, setInvoiceData] = useState(null);
    const limit = 25;

    useEffect(() => {
        setPage(1);  // Reset to page 1 whenever searchValue changes
    }, [searchValue, refetch, isShowDeleted, filters]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            let order = "";
            if (tempSort?.sortOrder === 1) order = `${tempSort.sortField}`;
            else if (tempSort?.sortOrder === -1) order = `-${tempSort.sortField}`;
            
            let clientsFilter = '';
            if (filters?.client) {
                clientsFilter = filters?.client?.map(client => client.id).join(',');
            }

            const data = await getListOfInvoice(page, limit, searchValue, order, isShowDeleted, clientsFilter);
            setTotal(() => (data?.count || 0));
            setTotalMoney(data?.total_amount || 0);
            if (page === 1) setInvoices(data.results);
            else {
                if (data?.results?.length > 0)
                    setInvoices(prev => {
                        const existingClientIds = new Set(prev.map(client => client.id));
                        const newClients = data.results.filter(client => !existingClientIds.has(client.id));
                        return [...prev, ...newClients];
                    });
            }
            setSort(tempSort);
            setHasMoreData(data.count !== invoices.length);
            setLoading(false);
        };

        loadData();

    }, [page, searchValue, tempSort, refetch, isShowDeleted, JSON.stringify(filters)]);

    useEffect(() => {
        if (invoices.length > 0 && hasMoreData) {
            observerRef.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) setPage(prevPage => prevPage + 1);
            });

            const lastRow = document.querySelector('.p-datatable-tbody tr:not(.p-datatable-emptymessage):last-child');
            if (lastRow) observerRef.current.observe(lastRow);
        }

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [invoices, hasMoreData]);

    const InvoiceIDBody = (rowData) => {
        return <div className={`d-flex align-items-center gap-2 justify-content-between show-on-hover`}>
            <div className='d-flex flex-column' style={{ lineHeight: '1.385' }}>
                <span>{rowData.number}</span>
                <span className='font-12' style={{ color: '#98A2B3' }}>{formatDate(rowData.created)}</span>
            </div>
            <Button label="Open" onClick={() => navigate(`/management?unique_id=${rowData.unique_id}&reference=${rowData?.reference}&number=${rowData?.number}&value=${rowData.id}`)} className='primary-text-button ms-3 show-on-hover-element not-show-checked' text />
        </div>;
    };

    const InvoiceBody = (rowData) => {
        return <div className='d-flex align-items-center justify-content-around'>
            <Link to={`${rowData?.invoice_url}`} target='_blank'><FilePdf color='#FF0000' size={16} /></Link>
            <Link to={`/invoice/${rowData.unique_id}`} target='_blank'><Link45deg color='#3366CC' size={16} /></Link>
        </div>;
    };

    const customerNameBody = (rowData) => {
        return <div className='d-flex align-items-center'>
            <ImageAvatar has_photo={rowData?.client?.has_photo} photo={rowData?.client?.photo} is_business={rowData?.client?.is_business} />
            <div className='d-flex flex-column gap-1'>
                <div className={`${style.ellipsis}`}>{rowData.client?.name}</div>
                {rowData.deleted ?
                    <Tag value="Deleted" style={{ height: '22px', width: '59px', borderRadius: '16px', border: '1px solid #FECDCA', background: '#FEF3F2', color: '#912018', fontSize: '12px', fontWeight: 500 }}></Tag> : ''}
            </div>
        </div>;
    };

    const dueDate = (rowData) => {
        return <div className={`d-flex align-items-center justify-content-start gap-2 show-on-hover`} style={{ color: "#98A2B3" }}>
            {
                rowData.paid ?
                    <div className={`${style.status} ${style.active}`}>
                        <Badge severity="success"></Badge> Paid
                    </div>
                    : rowData.overdue > 0 ?
                        <div className={`${style.status} ${style.inactive}`}>
                            Overdue {rowData.overdue} days <Badge severity="danger"></Badge>
                        </div>
                        : <div className={`${style.status} ${style.inactive}`}>
                            <Badge severity="warning"></Badge> Not Paid
                        </div>
            }

            {formatDate(rowData.due_date)}
            <ResendInvoiceEmail projectId={rowData.unique_id} clientId={rowData?.client?.id} isAction={false} />
        </div>;
    };

    const totalBody = (rowData) => {
        return <div className={`d-flex align-items-center justify-content-end ${style.fontStanderdSize}`}>
            <div className={`text-dark`}>
                ${formatAUD(rowData?.amount)}
            </div>
        </div>;
    };

    const ToBePaidBody = (rowData) => {
        return <div className={`d-flex align-items-center justify-content-end show-on-hover ${style.fontStanderdSize}`}>
            <div className={`text-dark`}>
                <span style={{ color: rowData.payment_status === 'paid' ? '#98A2B3' : rowData.payment_status === 'not_paid' ? '#D92D20' : '#F79009' }}>${formatAUD(rowData?.to_be_paid)}</span>
            </div>
        </div>;
    };

    const depositBody = (rowData) => {
        // return <div className={`d-flex align-items-center justify-content-end ${style.fontStanderdSize}`} style={{ position: 'static' }}>
        //     <div className={`${rowData.payment_status === 'paid' ? style['paid'] : rowData.payment_status !== 'not_paid' ? style['unpaid'] : style['partialPaid']}`}>
        //         ${formatAUD(rowData.deposit)}
        //         <span onClick={() => { setVisible(true); setInvoiceData(rowData); }} className={clsx(style.plusIcon, 'cursor-pointer')} style={{ position: 'relative', marginLeft: '10px', paddingLeft: '5px' }}><PlusLg size={12} color="#079455" /></span>
        //     </div>
        // </div>;
        return <Button onClick={() => { setVisible(true); setInvoiceData(rowData); }} disabled={rowData.payment_status === 'paid'} className={clsx(style.payInvoiceButton, { [style.paid]: rowData.payment_status === 'paid', [style.unpaid]: rowData.payment_status === 'not_paid', [style.partialPaid]: rowData.payment_status !== 'not_paid' && rowData.payment_status !== 'paid' })}>Pay Invoice <CurrencyDollar color={rowData.payment_status === 'paid' ? '#17B26A' : rowData.payment_status === 'not_paid' ? '#D92D20' : '#F79009'} size={16} /></Button>;
    };

    const xeroBody = (rowData) => {
        return <div className={`d-flex align-items-center justify-content-center`}>
            {
                rowData?.xero_status === "in_progress"
                    ? <span style={{ color: '#158ECC' }} className={style.shakeText}>xero</span>
                    : rowData?.xero_status === "completed" ? <span style={{ color: '#158ECC' }}>xero</span> : <span></span>
            }
        </div>;
    };

    const deleteMutation = useMutation({
        mutationFn: (data) => deleteInvoice(data),
        onSuccess: () => {
            toast.success(`Invoice deleted successfully`);
            deleteMutation.reset();
            setRefetch(!refetch);
        },
        onError: (error) => {
            deleteMutation.reset();
            console.log('error: ', error);
            toast.error(`Failed to delete invoice. Please try again.`);
        }
    });

    const duplicateMutation = useMutation({
        mutationFn: (data) => fetchduplicateData(data),
        onSuccess: () => {
            toast.success(`Project has been successfully duplicated`);
            duplicateMutation.reset();
            navigate('/sales');
        },
        onError: (error) => {
            deleteMutation.reset();
            console.log('error: ', error);
            toast.error(`Failed to duplicate project. Please try again.`);
        }
    });

    const InfoBodyTemplate = (rowData) => {
        const ref = useRef(null);
        const [isOpen, setOpen] = useState(false);
        const anchorProps = useClick(isOpen, setOpen);
        return <React.Fragment>
            <InfoCircle color='#667085' size={18} className='cursor-pointer' ref={ref} {...anchorProps} />
            <div className='fixedMenu' style={{ position: 'fixed', top: '40%', left: '40%' }}>
                <ControlledMenu
                    state={isOpen ? 'open' : 'closed'}
                    anchorRef={ref}
                    onClose={() => setOpen(false)}
                    menuStyle={{ padding: '24px 24px 20px 24px', width: '605px', marginTop: '45px', maxHeight: '100%' }}
                >
                    <div className='d-flex justify-content-between mb-4'>
                        <div className='BoxNo'>
                            <div>
                                <InfoCircle color='#FFFFFF' size={24} />
                            </div>
                        </div>
                        <CloseButton onClick={() => setOpen(false)} />
                    </div>
                    <div style={{ width: '100%', maxHeight: '500px', overflow: 'auto' }}>
                        {
                            rowData?.billing_history.map((history, index) =>
                                <div key={rowData.unique_id + index} className='d-flex gap-4 border justify-content-start py-1 px-2 rounded mb-2 w-100' style={{ width: 'fit-content' }}>
                                    <div className='d-flex align-items-center'>
                                        {
                                            history?.type === 0 ? (
                                                <>
                                                    <div className='d-flex justify-content-center align-items-center rounded-circle' style={{ width: '24px', height: '24px', background: 'linear-gradient(180deg, #f9fafb 0%, #edf0f3 100%)', marginRight: '10px' }}>
                                                        <Stripe size={14} color="#98A2B3" />
                                                    </div>
                                                    <div className='font-14 ellipsis-width text-start' style={{ width: '120px', maxWidth: '120px' }}>Stripe</div>
                                                </>
                                            ) : (
                                                <>
                                                    <ImageAvatar has_photo={history?.manager?.has_photo} photo={history?.manager?.photo} is_business={false} />
                                                    <div className='font-14 ellipsis-width text-start' style={{ width: '120px', maxWidth: '120px' }}>{history?.manager?.name}</div>
                                                </>
                                            )
                                        }
                                    </div>
                                    <div className='d-flex gap-2 align-items-center justify-content-start'>
                                        <Coin color='#98A2B3' size={14} />
                                        <span style={{ fontWeight: 600, fontSize: 16 }}>${formatAUD(history.deposit)}</span>
                                    </div>
                                    <div className='d-flex gap-2 align-items-center justify-content-start'>
                                        {history?.type === 2 ? <Bank size={14} color='#98A2B3' />
                                            : history.type === 1 ? <Cash size={14} color="#98A2B3" />
                                                : history.type === 4 ? <CreditCard size={14} color="#98A2B3" />
                                                    : <Stripe size={14} color="#98A2B3" />}
                                        <div className='border rounded font-12 px-1'>
                                            {history?.type === 2 ? "Bank" : history.type === 1 ? "Cash" : history.type === 4 ? "EFTPOS" : "Stripe"}
                                        </div>
                                    </div>
                                    <div className='d-flex gap-2 align-items-center'>
                                        <Calendar3Event color='#98A2B3' size={14} />
                                        <div className='font-14'>{formatDate(history.created)}</div>
                                    </div>
                                </div>
                            )
                        }
                    </div>

                    {
                        rowData.paid
                            ? <div className='d-flex gap-2 mt-3 justify-content-center align-items-center p-2 rounded' style={{ background: '#ECFDF3' }}>
                                <span className='font-14' style={{ color: '#17B26A' }}>Invoice Paid</span>
                            </div>
                            : rowData.payment_status === 'partial_payment' ? <div className='d-flex gap-2 mt-3 justify-content-center align-items-center p-2 rounded' style={{ background: '#fffaeb' }}>
                                <span className='font-14' style={{ color: '#b54708' }}>Invoice Partialy Paid</span>
                            </div>
                                : <div className='d-flex gap-2 mt-3 justify-content-center align-items-center p-2 rounded' style={{ background: '#FEF3F2' }}>
                                    <span className='font-14' style={{ color: '#B42318' }}>Invoice Due</span>
                                </div>
                    }

                </ControlledMenu>
            </div>
        </React.Fragment>;
    };

    const StatusBody = (rowData) => {
        const ref = useRef(null);
        const [isOpen, setOpen] = useState(false);
        const anchorProps = useClick(isOpen, setOpen);

        return <React.Fragment>
            <ThreeDotsVertical size={24} color="#667085" className='cursor-pointer' ref={ref} {...anchorProps} />

            <ControlledMenu
                state={isOpen ? 'open' : 'closed'}
                anchorRef={ref}
                onClose={() => setOpen(false)}
                className={"threeDots"}
                menuStyle={{ padding: '4px', width: '241px', textAlign: 'left' }}
            >
                <div className='d-flex flex-column gap-2'>
                    <SendInvoiceEmail projectId={rowData.unique_id} clientId={rowData?.client?.id} isAction={true} />
                    <ResendInvoiceEmail projectId={rowData.unique_id} clientId={rowData?.client?.id} isAction={true} />
                    <div className='d-flex align-items-center cursor-pointer gap-3 hover-greay px-2 py-2' onClick={async () => { await duplicateMutation.mutateAsync(rowData.unique_id); setOpen(false); }}>
                        <Files color='#667085' size={20} />
                        <span style={{ color: '#101828', fontSize: '16px', fontWeight: 500 }}>Duplicate project</span>
                        {duplicateMutation?.variables === rowData.unique_id ? <ProgressSpinner style={{ width: '20px', height: '20px' }}></ProgressSpinner> : ""}
                    </div>
                    <div className='d-flex align-items-center gap-3 hover-greay px-2 py-2' style={{ opacity: .5 }}>
                        <FileEarmarkSpreadsheet color='#667085' size={20} />
                        <span style={{ color: '#101828', fontSize: '16px', fontWeight: 500 }}>Create credit note</span>
                    </div>
                    {
                        hasPermission(role, PERMISSIONS.INVOICE.DELETE) && (
                            <div className='d-flex align-items-center cursor-pointer gap-3 hover-greay px-2 py-2' onClick={async () => { await deleteMutation.mutateAsync(rowData.unique_id); setOpen(false); }}>
                                <Trash color='#B42318' size={20} />
                                <span style={{ color: '#B42318', fontSize: '16px', fontWeight: 500 }}>Delete invoice</span>
                                {deleteMutation?.variables === rowData.unique_id ? <ProgressSpinner style={{ width: '20px', height: '20px' }}></ProgressSpinner> : ""}
                            </div>
                        )
                    }
                </div>
            </ControlledMenu>
        </React.Fragment>;
    };

    const rowClassName = (data) => (data?.deleted ? style.deletedRow : "");

    const onSort = (event) => {
        const { sortField, sortOrder } = event;

        setTempSort({ sortField, sortOrder });
        setPage(1);  // Reset to page 1 whenever searchValue changes
    };

    return (
        <>
            <DataTable ref={ref} value={invoices} scrollable selectionMode={'checkbox'}
                columnResizeMode="expand" resizableColumns showGridlines size={'large'}
                scrollHeight={`calc(100vh - 175px - ${trialHeight}px - ${isFilterEnabled ? 56 : 0}px)`} className="border" selection={selected}
                onSelectionChange={(e) => setSelected(e.value)}
                loading={loading}
                loadingIcon={Loader}
                emptyMessage={<NoDataFoundTemplate isDataExist={!!searchValue || !!isShowDeleted} />}
                sortField={sort?.sortField}
                sortOrder={sort?.sortOrder}
                onSort={onSort}
                rowClassName={rowClassName}
            >
                <Column selectionMode="multiple" headerClassName='ps-4 border-end-0' bodyClassName={'show-on-hover border-end-0 ps-4'} headerStyle={{ width: '3rem', textAlign: 'center' }} frozen></Column>
                <Column field="number" header="Invoice ID" body={InvoiceIDBody} headerClassName='paddingLeftHide' bodyClassName='paddingLeftHide' style={{ minWidth: '160px', maxWidth: '160px', width: '160px' }} frozen sortable></Column>
                <Column field="" header="Invoice" body={InvoiceBody} style={{ minWidth: '114px', maxWidth: '114px', width: '114px' }} frozen></Column>
                <Column field="client.name" header="Customer A→Z" body={customerNameBody} headerClassName='shadowRight' bodyClassName='shadowRight' style={{ minWidth: '295px', maxWidth: '295px', width: '295px' }} frozen sortable></Column>
                <Column field="reference" header="Invoice Reference"  style={{ minWidth: '250px' }}></Column>
                <Column field="due_date" header="Due Date" body={dueDate} style={{ minWidth: '56px' }} className='text-center' sortable></Column>
                <Column field='amount' header="Total invoice" body={totalBody} style={{ minWidth: '56px', textAlign: 'end' }}></Column>
                <Column field='to_be_paid' header="To be paid" body={ToBePaidBody} style={{ minWidth: '123px', textAlign: 'right' }} sortable></Column>
                <Column field='deposit' header="Deposit/Payment" body={depositBody} style={{ minWidth: '114px', textAlign: 'left' }} sortable></Column>
                <Column field='total_requests' header="Info" body={InfoBodyTemplate} style={{ minWidth: '89px', maxWidth: '89px', width: '89px', textAlign: 'center' }} sortable></Column>
                <Column field='xero' header="Xero/Myob" body={xeroBody} style={{ minWidth: '120px', maxWidth: '120px', width: '120px', textAlign: 'center' }} sortable></Column>
                <Column field='paid' header="Actions" body={StatusBody} style={{ minWidth: '75px', maxWidth: '75px', width: '75px', textAlign: 'center' }} bodyStyle={{ color: '#667085' }}></Column>
            </DataTable>
            <InvoicePartialPayment show={visible} setShow={() => setVisible(false)} setRefetch={setRefetch} invoice={invoiceData} />
        </>
    );
});

export default InvoiceTable;