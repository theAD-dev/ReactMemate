import React, { useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { PlusCircle, X } from 'react-bootstrap-icons';
import { useMutation } from '@tanstack/react-query';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Sidebar } from 'primereact/sidebar';
import { toast } from 'sonner';
import styles from './create-new-vehicle.module.scss';
import { createNewVehicle } from '../../../../APIs/assets-api';
import VehicleForm from '../ui/vehicle-form';

export const CreateNewVehicle = ({ visible, setVisible, setRefetch }) => {
    const formRef = useRef(null);
    const [defaultValues,] = useState({});

    const mutation = useMutation({
        mutationFn: (data) => createNewVehicle(data),
        onSuccess: (response) => {
            console.log('response: ', response);
            toast.success(`Vehicle created successfully`);
            setVisible(false);
            setRefetch((refetch) => !refetch);
        },
        onError: (error) => {
            console.error('Error creating vehicle:', error);
            toast.error('Failed to create vehicle. Please try again.');
        }
    });

    const handleSubmit = async (data) => {
        
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
                    <div className="d-flex align-items-center justify-content-between flex-shrink-0" style={{ borderBottom: '1px solid #EAECF0', padding: '16px 24px' }}>
                        <div className="d-flex align-items-center gap-2">
                            <div className={styles.circledesignstyle}>
                                <div className={styles.out}>
                                    <PlusCircle size={24} color="#17B26A" />
                                </div>
                            </div>
                            <span style={{ color: '344054', fontSize: '20px', fontWeight: 600 }}>Add new Vehicle</span>
                        </div>
                        <span>
                            <Button type="button" className='text-button' ref={closeIconRef} onClick={(e) => hide(e)}>
                                <X size={24} color='#667085' />
                            </Button>
                        </span>
                    </div>

                    <div className='modal-body' style={{ padding: '24px', height: 'calc(100vh - 72px - 105px)', overflow: 'auto' }}>
                        <VehicleForm ref={formRef} onSubmit={handleSubmit} defaultValues={defaultValues} />
                    </div>

                    <div className='modal-footer d-flex align-items-center justify-content-end gap-3' style={{ padding: '16px 24px', borderTop: "1px solid var(--Gray-200, #EAECF0)", height: '72px' }}>
                        <Button type='button' onClick={(e) => { e.stopPropagation(); setVisible(false); }} className='outline-button'>Cancel</Button>
                        <Button type='button' disabled={mutation.isPending} onClick={handleExternalSubmit} className='solid-button' style={{ minWidth: '75px' }}>{mutation.isLoading ? <ProgressSpinner style={{ width: '20px', height: '20px' }} /> : "Save"}</Button>
                    </div>
                </div>
            )}
        ></Sidebar>
    );
};
