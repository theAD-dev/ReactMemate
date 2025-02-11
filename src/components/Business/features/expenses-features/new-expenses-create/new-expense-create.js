import React, { useRef, useState } from 'react'
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'react-bootstrap';
import { PlusCircle, X } from 'react-bootstrap-icons';

import styles from './new-expense-create.module.scss';
import ExpensesForm from '../../../shared/ui/expense-ui/expenses-form';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { createNewExpense } from '../../../../../APIs/expenses-api';

const NewExpensesCreate = ({ visible, setVisible, setRefetch }) => {
    const url = window.location.href;
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    const projectId = params.get('projectId');
    if (projectId) setVisible(true);

    const formRef = useRef(null);
    const [defaultValues, setDefaultValues] = useState({
        option: 'Assign to order',
        notification: false
    });
    const mutation = useMutation({
        mutationFn: (data) => createNewExpense(data),
        onSuccess: (response) => {
            console.log('response: ', response);
            toast.success(`Expense created successfully`);
            setVisible(false);
            setRefetch((refetch) => !refetch);
        },
        onError: (error) => {
            console.error('Error creating expense:', error);
            toast.error('Failed to create expense. Please try again.');
        }
    });

    const handleSubmit = async (data) => {
        delete data["gst-calculation"];
        delete data.option;
        delete data.subtotal;
        delete data.totalAmount
        delete data.tax;

        if (!data.order) delete data.order;
        if (!data.type) data.type = 1;
        if (data.date) data.date = new Date(data.date).toISOString().split('T')[0];
        if (data.due_date) data.due_date = new Date(data.due_date).toISOString().split('T')[0];
        console.log('data: ', data);
        mutation.mutate(data);
    };

    const handleExternalSubmit = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };
    return (
        <Sidebar visible={visible} position="right" onHide={() => setVisible(false)} modal={false} dismissable={false} style={{ width: '702px' }}
            content={({ closeIconRef, hide }) => (
                <div className='create-sidebar d-flex flex-column'>
                    <div className="d-flex align-items-center justify-content-between flex-shrink-0" style={{ borderBottom: '1px solid #EAECF0', padding: '24px' }}>
                        <div className="d-flex align-items-center gap-2">
                            <div className={styles.circledesignstyle}>
                                <div className={styles.out}>
                                    <PlusCircle size={24} color="#17B26A" />
                                </div>
                            </div>
                            <span style={{ color: '344054', fontSize: '20px', fontWeight: 600 }}>Create new Expense</span>
                        </div>
                        <span>
                            <Button type="button" className='text-button' ref={closeIconRef} onClick={(e) => hide(e)}>
                                <X size={24} color='#667085' />
                            </Button>
                        </span>
                    </div>

                    <div className='modal-body' style={{ padding: '24px', height: 'calc(100vh - 72px - 105px)', overflow: 'auto' }}>
                        <div className={`d-flex align-items-center mb-2 justify-content-between ${styles.expensesEditHead}`}>
                            <h5>Supplier Details</h5>
                        </div>
                        <ExpensesForm ref={formRef} onSubmit={handleSubmit} defaultValues={defaultValues} setVisible={setVisible} projectId={projectId}/>
                    </div>

                    <div className='modal-footer d-flex align-items-center justify-content-end gap-3' style={{ padding: '16px 24px', borderTop: "1px solid var(--Gray-200, #EAECF0)", height: '72px' }}>
                        <Button type='button' onClick={(e) => { e.stopPropagation(); setVisible(false) }} className='outline-button'>Cancel</Button>
                        <Button type='button' onClick={handleExternalSubmit} className='solid-button' style={{ minWidth: '70px' }}>{mutation.isPending ? "Loading..." : "Save"}</Button>
                    </div>
                </div>
            )}
        ></Sidebar>
    )
}

export default NewExpensesCreate