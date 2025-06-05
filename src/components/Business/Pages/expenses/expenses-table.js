import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { FileEarmarkPdf, Trash } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
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

const ExpensesTable = forwardRef(({ searchValue, setTotal, setTotalMoney, selected, setSelected, isShowDeleted, refetch, setRefetch }, ref) => {
    const { role } = useAuth();
    const observerRef = useRef(null);
    const { trialHeight } = useTrialHeight();
    const [expenses, setExpenses] = useState([]);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState({ sortField: 'number', sortOrder: -1 });
    const [tempSort, setTempSort] = useState({ sortField: 'number', sortOrder: -1 });
    const [hasMoreData, setHasMoreData] = useState(true);
    const [loading, setLoading] = useState(false);
    const limit = 25;

    const [editData, setEditData] = useState("");
    const [visible, setVisible] = useState(false);
    const [showDialog, setShowDialog] = useState({ data: null, show: false });

    useEffect(() => {
        setPage(1);  // Reset to page 1 whenever searchValue changes
    }, [searchValue, refetch, isShowDeleted]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            let order = "";
            if (tempSort?.sortOrder === 1) order = `${tempSort.sortField}`;
            else if (tempSort?.sortOrder === -1) order = `-${tempSort.sortField}`;

            const data = await getListOfExpense(page, limit, searchValue, order, isShowDeleted);
            setTotal(() => (data?.count || 0));
            setTotalMoney(data?.total_amount || 0);
            if (page === 1) setExpenses(data.results);
            else {
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

    }, [page, searchValue, tempSort, refetch, isShowDeleted]);

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
            <span>{rowData.number?.split('-')[1]}</span>
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
        return <div className={`d-flex align-items-center justify-content-between show-on-hover`} style={{ color: "#98A2B3" }}>
            {formatDate(rowData.created)}
        </div>;
    };

    const totalBody = (rowData) => {
        return <div className={`d-flex align-items-center justify-content-end show-on-hover ${style.fontStanderdSize}`}>
            <div className={` ${rowData.paid ? style['paid-true'] : style['paid-false']}`}>
                ${formatAUD(rowData.total)}
                {/* <span className={style.plusIcon}><Plus size={12} color="#7a271a" /></span> */}
            </div>
        </div>;
    };

    const accountCode = (rowData) => {
        return <div className={`d-flex align-items-center justify-content-start show-on-hover ${style.fontStanderdSize}`}>
            {rowData.account_code?.code} : {rowData.account_code?.name}
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
                    ? <span style={{ color: '#158ECC' }} className={style.shakeText}>xero</span>
                    : rowData?.xero_status === "completed" ? <span style={{ color: '#158ECC' }}>xero</span> : <span></span>
            }
        </div>;
    };

    const StatusBody = (rowData) => {
        if (rowData.paid)
            return <Button onClick={() => setShowDialog({ data: rowData, show: true })} className='success-outline-button font-14 mx-auto' style={{ width: '86px', height: '36px' }}>Paid</Button>;
        return <Button onClick={() => setShowDialog({ data: rowData, show: true })} className='danger-outline-button font-14 mx-auto' style={{ width: '86px', height: '36px' }}>Not Paid</Button>;
    };

    const intervalProjectBody = (rowData) => {
        if (!rowData.order) return rowData.type;
        return rowData?.order.number || "-";
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
        return (
            <div className='d-flex justify-content-center align-items-center w-100 h-100'>
                {deleteMutation?.variables &&
                    (deleteMutation?.variables === rowData.id)
                    ? <ProgressSpinner style={{ width: '20px', height: '20px' }}></ProgressSpinner>
                    : <Trash color='#667085' size={20} className='cursor-pointer' onClick={async () => { await deleteMutation.mutateAsync(rowData.id); }} />}
            </div>
        );
    };

    const rowClassName = (data) => (data?.deleted ? style.deletedRow : data?.paid ? style.paidRow : style.unpaidRow);

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
                rowClassName={rowClassName}
            >
                <Column selectionMode="multiple" headerClassName='ps-4 border-end-0' bodyClassName={'show-on-hover border-end-0 ps-4'} headerStyle={{ width: '3rem', textAlign: 'center' }} frozen></Column>
                <Column field="number" header="Expense ID" body={ExpensesIDBody} headerClassName='paddingLeftHide' bodyClassName='paddingLeftHide' style={{ minWidth: '100px' }} frozen sortable></Column>
                <Column field="supplier.name" header="Supplier A→Z" body={nameBody} headerClassName='shadowRight' bodyClassName='shadowRight' style={{ minWidth: '224px' }} frozen sortable></Column>
                <Column field="invoice_reference" header="Reference" body={(rowData) => <div className='ellipsis-width' title={rowData.invoice_reference} style={{ maxWidth: '250px' }}>{rowData.invoice_reference}</div>} style={{ minWidth: '94px' }}></Column>
                <Column field="created" header="Due Date" body={dueDate} style={{ minWidth: '56px' }} className='text-center'></Column>
                <Column field='jobsdone' header="Total" body={totalBody} style={{ minWidth: '56px', textAlign: 'end' }}></Column>
                <Column field='type' header="Interval/Project" body={intervalProjectBody} style={{ minWidth: '123px', textAlign: 'right' }}></Column>
                <Column field='account_code.code' header="Account Code" body={accountCode} style={{ minWidth: '114px', textAlign: 'left' }} sortable></Column>
                <Column field='total_requests' header="Xero/Myob" body={xeroBody} style={{ minWidth: '89px', textAlign: 'center' }}></Column>
                <Column field='department.name' header="Departments" body={departmentBody} style={{ minWidth: '140px' }} sortable></Column>
                <Column field="file" header="File" body={(rowData) => rowData.file ? <Link to={rowData.file} target='_blank'><FileEarmarkPdf color='#667085' size={16} /></Link> : ""} style={{ minWidth: '60px', textAlign: 'center', maxWidth: '60px', width: '60px' }}></Column>
                <Column field='paid' header="Status" body={StatusBody} style={{ minWidth: '140px', maxWidth: '140px', width: '140px' }} bodyStyle={{ color: '#667085' }} bodyClassName='shadowLeft text-center' headerClassName="shadowLeft text-center" frozen alignFrozen='right'></Column>
                {
                    hasPermission(role, PERMISSIONS.EXPENSE.DELETE) &&
                    <Column header="Actions" body={ActionBody} style={{ minWidth: '75px', maxWidth: '75px', width: '75px', textAlign: 'center' }} bodyStyle={{ color: '#667085' }} frozen alignFrozen='right'></Column>
                }
            </DataTable>
            <ExpensesEdit id={editData?.id} name={editData?.name} visible={visible} setVisible={setVisible} setEditData={setEditData} setRefetch={setRefetch} />
            <TotalExpenseDialog showDialog={showDialog} setShowDialog={setShowDialog} setRefetch={setRefetch} />
        </>
    );
});

export default ExpensesTable;