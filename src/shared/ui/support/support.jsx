import React, { useState } from 'react';
import { Info } from 'react-bootstrap-icons';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { toast } from 'sonner';
import styles from './support.module.scss';
import { reachOutForSupport } from '../../../entities/support/api/support-api';

const Support = ({ visible, setVisible }) => {
    const [description, setDescription] = useState('');
    const [error, setError] = useState("");

    const handleClose = () => {
        setVisible(false);
        setDescription('');
        setError("");
    };
    const mutation = useMutation({
        mutationFn: (data) => reachOutForSupport(data),
        onSuccess: () => {
            setVisible(false);
            setDescription('');
            toast.success(`Your message has been sent successfully.`);
        },
        onError: (error) => {
            console.error('Error sending message:', error);
            toast.error(`Failed to sent your message. Please try again.`);
        }
    });

    const handleSubmit = () => {
        if (description.trim() === "") {
            setError("Please enter message.");
            return;
        }
        setError("");
        mutation.mutate({
            message: description,
        });
    };

    const headerElement = (
        <div className="d-flex flex-column">
            <div className="d-flex align-items-center gap-2">
                <div className={styles.circleDesignStyle}>
                    <div className={styles.out}>
                        <div className={styles.in}>
                            <Info size={24} color="#17B26A" />
                        </div>
                    </div>
                </div>
                <div className='d-flex flex-column'>
                    <span style={{ color: '#344054', fontSize: '20px', fontWeight: 600 }}>How can we help?</span>
                    {/* <small className='font-16' style={{ color: '#475467', fontWeight: 400 }}>Do you have a suggestion or found some bug? Let us know in the field below.</small> */}
                </div>
            </div>
        </div>
    );

    const footerElement = (
        <div className='d-flex justify-content-end gap-3 pt-3'>
            <Button label="Cancel" className='outline-button' onClick={handleClose} />
            <Button label="Submit" loading={mutation.isPending} disabled={mutation.isPending} className='solid-button' onClick={handleSubmit} />
        </div>
    );

    return (
        <Dialog header={headerElement} footer={footerElement} headerClassName='border-bottom py-3' contentClassName={clsx('px-0 border-bottom pb-4', styles.content)} visible={visible} onHide={handleClose}
            style={{ width: '600px' }}>
            <div className={styles.form}>
                <div className={styles.field}>
                    <label htmlFor="description">Message <span className="required">*</span></label>
                    <InputTextarea id="description" placeholder='Enter a message here...' value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className='border outline-none' style={{ resize: 'none' }} />
                    <small className="error-message">{error}</small>
                </div>
            </div>
        </Dialog>
    );
};

export default Support;