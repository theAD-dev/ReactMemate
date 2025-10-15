import React, { useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { PlusCircle, X } from 'react-bootstrap-icons';
import { useMutation } from '@tanstack/react-query';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';
import { toast } from 'sonner';
import styles from './create-new-service.module.scss';
import { createNewService } from '../../../../APIs/assets-api';
import ServiceForm from '../ui/service-form';

export const CreateNewService = ({ visible, setVisible, setRefetch, vehicleId = 1 }) => {
    const formRef = useRef(null);
    const [defaultValues,] = useState({});

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
        },
        onError: (error) => {
            console.error('Error creating service:', error);
            const errorMessage = error?.data?.message || 'Failed to create service. Please try again.';
            toast.error(errorMessage);
        }
    });

    const handleSubmit = async (data) => {
        console.log('Service form data:', data);
        mutation.mutate(data);
    };

    const handleExternalSubmit = () => {
        if (formRef.current) {
            formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };

    return (
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
                        <ServiceForm ref={formRef} onSubmit={handleSubmit} defaultValues={defaultValues} />
                    </div>

                    <div className='modal-footer d-flex align-items-center justify-content-end gap-3' style={{ padding: '16px 24px', borderTop: "1px solid var(--Gray-200, #EAECF0)", height: '72px' }}>
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
                        <Button 
                            type='button' 
                            disabled={mutation.isPending} 
                            onClick={handleExternalSubmit} 
                            className='solid-button' 
                            style={{ minWidth: '75px' }}
                        >
                            {mutation.isPending ? <ProgressSpinner style={{ width: '20px', height: '20px' }} /> : "Save"}
                        </Button>
                    </div>
                </div>
            )}
        />
    );
};

export default CreateNewService;