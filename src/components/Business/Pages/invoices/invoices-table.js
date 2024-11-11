import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Building, Person, FilePdf, Link45deg, InfoCircle, ThreeDotsVertical, Send, Files, FileEarmarkSpreadsheet, Trash, Plus, PlusLg, ListUl, Coin, Calendar3Event, CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';
import { Tag } from 'primereact/tag';

import style from './invoice.module.scss';
import { Link } from 'react-router-dom';

import NoDataFoundTemplate from '../../../../ui/no-data-template/no-data-found-template';
import { CloseButton, Spinner } from 'react-bootstrap';
import { Badge } from 'primereact/badge';
import { deleteInvoice, getListOfInvoice } from '../../../../APIs/invoice-api';
import { ControlledMenu, useClick } from '@szhsin/react-menu';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { ProgressSpinner } from 'primereact/progressspinner';
import clsx from 'clsx';

const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const monthAbbreviation = new Intl.DateTimeFormat("en-US", {
        month: "short",
    }).format(date);
    const year = date.getFullYear();
    return `${day} ${monthAbbreviation} ${year}`;
};

const InvoiceTable = forwardRef(({ searchValue, setTotal, selected, setSelected, isShowDeleted, refetch, setRefetch }, ref) => {
    const observerRef = useRef(null);
    const [clients, setCients] = useState([]);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState({ sortField: 'id', sortOrder: -1 });
    const [tempSort, setTempSort] = useState({ sortField: 'id', sortOrder: -1 });
    const [hasMoreData, setHasMoreData] = useState(true);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const limit = 25;

    useEffect(() => {
        setPage(1);  // Reset to page 1 whenever searchValue changes
    }, [searchValue, refetch]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            let order = "";
            if (tempSort?.sortOrder === 1) order = `${tempSort.sortField}`;
            else if (tempSort?.sortOrder === -1) order = `-${tempSort.sortField}`;

            const data = await getListOfInvoice(page, limit, searchValue, order, isShowDeleted);
            setTotal(() => (data?.count || 0))
            if (page === 1) setCients(data.results);
            else {
                if (data?.results?.length > 0)
                    setCients(prev => {
                        const existingClientIds = new Set(prev.map(client => client.id));
                        const newClients = data.results.filter(client => !existingClientIds.has(client.id));
                        return [...prev, ...newClients];
                    });
            }
            setSort(tempSort);
            setHasMoreData(data.count !== clients.length)
            setLoading(false);
        };

        loadData();

    }, [page, searchValue, tempSort, refetch]);

    useEffect(() => {
        if (clients.length > 0 && hasMoreData) {
            observerRef.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) setPage(prevPage => prevPage + 1);
            });

            const lastRow = document.querySelector('.p-datatable-tbody tr:not(.p-datatable-emptymessage):last-child');
            if (lastRow) observerRef.current.observe(lastRow);
        }

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [clients, hasMoreData]);

    const InvoiceIDBody = (rowData) => {
        return <div className={`d-flex align-items-center justify-content-between show-on-hover`}>
            <span>{rowData.number}</span>
        </div>
    }

    const InvoiceBody = (rowData) => {
        return <div className='d-flex align-items-center justify-content-around'>
            <Link to={`${rowData?.invoice_url}`} target='_blank'><FilePdf color='#FF0000' size={16} /></Link>
            <Link to={`/invoice/${rowData.unique_id}`} target='_blank'><Link45deg color='#3366CC' size={16} /></Link>
        </div>
    }

    const customerNameBody = (rowData) => {
        return <div className='d-flex align-items-center'>
            <div style={{ overflow: 'hidden' }} className={`d-flex justify-content-center align-items-center ${style.clientImg} ${rowData.is_business ? "" : "rounded-circle"}`}>
                {rowData?.client?.photo ? <img src={rowData?.client?.photo} alt='clientImg' className='w-100' /> : rowData?.client?.is_business ? <Building color='#667085' /> : <Person color='#667085' />}
            </div>
            <div className='d-flex flex-column gap-1'>
                <div className={`${style.ellipsis}`}>{rowData.client?.name}</div>
                {rowData.deleted ?
                    <Tag value="Deleted" style={{ height: '22px', width: '59px', borderRadius: '16px', border: '1px solid #FECDCA', background: '#FEF3F2', color: '#912018', fontSize: '12px', fontWeight: 500 }}></Tag> : ''}
            </div>
        </div>
    }

    const dueDate = (rowData) => {
        return <div className={`d-flex align-items-center justify-content-start gap-2 show-on-hover`} style={{ color: "#98A2B3" }}>
            {
                rowData.paid ?
                    <div className={`${style.status} ${style.active}`}>
                        <Badge severity="success"></Badge> Paid
                    </div>
                    : <div className={`${style.status} ${style.inactive}`}>
                        Overdue {rowData.overdue} days <Badge severity="danger"></Badge>
                    </div>
            }

            {formatDate(rowData.created)}
        </div>
    }

    const totalBody = (rowData) => {
        return <div className={`d-flex align-items-center justify-content-end ${style.fontStanderdSize}`}>
            <div className={`text-dark`}>
                $ {parseFloat((rowData?.amount) || 0).toFixed(2)}
            </div>
        </div>
    }

    const ToBePaidBody = (rowData) => {
        return <div className={`d-flex align-items-center justify-content-end show-on-hover ${style.fontStanderdSize}`}>
            <div className={`text-dark`}>
                $ {parseFloat((rowData?.to_be_paid) || 0).toFixed(2)}
            </div>
        </div>
    }

    const depositBody = (rowData) => {
        return <div className={`d-flex align-items-center justify-content-end ${style.fontStanderdSize}`}>
            <div className={`${rowData.paid ? style['paid'] : style['unpaid']}`}>
                $ {parseFloat(rowData.deposit || 0).toFixed(2)}
                <span className={clsx(style.plusIcon, 'cursor-pointer')} style={{ position: 'relative', marginLeft: '10px', paddingLeft: '5px' }}><PlusLg size={12} color="#079455" /></span>
            </div>
        </div>
    }

    const xeroBody = (rowData) => {
        return <div className={`d-flex align-items-center justify-content-center`}>
            <spam>xero</spam>
        </div>
    }

    const deleteMutation = useMutation({
        mutationFn: (data) => deleteInvoice(data),
        onSuccess: () => {
            toast.success(`Invoice deleted successfully`);
            deleteMutation.reset();
            setRefetch(!refetch);
        },
        onError: (error) => {
            deleteMutation.reset();
            toast.error(`Failed to delete invoice. Please try again.`);
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
                    menuStyle={{ padding: '24px 24px 20px 24px', width: 'fit-content', marginTop: '45px' }}
                >
                    <div className='d-flex justify-content-between mb-4'>
                        <div className='BoxNo'>
                            <div>
                                <InfoCircle color='#FFFFFF' size={24} />
                            </div>
                        </div>
                        <CloseButton onClick={() => setOpen(false)} />
                    </div>
                    <div className='d-flex gap-4 border justify-content-around py-1 px-2 rounded'>
                        <div className='d-flex gap-2 align-items-center'>
                            <Person color='#98A2B3' size={14} />
                            <span className='font-14'>{rowData?.client?.name}</span>
                        </div>
                        <div className='d-flex gap-2 align-items-center'>
                            <Coin color='#98A2B3' size={14} />
                            <span className='font-14 font-weight-bold'>{parseFloat(rowData.deposit || 0).toFixed(2)}</span>
                        </div>
                        <div className='d-flex gap-2 align-items-center'>
                            <Coin color='#98A2B3' size={14} />
                            <div className='border rounded font-14 px-1'>Bank</div>
                        </div>
                        <div className='d-flex gap-2 align-items-center'>
                            <Calendar3Event color='#98A2B3' size={14} />
                            <div className='font-14'>{formatDate(rowData.created)}</div>
                        </div>
                    </div>
                    {
                        rowData.paid
                            ? <div className='d-flex gap-2 mt-3 justify-content-center align-items-center p-2 rounded' style={{ background: '#ECFDF3' }}>
                                <CheckCircleFill color='#17B26A' />
                                <span className='font-14' style={{ color: '#17B26A' }}>Invoice Paid</span>
                            </div>
                            : <div className='d-flex gap-2 mt-3 justify-content-center align-items-center p-2 rounded' style={{ background: '#FEF3F2' }}>
                                <XCircleFill color='#F04438' />
                                <span className='font-14' style={{ color: '#B42318' }}>Invoice Due</span>
                            </div>
                    }

                </ControlledMenu>
            </div>
        </React.Fragment>
    }

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
                    <div className='d-flex align-items-center gap-3 hover-greay px-2 py-2' style={{ opacity: .5 }}>
                        <Send color='#667085' size={20} />
                        <span style={{ color: '#101828', fontSize: '16px', fontWeight: 500 }}>Resend invoice</span>
                    </div>
                    <div className='d-flex align-items-center cursor-pointer gap-3 hover-greay px-2 py-2'>
                        <Files color='#667085' size={20} />
                        <span style={{ color: '#101828', fontSize: '16px', fontWeight: 500 }}>Duplicate invoice</span>
                    </div>
                    <div className='d-flex align-items-center gap-3 hover-greay px-2 py-2' style={{ opacity: .5 }}>
                        <FileEarmarkSpreadsheet color='#667085' size={20} />
                        <span style={{ color: '#101828', fontSize: '16px', fontWeight: 500 }}>Create credit note</span>
                    </div>
                    <div className='d-flex align-items-center cursor-pointer gap-3 hover-greay px-2 py-2' onClick={async () => { await deleteMutation.mutateAsync(rowData.unique_id); setOpen(false) }}>
                        <Trash color='#B42318' size={20} />
                        <span style={{ color: '#B42318', fontSize: '16px', fontWeight: 500 }}>Delete invoice</span>
                        {deleteMutation?.variables === rowData.unique_id ? <ProgressSpinner style={{ width: '20px', height: '20px' }}></ProgressSpinner> : ""}
                    </div>
                </div>
            </ControlledMenu>
        </React.Fragment>
    }

    const loadingIconTemplate = () => {
        return <div style={{ position: 'fixed', top: '50%', left: '50%', background: 'white', width: '60px', height: '60px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }} className="shadow-lg">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    }

    const rowClassName = (data) => (data?.deleted ? style.deletedRow : data?.paid ? style.paidRow : style.unpaidRow);

    const onSort = (event) => {
        const { sortField, sortOrder } = event;

        setTempSort({ sortField, sortOrder })
        setPage(1);  // Reset to page 1 whenever searchValue changes
    };

    return (
        <>
            <DataTable ref={ref} value={clients} scrollable selectionMode={'checkbox'}
                columnResizeMode="expand" resizableColumns showGridlines size={'large'}
                scrollHeight={"calc(100vh - 175px)"} className="border" selection={selected}
                onSelectionChange={(e) => setSelected(e.value)}
                loading={loading}
                loadingIcon={loadingIconTemplate}
                emptyMessage={NoDataFoundTemplate}
                sortField={sort?.sortField}
                sortOrder={sort?.sortOrder}
                onSort={onSort}
                rowClassName={rowClassName}
            >
                <Column selectionMode="multiple" headerClassName='ps-4 border-end-0' bodyClassName={'show-on-hover border-end-0 ps-4'} headerStyle={{ width: '3rem', textAlign: 'center' }} frozen></Column>
                <Column field="id" header="Invoice ID" body={InvoiceIDBody} headerClassName='paddingLeftHide' bodyClassName='paddingLeftHide' style={{ minWidth: '100px' }} frozen sortable></Column>
                <Column field="" header="Invoice" body={InvoiceBody} style={{ minWidth: '114px' }} frozen></Column>
                <Column field="client.name" header="Customer A→Z" body={customerNameBody} headerClassName='shadowRight' bodyClassName='shadowRight' style={{ minWidth: '224px' }} frozen sortable></Column>
                <Column field="created" header="Due Date" body={dueDate} style={{ minWidth: '56px' }} className='text-center' sortable></Column>
                <Column field='amount' header="Amount + GST" body={totalBody} style={{ minWidth: '56px', textAlign: 'end' }}></Column>
                <Column field='to_be_paid' header="To be paid" body={ToBePaidBody} style={{ minWidth: '123px', textAlign: 'right' }} sortable></Column>
                <Column field='deposit' header="Deposit/Payment" body={depositBody} style={{ minWidth: '114px', textAlign: 'left' }} sortable></Column>
                <Column field='total_requests' header="Info" body={InfoBodyTemplate} style={{ minWidth: '89px', textAlign: 'center' }} sortable></Column>
                <Column field='xero' header="Xero/Myob" body={xeroBody} style={{ minWidth: '140px' }} sortable></Column>
                <Column field='paid' header="Actions" body={StatusBody} style={{ minWidth: '75px' }} bodyStyle={{ color: '#667085' }}></Column>
            </DataTable>
        </>
    )
})

export default InvoiceTable