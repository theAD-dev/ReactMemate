import React, { useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { PlusCircle, X } from 'react-bootstrap-icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';
import { toast } from 'sonner';
import styles from './create-new-service.module.scss';
import { createNewService } from '../../../../APIs/assets-api';
import NewExpensesCreate from '../../../../components/Business/features/expenses-features/new-expenses-create/new-expense-create';
import ServiceForm from '../ui/service-form';

export const CreateNewService = ({ visible, setVisible, setRefetch, vehicleId = 1 }) => {
    const formRef = useRef(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [defaultValues,] = useState({});
    const [isDisabled, setIsDisabled] = useState(true);
    const [showCreateExpenseModal, setShowCreateExpenseModal] = useState(false);
    const [assetForExpense, setAssetForExpense] = useState(null);
    const [expenseService, setExpenseService] = useState(false);


    const mutation = useMutation({
        mutationFn: (data) => {
            // Format dates to YYYY-MM-DD format before sending
            const formattedData = {
                ...data,
                date: data.date ? new Date(data.date).toISOString().split('T')[0] : null,
                upcoming_date: data.upcoming_date ? new Date(data.upcoming_date).toISOString().split('T')[0] : null,
            };
            return createNewService(vehicleId, formattedData);
        },
        onSuccess: (response) => {
            console.log('Service created successfully:', response);
            toast.success(`Service created successfully`);
            setVisible(false);
            if (setRefetch) {
                setRefetch((refetch) => !refetch);
            }
            navigate('/assets?type=vehicles');
        },
        onError: (error) => {
            console.error('Error creating service:', error);
            const errorMessage = error?.data?.message || 'Failed to create service. Please try again.';
            toast.error(errorMessage);
        }
    });

    function formatDateToYMD(date) {
        if (!date) return '';
        date = new Date(date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const handleSubmit = async (data) => {
        data.date = formatDateToYMD(data.date);
        data.upcoming_date = formatDateToYMD(data.upcoming_date);
        mutation.mutate(data);
    };

    const handleExternalSubmit = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };

    const createServiceFromExpense = async (expense) => {
        if (expenseService) {
            expenseService.expense = expense;
            await mutation.mutateAsync(expenseService);
        }
    };

    return (
        <>
            <Sidebar
                visible={visible}
                position="right"
                onHide={() => setVisible(false)}
                modal={false}
                dismissable={false}
                style={{ width: '702px' }}
                content={({ closeIconRef, hide }) => (
                    <div className='create-sidebar d-flex flex-column'>
                        <div className="d-flex align-items-center justify-content-between flex-shrink-0" style={{ borderBottom: '1px solid #EAECF0', padding: '16px 24px' }}>
                            <div className="d-flex align-items-center gap-2">
                                <div className={styles.circledesignstyle}>
                                    <div className={styles.out}>
                                        <PlusCircle size={24} color="#17B26A" />
                                    </div>
                                </div>
                                <span style={{ color: '#344054', fontSize: '20px', fontWeight: 600 }}>Add New Service</span>
                            </div>
                            <span>
                                <Button type="button" className='text-button' ref={closeIconRef} onClick={(e) => hide(e)}>
                                    <X size={24} color='#667085' />
                                </Button>
                            </span>
                        </div>

                        <div className='modal-body' style={{ padding: '24px', height: 'calc(100vh - 72px - 105px)', overflow: 'auto' }}>
                            <ServiceForm ref={formRef} onSubmit={handleSubmit} defaultValues={defaultValues} setIsDisabled={setIsDisabled} setExpenseService={setExpenseService} vehicleId={id} />
                        </div>

                        <div className='modal-footer d-flex align-items-center justify-content-between gap-3' style={{ padding: '16px 24px', borderTop: "1px solid var(--Gray-200, #EAECF0)", height: '72px' }}>
                            <Button
                                type='button'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setVisible(false);
                                }}
                                className='outline-button'
                            >
                                Cancel
                            </Button>

                            <div className='d-flex align-items-center gap-3'>
                                <Button type="button"
                                    disabled={isDisabled}
                                    className='outline-button'
                                    onClick={() => {
                                        setShowCreateExpenseModal(true);
                                        setAssetForExpense({ type: 1, id: +id });
                                    }}
                                >
                                    Create Expense and Save
                                </Button>

                                <Button
                                    type='button'
                                    disabled={mutation.isPending || isDisabled}
                                    onClick={handleExternalSubmit}
                                    className='solid-button'
                                    style={{ minWidth: '75px' }}
                                >
                                    {mutation.isPending ? <ProgressSpinner style={{ width: '20px', height: '20px' }} /> : "Save"}
                                </Button>
                            </div>

                        </div>
                    </div>
                )}
            />
            {/* Create New Expense Modal */}
            {
                showCreateExpenseModal && assetForExpense.id && assetForExpense.type &&
                <NewExpensesCreate
                    visible={showCreateExpenseModal}
                    setVisible={setShowCreateExpenseModal}
                    createNewService={true}
                    createServiceFromExpense={createServiceFromExpense}
                    assetForExpense={assetForExpense}
                    setRefetch={setRefetch}
                />
            }

        </>
    );
};

export default CreateNewService;