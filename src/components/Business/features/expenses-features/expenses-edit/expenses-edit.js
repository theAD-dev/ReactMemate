import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { PlusCircle, X } from 'react-bootstrap-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';
import { toast } from 'sonner';
import styles from './expense-edit.module.scss';
import { getExpense, updateExpense } from '../../../../../APIs/expenses-api';
import ExpensesForm from '../../../shared/ui/expense-ui/expenses-form';
import SidebarClientLoading from '../sidebar-client-loading/sidebar-client-loading';


const ExpensesEdit = ({ visible, setVisible, setEditData, id, name, setRefetch }) => {
  const formRef = useRef(null);
  const [asset, setAsset] = useState(null);
  const [defaultValues, setDefaultValues] = useState({});

  const expense = useQuery({ queryKey: ['getExpense', id], queryFn: () => getExpense(id), enabled: !!id });
  const mutation = useMutation({
    mutationFn: (data) => updateExpense(id, data),
    onSuccess: (response) => {
      console.log('response: ', response);
      toast.success(`Expense updated successfully`);
      setVisible(false);
      setEditData({});
      setDefaultValues({});
      setRefetch((refetch) => !refetch);
      expense.refetch();
    },
    onError: (error) => {
      console.error('Error updating expense:', error);
      toast.error('Failed to update expense. Please try again.');
    }
  });

  const handleSubmit = async (data, reset) => {
    setDefaultValues((others) => ({
      ...others,
      ...data
    }));

    delete data["gst-calculation"];
    delete data.option;
    delete data.subtotal;
    delete data.totalAmount;
    delete data.tax;

    if (!data.order) delete data.order;
    if (!data.type) data.type = 2;
    if (data.date) data.date = new Date(data.date).toISOString().split('T')[0];
    if (data.due_date) data.due_date = new Date(data.due_date).toISOString().split('T')[0];
    console.log('data: ', data);
    mutation.mutateAsync(data);
  };

  const handleExternalSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  const calculateGST = (nogst, gst) => {
    if (gst) return "ex";
    else if (nogst) return "no";
    else return "in";
  };

  const calculateAmounts = (amount, gstType) => {
    let calculatedTax = 0;
    let subtotal = 0;

    if (gstType === 'ex') {
      subtotal = amount;
      calculatedTax = subtotal * 0.10;
    } else if (gstType === 'in') {
      calculatedTax = amount * 0.10 / 1.10;
      subtotal = amount - calculatedTax;
    } else {
      subtotal = amount;
      calculatedTax = 0;
    }

    return {
      subtotal: subtotal.toFixed(2),
      tax: calculatedTax.toFixed(2),
      totalAmount: (parseFloat(subtotal) + parseFloat(calculatedTax)).toFixed(2),
    };
  };

  useEffect(() => {
    if (expense?.data) {
      const gstType = calculateGST(expense?.data?.nogst, expense?.data?.gst);
      const { subtotal, tax, totalAmount } = calculateAmounts(+expense?.data?.amount, gstType);

      if (expense?.data?.asset) {
        setAsset({ id: expense?.data?.asset?.asset_id, type: expense?.data?.asset.asset_type_id });
      }

      setDefaultValues((others) => ({
        ...others,
        note: expense?.data?.note,
        supplier: expense?.data?.supplier,
        invoice_reference: expense?.data?.invoice_reference,
        date: new Date(+expense?.data?.date * 1000),
        due_date: new Date(+expense?.data?.due_date * 1000),
        amount: expense?.data?.amount,
        nogst: expense?.data?.nogst,
        gst: expense?.data?.gst,
        order: expense?.data?.order,
        type: +expense?.data?.type,
        account_code: expense?.data?.account_code,
        // department: expense?.data?.department,
        notification: expense?.data?.notification,
        "gst-calculation": gstType,
        subtotal,
        tax,
        totalAmount,
        option: expense?.data?.order ? 'Assign to project' : expense?.data?.asset ? 'Assign to asset' : 'Assign to timeframe',
        file: expense?.data?.file
      }));
    }
  }, [expense?.data]);

  return (
    <Sidebar visible={visible} position="right" onHide={() => { setVisible(false); setEditData({}); }} modal={false} dismissable={false} style={{ width: '702px' }}
      content={({ closeIconRef, hide }) => (
        <div className='create-sidebar d-flex flex-column'>
          <div className="d-flex align-items-center justify-content-between flex-shrink-0" style={{ borderBottom: '1px solid #EAECF0', padding: '24px' }}>
            <div className="d-flex align-items-center gap-2">
              <div className={styles.circledesignstyle}>
                <div className={styles.out}>
                  <PlusCircle size={24} color="#17B26A" />
                </div>
              </div>
              <span style={{ color: '344054', fontSize: '20px', fontWeight: 600 }}>Update Expense</span>
            </div>
            <span>
              <Button type="button" className='text-button' ref={closeIconRef} onClick={(e) => hide(e)}>
                <X size={24} color='#667085' />
              </Button>
            </span>
          </div>

          <div className='modal-body' style={{ padding: '24px', height: 'calc(100vh - 72px - 122px)', overflow: 'auto' }}>
            {!expense?.isFetching && defaultValues?.option
              ? <>
                <div className={`d-flex align-items-center mb-2 justify-content-between ${styles.expensesEditHead}`}>
                  <h5>Expense Details</h5>
                  <h6>Expense ID: {expense?.data?.number || "-"}</h6>
                </div>
                <ExpensesForm ref={formRef} onSubmit={handleSubmit} defaultValues={defaultValues} defaultSupplier={{ name: name, id: expense?.data?.supplier }} id={id} asset={asset} setAsset={setAsset} />
              </>
              : <SidebarClientLoading />
            }
          </div>

          <div className='modal-footer d-flex align-items-center justify-content-end gap-3' style={{ padding: '16px 24px', borderTop: "1px solid var(--Gray-200, #EAECF0)", height: '72px' }}>
            <Button type='button' onClick={(e) => { e.stopPropagation(); setVisible(false); setEditData({}); }} className='outline-button' disabled={mutation.isPending}>Cancel</Button>
            <Button type='button' onClick={handleExternalSubmit} className='solid-button' style={{ minWidth: '70px' }} disabled={mutation.isPending}>Update {mutation.isPending && <ProgressSpinner style={{ width: '18px', height: '18px' }} />}</Button>
          </div>
        </div>
      )}
    ></Sidebar>
  );
};

export default ExpensesEdit;