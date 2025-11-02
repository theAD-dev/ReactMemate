import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { CashCoin, CheckCircle, ExclamationCircle, ThreeDotsVertical, Trash, X } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { ControlledMenu, useClick } from '@szhsin/react-menu';
import { useMutation } from '@tanstack/react-query';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { toast } from 'sonner';
import style from './expenses.module.scss';
import { deleteExpense, getListOfExpense } from "../../../../APIs/expenses-api";
import { useAuth } from '../../../../app/providers/auth-provider';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import { PERMISSIONS } from '../../../../shared/lib/access-control/permission';
import { hasPermission } from '../../../../shared/lib/access-control/role-permission';
import { BootstrapFileIcons } from '../../../../shared/lib/bootstrap-file-icons';
import { formatAUD } from '../../../../shared/lib/format-aud';
import Loader from '../../../../shared/ui/loader/loader';
import ImageAvatar from '../../../../ui/image-with-fallback/image-avatar';
import NoDataFoundTemplate from '../../../../ui/no-data-template/no-data-found-template';
import ExpensesEdit from '../../features/expenses-features/expenses-edit/expenses-edit';
import TotalExpenseDialog from '../../features/expenses-features/expenses-table-actions';


const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const monthAbbreviation = new Intl.DateTimeFormat("en-US", {
        month: "short",
    }).format(date);
    const year = date.getFullYear();
    return `${day} ${monthAbbreviation} ${year}`;
};

const ExpensesTable = forwardRef(({ searchValue, setTotal, setTotalMoney, selected, setSelected, isShowDeleted, refetch, setRefetch, filter }, ref) => {
    const { role } = useAuth();
    const observerRef = useRef(null);
    const timeoutRef = useRef(null);
    const { trialHeight } = useTrialHeight();
    const [expenses, setExpenses] = useState([]);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState({ sortField: 'id', sortOrder: -1 });
    const [tempSort, setTempSort] = useState({ sortField: 'id', sortOrder: -1 });
    const [hasMoreData, setHasMoreData] = useState(true);
    const [loading, setLoading] = useState(false);
    const limit = 25;

    const [editData, setEditData] = useState("");
    const [visible, setVisible] = useState(false);
    const [showDialog, setShowDialog] = useState({ data: null, show: false });

    const url = React.useMemo(() => window.location.href, []);
    const urlObj = React.useMemo(() => new URL(url), [url]);
    const params = React.useMemo(() => new URLSearchParams(urlObj.search), [urlObj]);

    useEffect(() => {
        const expenseId = params.get('expenseId');
        if (expenseId && expenseId !== 'undefined') {
            const supplierName = params.get('supplierName');
            setEditData({ id: expenseId, name: supplierName });
            setVisible(true);
            urlObj.searchParams.delete('expenseId');
            window.history.replaceState({}, '', urlObj);
            urlObj.searchParams.delete('supplierName');
            window.history.replaceState({}, '', urlObj);
        } else if (expenseId === 'undefined') {
            toast.error("Expense id not found");
            urlObj.searchParams.delete('expenseId');
            window.history.replaceState({}, '', urlObj);
            urlObj.searchParams.delete('supplierName');
            window.history.replaceState({}, '', urlObj);
        }
    }, [params]);

    useEffect(() => {
        console.log('Resetting pagination due to filter/search/state change');
        setPage(1);  // Reset to page 1 whenever searchValue, filter, refetch, or isShowDeleted changes
        setExpenses([]); // Clear current expenses to show fresh data
        setHasMoreData(true); // Reset pagination state
    }, [searchValue, refetch, isShowDeleted, filter]);

    useEffect(() => {
        const loadData = async () => {
            console.log(`Loading expenses data - Page: ${page}, Search: "${searchValue}", Filter:`, filter);
            setLoading(true);

            let order = "";
            if (tempSort?.sortOrder === 1) order = `${tempSort.sortField}`;
            else if (tempSort?.sortOrder === -1) order = `-${tempSort.sortField}`;

            const data = await getListOfExpense(page, limit, searchValue, order, isShowDeleted, filter);
            console.log(`Loaded ${data?.results?.length || 0} expenses for page ${page}`);
            setTotal(() => (data?.count || 0));
            setTotalMoney(data?.total_amount || 0);
            if (page === 1) {
                console.log('Setting expenses for page 1 (replacing existing)');
                setExpenses(data.results);
            } else {
                console.log('Appending expenses for page', page);
                if (data?.results?.length > 0)
                    setExpenses(prev => {
                        const existingClientIds = new Set(prev.map(client => client.id));
                        const newClients = data.results.filter(client => !existingClientIds.has(client.id));
                        return [...prev, ...newClients];
                    });
            }
            setSort(tempSort);
            setHasMoreData(data.count !== expenses.length);
            setLoading(false);
        };

        loadData();

    }, [page, searchValue, tempSort, refetch, isShowDeleted, filter]);

    useEffect(() => {
        if (expenses.length > 0 && hasMoreData) {
            observerRef.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) setPage(prevPage => prevPage + 1);
            });

            const lastRow = document.querySelector('.p-datatable-tbody tr:not(.p-datatable-emptymessage):last-child');
            if (lastRow) observerRef.current.observe(lastRow);
        }

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [expenses, hasMoreData]);

    const ExpensesIDBody = (rowData) => {
        return <div className={`d-flex align-items-center justify-content-between show-on-hover`}>
            <div className='d-flex flex-column' style={{ lineHeight: '1.385' }}>
                <span>{rowData.number?.split('-')[1]}</span>
                <span className='font-12' style={{ color: '#98A2B3' }}>{formatDate(rowData.created)}</span>
            </div>
            <Button label="Open" onClick={() => { setVisible(true); setEditData({ id: rowData?.id, name: rowData?.supplier?.name }); }} className='primary-text-button ms-3 show-on-hover-element not-show-checked' text />
        </div>;
    };

    const nameBody = (rowData) => {
        return <div className='d-flex align-items-center'>
            <ImageAvatar has_photo={rowData?.supplier?.has_photo} photo={rowData?.supplier?.photo} is_business={true} />
            <div className='d-flex flex-column gap-1'>
                <div className={`${style.ellipsis}`}>{rowData.supplier?.name}</div>
                {rowData.deleted ?
                    <Tag value="Deleted" style={{ height: '22px', width: '59px', borderRadius: '16px', border: '1px solid #FECDCA', background: '#FEF3F2', color: '#912018', fontSize: '12px', fontWeight: 500 }}></Tag> : ''}
            </div>
        </div>;
    };

    const dueDate = (rowData) => {
        return <div className={`d-flex align-items-center justify-content-between show-on-hover`} style={{ color: "#667085", fontSize: '12px' }}>
            {formatDate(rowData.created)}
        </div>;
    };

    const totalBody = (rowData) => {
        return <div className={`d-flex align-items-center justify-content-end show-on-hover ${style.fontStanderdSize}`}>
            <div className={` ${rowData.paid ? style['paid-true'] : style['paid-false']}`}>
                ${formatAUD(rowData.total)}
            </div>
        </div>;
    };

    const accountCode = (rowData) => {
        return <div className={`d-flex align-items-center justify-content-start show-on-hover ${style.accountCode}`}>
            {rowData.account_code?.code && <span>{rowData.account_code?.code}: </span>}
            {rowData.account_code?.name}
        </div>;
    };

    const departmentBody = (rowData) => {
        return <div className={`d-flex align-items-center justify-content-start show-on-hover ${style.fontStanderdSize}`}>
            {rowData?.department?.name}
        </div>;
    };

    const xeroBody = (rowData) => {
        return <div className={`d-flex align-items-center justify-content-center`}>
            {
                rowData?.xero_status === "in_progress"
                    ? <span style={{ color: '#158ECC', fontSize: '12px' }} className={style.shakeText}>xero</span>
                    : rowData?.xero_status === "completed" ? <span style={{ color: '#158ECC', fontSize: '12px' }}>xero</span> : <span></span>
            }
        </div>;
    };

    const FileBody = (rowData) => {
        if (!rowData.file) return "";
        const isPaid = rowData.paid;

        const extension = rowData.file ? rowData.file.split(".")?.[rowData.file.split(".")?.length - 1]?.toLowerCase() : "";
        if (rowData.file) return <Link to={rowData.file} target='_blank'>
            {<BootstrapFileIcons extension={extension} color={isPaid ? '#98A2B3' : '#FF0000'} size={16} />}
        </Link>;
    };

    const StatusBody = (rowData) => {
        if (rowData.paid)
            return <Button onClick={() => setShowDialog({ data: rowData, show: true })} className={style.paidButton} style={{ height: '36px', width: '97px' }}>Paid <CheckCircle color='#17B26A' size={16} /></Button>;
        return <Button onClick={() => setShowDialog({ data: rowData, show: true })} className={style.notPaidButton} style={{ height: '36px', width: '97px' }}>Not Paid <CashCoin color='#F04438' size={16} /> </Button>;
    };

    const intervalProjectBody = (rowData) => {
        if (rowData.asset) {
            return <div className='d-flex flex-column'>
                <span className='text-capitalize' style={{ color: '#344054', fontSize: '14px' }}>{rowData.asset.asset_name}</span>
                <span className='font-14' style={{ color: '#98A2B3' }}>Asset | {rowData.asset.asset_type_name}</span>
            </div>;
        }
        if (!rowData.order) return <span className='text-capitalize' style={{ color: '#344054', fontSize: '14px' }}>{rowData.type}</span>;
        return <div className='d-flex flex-column'>
            <span style={{ color: '#344054', fontSize: '14px' }}>{rowData?.order?.reference || "-"}</span>
            <span className='font-14' style={{ color: '#98A2B3' }}><Link className={`${style.linkToProjectCard}`} to={`/management?unique_id=${rowData?.order?.unique_id}`}>{rowData?.order?.number}</Link> | {rowData?.order?.client?.name}</span>
        </div>;
    };

    const deleteMutation = useMutation({
        mutationFn: (data) => deleteExpense(data),
        onSuccess: () => {
            toast.success(`Expense deleted successfully`);
            deleteMutation.reset();
            setRefetch(!refetch);
        },
        onError: (error) => {
            deleteMutation.reset();
            console.log('error: ', error);
            toast.error(`Failed to delete expense. Please try again.`);
        }
    });

    const ActionBody = (rowData) => {
        const ref = useRef(null);
        const [isOpen, setOpen] = useState(false);
        const anchorProps = useClick(isOpen, setOpen);

        const deleteExpense = () => {
            setOpen(false);
            setExpenses(prev => prev.filter(exp => exp.id !== rowData.id));
            setTotal(prev => prev - 1);
            setTotalMoney(prev => prev - rowData.total);

            timeoutRef.current = setTimeout(() => {
                deleteMutation.mutate(rowData.id);
            }, 5000);

            toast.custom((t) => (
                <div className={style.customToast}>
                    <div className='d-flex align-items-center justify-content-between w-100 mb-3'>
                        <div className={style.outerToastIcon}>
                            <div className={style.toastIcon}>
                                <ExclamationCircle color="#DC6803" size={20} />
                            </div>
                        </div>
                        <Button className='close-button border-0' onClick={() => toast.dismiss(t)}>
                            <X size={20} color="#344054" />
                        </Button>
                    </div>
                    <div className='ps-2'>
                        <p className={style.toastTitle}>Expense has been deleted</p>
                        <p className={style.toastMessage}>You can undo this action within a few seconds.</p>
                        <Button className='text-button ps-0'
                            onClick={() => {
                                clearTimeout(timeoutRef.current);
                                deleteMutation.reset?.();

                                toast.success('Expense has been restored');
                                toast.dismiss(t);

                                setExpenses(prev => {
                                    const index = expenses.findIndex(exp => exp.id === rowData.id); // get original index
                                    return [
                                        ...prev.slice(0, index),
                                        rowData,
                                        ...prev.slice(index)
                                    ];
                                });

                                setTotal(prev => prev + 1);
                                setTotalMoney(prev => prev + rowData.total);
                            }}
                        >
                            Undo action
                        </Button>
                    </div>

                </div>
            ), {
                position: 'bottom-right',
            });
        };

        return (
            <React.Fragment>
                <ThreeDotsVertical size={24} color="#667085" className='cursor-pointer' ref={ref} {...anchorProps} />
                <ControlledMenu
                    state={isOpen ? 'open' : 'closed'}
                    anchorRef={ref}
                    onClose={() => setOpen(false)}
                    className={"threeDots"}
                    menuStyle={{ padding: '4px', width: '241px', textAlign: 'left' }}
                >
                    <div className='d-flex align-items-center cursor-pointer gap-2 hover-greay px-2 py-2' onClick={deleteExpense}>
                        <Trash color='#B42318' size={20} />
                        <span style={{ color: '#B42318', fontSize: '16px', fontWeight: 500 }}>Delete expense</span>
                        {deleteMutation?.variables === rowData.id ? <ProgressSpinner style={{ width: '20px', height: '20px' }}></ProgressSpinner> : ""}
                    </div>
                </ControlledMenu>
            </React.Fragment>
        );
    };


    const onSort = (event) => {
        const { sortField, sortOrder } = event;

        setTempSort({ sortField, sortOrder });
        setPage(1);  // Reset to page 1 whenever searchValue changes
    };

    return (
        <>
            <DataTable ref={ref} value={expenses} scrollable selectionMode={'checkbox'}
                columnResizeMode="expand" resizableColumns showGridlines size={'large'}
                scrollHeight={`calc(100vh - 175px - ${trialHeight}px)`} className="border" selection={selected}
                onSelectionChange={(e) => setSelected(e.value)}
                loading={loading}
                loadingIcon={Loader}
                emptyMessage={<NoDataFoundTemplate isDataExist={!!searchValue || !!isShowDeleted} />}
                sortField={sort?.sortField}
                sortOrder={sort?.sortOrder}
                onSort={onSort}
            >
                <Column selectionMode="multiple" headerClassName='ps-4 border-end-0' bodyClassName={'show-on-hover border-end-0 ps-4'} headerStyle={{ width: '3rem', textAlign: 'center' }} frozen></Column>
                <Column field="id" header="Expense ID" body={ExpensesIDBody} headerClassName='paddingLeftHide' bodyClassName='paddingLeftHide' style={{ minWidth: '100px' }} frozen sortable></Column>
                <Column field="supplier__name" header="Supplier A→Z" body={nameBody} headerClassName='shadowRight' bodyClassName='shadowRight' style={{ minWidth: '224px' }} frozen sortable></Column>
                <Column field="invoice_reference" header="Reference" body={(rowData) => <div className='ellipsis-width' title={rowData.invoice_reference} style={{ maxWidth: '250px', color: '#344054' }}>{rowData.invoice_reference}</div>} style={{ minWidth: '94px' }}></Column>
                <Column field="file" header="File" body={FileBody} style={{ minWidth: '60px', textAlign: 'center', maxWidth: '60px', width: '60px' }}></Column>
                <Column field="created" header="Due Date" body={dueDate} style={{ minWidth: '56px' }} className='text-center'></Column>
                <Column field='jobsdone' header="Total" body={totalBody} style={{ minWidth: '56px', textAlign: 'end' }}></Column>
                <Column field='type' header="Interval/Project/Asset" body={intervalProjectBody} style={{ minWidth: '123px', textAlign: 'left' }}></Column>
                <Column field='account_code.code' header="Account Code" body={accountCode} style={{ minWidth: '114px', textAlign: 'left' }} sortable></Column>
                <Column field='total_requests' header="Xero/Myob" body={xeroBody} style={{ minWidth: '89px', textAlign: 'center' }}></Column>
                {/* <Column field='department.name' header="Departments" body={departmentBody} style={{ minWidth: '140px' }} sortable></Column> */}
                <Column field='paid' header="Status" body={StatusBody} style={{ minWidth: '130px', maxWidth: '130px', width: '130px' }} bodyStyle={{ color: '#667085' }} bodyClassName='text-center' headerClassName="text-center"></Column>
                {
                    hasPermission(role, PERMISSIONS.EXPENSE.DELETE) &&
                    <Column header="Actions" body={ActionBody} style={{ minWidth: '75px', maxWidth: '75px', width: '75px', textAlign: 'center' }} bodyStyle={{ color: '#667085' }}></Column>
                }
            </DataTable>
            <ExpensesEdit key={editData?.id} id={editData?.id} name={editData?.name} visible={visible} setVisible={setVisible} setEditData={setEditData} setRefetch={setRefetch} />
            <TotalExpenseDialog showDialog={showDialog} setShowDialog={setShowDialog} setRefetch={setRefetch} />
        </>
    );
});

export default ExpensesTable;