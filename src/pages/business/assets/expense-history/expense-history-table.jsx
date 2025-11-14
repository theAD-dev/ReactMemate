import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { CashCoin, CheckCircle, ExclamationCircle, ThreeDotsVertical, Trash, X } from 'react-bootstrap-icons';
import { Link, useParams } from 'react-router-dom';
import { ControlledMenu, useClick } from '@szhsin/react-menu';
import { useMutation } from '@tanstack/react-query';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { toast } from 'sonner';
import style from './expense-history.module.scss';
import { deleteLinkedExpense, getLinkedExpenses } from '../../../../APIs/assets-api';
import { deleteExpense } from '../../../../APIs/expenses-api';
import { useAuth } from '../../../../app/providers/auth-provider';
import { useTrialHeight } from '../../../../app/providers/trial-height-provider';
import ExpensesEdit from '../../../../components/Business/features/expenses-features/expenses-edit/expenses-edit';
import TotalExpenseDialog from '../../../../components/Business/features/expenses-features/expenses-table-actions';
import { PERMISSIONS } from '../../../../shared/lib/access-control/permission';
import { hasPermission } from '../../../../shared/lib/access-control/role-permission';
import { BootstrapFileIcons } from '../../../../shared/lib/bootstrap-file-icons';
import { formatAUD } from '../../../../shared/lib/format-aud';
import ImageAvatar from '../../../../shared/ui/image-with-fallback/image-avatar';
import Loader from '../../../../shared/ui/loader/loader';
import NoDataFoundTemplate from '../../../../ui/no-data-template/no-data-found-template';

const formatDate = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(+timestamp * 1000);
  const formatter = new Intl.DateTimeFormat("en-AU", {
    timeZone: 'Australia/Sydney',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  return formatter.format(date);
};

const ExpenseHistoryTable = forwardRef(({ selected, setSelected, searchValue, refetch }, ref) => {
  const { id } = useParams();
  const { role } = useAuth();
  const { trialHeight } = useTrialHeight();
  const observerRef = useRef(null);
  const timeoutRef = useRef(null);
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ sortField: 'id', sortOrder: -1 });
  const [tempSort, setTempSort] = useState({ sortField: 'id', sortOrder: -1 });
  const [hasMoreData, setHasMoreData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [internalRefetch, setInternalRefetch] = useState(false);
  const limit = 25;

  const [editData, setEditData] = useState("");
  const [visible, setVisible] = useState(false);
  const [showDialog, setShowDialog] = useState({ data: null, show: false });

  useEffect(() => {
    setHasMoreData(true);
    setPage(1);
  }, [searchValue, refetch, internalRefetch]);

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);

      let order = "";
      if (tempSort?.sortOrder === 1) order = `${tempSort.sortField}`;
      else if (tempSort?.sortOrder === -1) order = `-${tempSort.sortField}`;

      try {
        const data = await getLinkedExpenses(1, id, page, limit, order);
        if (page === 1) {
          setExpenses(data || []);
        } else {
          if (data?.length > 0) {
            setExpenses(prev => {
              const existingIds = new Set(prev.map(expense => expense.id));
              const newData = data.filter(expense => !existingIds.has(expense.id));
              return [...prev, ...newData];
            });
          }
        }
        setSort(tempSort);
        setHasMoreData(data?.length === limit);
      } catch (error) {
        console.error('Error fetching linked expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchExpenses();
  }, [id, page, searchValue, tempSort, refetch]);

  useEffect(() => {
    if (expenses?.length > 0 && hasMoreData) {
      observerRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !loading) {
          setPage(prevPage => prevPage + 1);
        }
      });

      const lastRow = document.querySelector('.p-datatable-tbody tr:not(.p-datatable-emptymessage):last-child');
      if (lastRow) observerRef.current.observe(lastRow);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [expenses, hasMoreData, loading]);

  const expenseIDBody = (rowData) => {
    return (
      <div className='d-flex align-items-center justify-content-between show-on-hover'>
        <div className='d-flex flex-column' style={{ lineHeight: '1.385' }}>
          <span style={{ fontWeight: '500', color: '#344054' }}>{rowData.number?.split('-')[1] || rowData.number}</span>
          <span className='font-12' style={{ color: '#98A2B3' }}>
            {rowData.created ? formatDate(rowData.created) : '-'}
          </span>
        </div>
        <Button label="Open" onClick={() => { setVisible(true); setEditData({ id: rowData?.id, name: rowData?.supplier?.name }); }} className='primary-text-button ms-3 show-on-hover-element not-show-checked' text />
      </div>
    );
  };

  const supplierBody = (rowData) => {
    return (
      <div className='d-flex align-items-center gap-2'>
        <ImageAvatar 
          has_photo={rowData?.supplier?.has_photo} 
          photo={rowData?.supplier?.photo} 
          is_business={true} 
          size={24} 
        />
        <div className='d-flex flex-column gap-1'>
          <div style={{ fontSize: '14px', color: '#344054' }}>{rowData.supplier?.name || '-'}</div>
          {rowData.deleted && (
            <Tag 
              value="Deleted" 
              style={{ 
                height: '22px', 
                width: '59px', 
                borderRadius: '16px', 
                border: '1px solid #FECDCA', 
                background: '#FEF3F2', 
                color: '#912018', 
                fontSize: '12px', 
                fontWeight: 500 
              }}
            />
          )}
        </div>
      </div>
    );
  };

  const referenceBody = (rowData) => {
    return (
      <span style={{ color: '#667085', fontSize: '14px' }} title={rowData.invoice_reference}>
        {rowData.invoice_reference || '-'}
      </span>
    );
  };

  const dueDateBody = (rowData) => {
    if (!rowData.due_date) return '-';

    const dueDate = new Date(rowData.due_date * 1000);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let className = '';
    if (diffDays < 0) className = style.overdue;
    else if (diffDays <= 7) className = style.dueSoon;
    else if (diffDays <= 30) className = style.dueMonth;

    return (
      <span className={className}>
        {formatDate(rowData.due_date)}
      </span>
    );
  };

  const totalBody = (rowData) => {
    return (
      <div className='d-flex align-items-center justify-content-end'>
        <span 
          className={rowData.paid ? style.paidTrue : style.paidFalse}
          style={{ fontWeight: '500', fontSize: '14px' }}
        >
          ${formatAUD(rowData.total || 0)}
        </span>
      </div>
    );
  };

  const accountCodeBody = (rowData) => {
    return (
      <span style={{ color: '#667085', fontSize: '14px' }}>
        {rowData.account_code ? `${rowData.account_code.code}:${rowData.account_code.name}` : '-'}
      </span>
    );
  };

  const statusBody = (rowData) => {
    if (rowData.paid)
      return <Button onClick={() => setShowDialog({ data: rowData, show: true })} className={style.paidButton} style={{ height: '36px', width: '97px' }}>Paid <CheckCircle color='#17B26A' size={16} /></Button>;
    return <Button onClick={() => setShowDialog({ data: rowData, show: true })} className={style.notPaidButton} style={{ height: '36px', width: '97px' }}>Not Paid <CashCoin color='#F04438' size={16} /> </Button>;
  };

  const fileBody = (rowData) => {
    if (!rowData.file) return "";
    const isPaid = rowData.paid;

    const extension = rowData.file ? rowData.file.split(".")?.[rowData.file.split(".")?.length - 1]?.toLowerCase() : "";
    if (rowData.file) return <Link to={rowData.file} target='_blank'>
      {<BootstrapFileIcons extension={extension} color={isPaid ? '#98A2B3' : '#FF0000'} size={16} />}
    </Link>;
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

  const deleteMutation = useMutation({
    mutationFn: (data) => deleteExpense(data),
    onSuccess: () => {
      toast.success(`Expense deleted successfully`);
      deleteMutation.reset();
    },
    onError: (error) => {
      deleteMutation.reset();
      console.log('error: ', error);
      toast.error(`Failed to delete expense. Please try again.`);
    }
  });

  const ActionBody = ({ rowData }) => {
    const actionRef = useRef(null);
    const [isOpen, setOpen] = useState(false);
    const anchorProps = useClick(isOpen, setOpen);

    const handleDeleteExpense = () => {
      setOpen(false);
      setExpenses(prev => prev.filter(exp => exp.id !== rowData.id));

      timeoutRef.current = setTimeout(() => {
        if (rowData.asset) {
          deleteLinkedExpense(rowData.asset.asset_id, rowData.asset.asset_type_id, rowData.id);
        }
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
                  const index = expenses.findIndex(exp => exp.id === rowData.id);
                  return [
                    ...prev.slice(0, index),
                    rowData,
                    ...prev.slice(index)
                  ];
                });
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
        <ThreeDotsVertical size={24} color="#667085" className='cursor-pointer' ref={actionRef} {...anchorProps} />
        <ControlledMenu
          state={isOpen ? 'open' : 'closed'}
          anchorRef={actionRef}
          onClose={() => setOpen(false)}
          className={"threeDots"}
          menuStyle={{ padding: '4px', width: '241px', textAlign: 'left' }}
        >
          <div className='d-flex align-items-center cursor-pointer gap-2 hover-greay px-2 py-2' onClick={handleDeleteExpense}>
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
    setPage(1);
    setHasMoreData(true);
    setTempSort({ sortField, sortOrder });
  };

  // Filter expenses based on search value
  const filteredExpenses = expenses.filter(expense => {
    if (!searchValue) return true;
    const searchLower = searchValue.toLowerCase();
    return (
      expense.number?.toLowerCase().includes(searchLower) ||
      expense.supplier?.name?.toLowerCase().includes(searchLower) ||
      expense.invoice_reference?.toLowerCase().includes(searchLower) ||
      expense.account_code?.code?.toLowerCase().includes(searchLower) ||
      expense.account_code?.name?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <>
      <DataTable
        ref={ref}
        value={filteredExpenses}
        scrollable
        selectionMode={'checkbox'}
        columnResizeMode="expand"
        resizableColumns
        showGridlines
        size={'large'}
        scrollHeight={`calc(100vh - 175px - ${trialHeight}px)`}
        className="border"
        selection={selected}
        onSelectionChange={(e) => setSelected(e.value)}
        loading={loading}
        loadingIcon={Loader}
        emptyMessage={<NoDataFoundTemplate isDataExist={!!expenses?.length} />}
        sortField={sort?.sortField}
        sortOrder={sort?.sortOrder}
        onSort={onSort}
      >
        <Column
          selectionMode="multiple"
          headerClassName='ps-4 border-end-0'
          bodyClassName={'show-on-hover border-end-0 ps-4'}
          headerStyle={{ width: '3rem', textAlign: 'center' }}
          frozen
        />
        <Column
          field="number"
          header="Expense ID"
          body={expenseIDBody}
          frozen
          sortable
          headerClassName='paddingLeftHide shadowRight'
          bodyClassName='paddingLeftHide shadowRight'
          style={{ minWidth: '150px', width: '150px', maxWidth: '150px' }}
        />
        <Column
          field="supplier__name"
          header="Supplier A→Z"
          body={supplierBody}
          sortable
          style={{ minWidth: '224px' }}
        />
        <Column
          field="invoice_reference"
          header="Reference"
          body={referenceBody}
          style={{ minWidth: '150px' }}
        />
        <Column
          field="file"
          header="File"
          body={fileBody}
          style={{ minWidth: '60px', textAlign: 'center', maxWidth: '60px', width: '60px' }}
        />
        <Column
          field="due_date"
          header="Due Date"
          body={dueDateBody}
          sortable
          style={{ minWidth: '120px' }}
        />
        <Column
          field="total"
          header="Total"
          body={totalBody}
          sortable
          style={{ minWidth: '100px' }}
          bodyClassName="text-end"
        />
        <Column
          field="account_code.code"
          header="Account Code"
          body={accountCodeBody}
          sortable
          style={{ minWidth: '200px' }}
        />
        <Column
          field="xero_status"
          header="Xero/Myob"
          body={xeroBody}
          style={{ minWidth: '89px', textAlign: 'center' }}
        />
        <Column
          field="paid"
          header="Status"
          body={statusBody}
          sortable
          style={{ minWidth: '130px', maxWidth: '130px', width: '130px' }}
          bodyClassName="text-center"
          headerClassName="text-center"
        />
        {
          hasPermission(role, PERMISSIONS.EXPENSE.DELETE) &&
          <Column
            header="Actions"
            body={(rowData) => <ActionBody rowData={rowData} />}
            style={{ minWidth: '75px', maxWidth: '75px', width: '75px', textAlign: 'center' }}
          />
        }
      </DataTable>
      <ExpensesEdit key={editData?.id} id={editData?.id} name={editData?.name} visible={visible} setVisible={setVisible} setEditData={setEditData} setRefetch={setInternalRefetch} />
      <TotalExpenseDialog showDialog={showDialog} setShowDialog={setShowDialog} setRefetch={setInternalRefetch} />
    </>
  );
});

ExpenseHistoryTable.displayName = 'ExpenseHistoryTable';

export default ExpenseHistoryTable;
