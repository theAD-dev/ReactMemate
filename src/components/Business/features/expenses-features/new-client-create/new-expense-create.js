import clsx from 'clsx';
import { nanoid } from 'nanoid';
import React, { useEffect, useRef, useState } from 'react'
import { Sidebar } from 'primereact/sidebar';
import { Button, Col, Row } from 'react-bootstrap';
import {  PlusCircle, X } from 'react-bootstrap-icons';

import styles from './new-expense-create.module.scss';
import ExpensesForm from './expenses-form';
// import { createNewIndividualClient } from '../../../../../APIs/ClientsApi';
import { toast } from 'sonner';
import { createFormData, handleApiRequest } from '../../../actions/indivisual-client-actions';

const NewExpensesCreate = ({ visible, setVisible }) => {
    const formRef = useRef(null);
    const [isPending, setIsPending] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [tab, setTab] = useState('1');
    const [businessDefaultValues, setBusinessDefaultValues] = useState({
        phone: { country: '', number: '' },
        contact_persons: [{}],
        addresses: [{}],
    });
    const expensesFormSubmit = async (data) => {
        console.log('expensesFormSubmit: ', data);

        const formData = createFormData(data, photo);
        const onSuccess = (response) => {
            console.log('response: ', response);
            toast.success(`New client created successfully`);
            setVisible(false);
        };

        const onError = () => {
            toast.error('Failed to create new client. Please try again.');
        };

        setIsPending(true);
        await handleApiRequest(
            `${process.env.REACT_APP_BACKEND_API_URL}/expenses/individual/new/`,
            'POST',
            formData,
            onSuccess,
            onError
        );
        setIsPending(false);
    }

    const businessFormSubmit = async (data) => {
        console.log('data: ', data);
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("abn", data.abn);
        formData.append("phone", data.phone);
        formData.append("email", data.email);
        formData.append("website", data.website);
        formData.append("payment_terms", data.payment_terms);
        formData.append("category", data.category);
        formData.append("industry", data.industry);
        formData.append("description", data.description);

     

     

     

        try {
            setIsPending(true);
            const accessToken = sessionStorage.getItem("access_token");
            const response = await fetch(`${process.env.REACT_APP_BACKEND_API_URL}/clients/business/new/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                body: formData,
            });
            if (response.ok) {
                console.log('response: ', response);
                toast.success(`New client created successfully`);
                setVisible(false);
            } else {
                toast.error('Failed to create new client. Please try again.');
            }
        } catch (err) {
            toast.error(`Failed to create new client. Please try again.`);
        } finally {
            setIsPending(false);
        }
    }

    const handleSubmit = async (data) => {
        expensesFormSubmit(data);  
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
                    <div class={`d-flex align-items-center mb-2 justify-content-between ${styles.expensesEditHead}`}>
                        <h5>Supplier Details</h5>
                        <h6>Expense ID: ELT-339047-1</h6>
                        </div>
                             <ExpensesForm photo={photo} setPhoto={setPhoto} ref={formRef} onSubmit={handleSubmit} />

                    </div>

                    <div className='modal-footer d-flex align-items-center justify-content-end gap-3' style={{ padding: '16px 24px', borderTop: "1px solid var(--Gray-200, #EAECF0)", height: '72px' }}>
                        <Button type='button' onClick={(e) => { e.stopPropagation(); setVisible(false) }} className='outline-button'>Cancel</Button>
                        <Button type='button' onClick={handleExternalSubmit} className='solid-button' style={{ minWidth: '179px' }}>{isPending ? "Loading..." : "Save Client Details"}</Button>
                    </div>
                </div>
            )}
        ></Sidebar>
    )
}

export default NewExpensesCreate