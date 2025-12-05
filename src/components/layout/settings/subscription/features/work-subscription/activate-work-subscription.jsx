import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { InfoCircle } from 'react-bootstrap-icons';
import { useMutation } from '@tanstack/react-query';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'sonner';
import style from './activate-work-subscription.module.scss';
import { activeWorkSubscription } from '../../../../../../APIs/settings-subscription-api';
import { formatAUD } from '../../../../../../shared/lib/format-aud';

export const ActivateWorkSubscription = ({ defaultPrice, currentPrice }) => {
    const [showConfirmation, setShowConfirmation] = React.useState(false);

    const activeWorkMutation = useMutation({
        mutationFn: activeWorkSubscription,
        onSuccess: () => {
            toast.success("Work subscription activated successfully!");
            window.location.reload();
        },
        onError: (error) => {
            console.error("Error activating work subscription:", error);
            toast.error("Failed to active work subscription. Please try again.");
        },
    });

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <div className="w-100 d-flex align-items-center gap-2">
                <svg width="57" height="56" viewBox="0 0 57 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4.25781" y="4" width="48" height="48" rx="24" fill="#BAE8FF" />
                    <rect x="4.25781" y="4" width="48" height="48" rx="24" stroke="#EBF8FF" strokeWidth="8" />
                    <path d="M28.2578 17.5C29.9147 17.5 31.2578 18.8431 31.2578 20.5V26.5H25.2578V20.5C25.2578 18.8431 26.601 17.5 28.2578 17.5ZM32.7578 26.5V20.5C32.7578 18.0147 30.7431 16 28.2578 16C25.7725 16 23.7578 18.0147 23.7578 20.5V26.5C22.101 26.5 20.7578 27.8431 20.7578 29.5V37C20.7578 38.6569 22.101 40 23.7578 40H32.7578C34.4147 40 35.7578 38.6569 35.7578 37V29.5C35.7578 27.8431 34.4147 26.5 32.7578 26.5ZM23.7578 28H32.7578C33.5862 28 34.2578 28.6716 34.2578 29.5V37C34.2578 37.8284 33.5862 38.5 32.7578 38.5H23.7578C22.9294 38.5 22.2578 37.8284 22.2578 37V29.5C22.2578 28.6716 22.9294 28 23.7578 28Z" fill="#1AB2FF" />
                </svg>
                <span className={`white-space-nowrap mt-2 mb-2 ${style.headerTitle}`}>
                    Activate Work Subscription?
                </span>
            </div>
        </div>
    );

    const footerElement = (
        <div className={`d-flex justify-content-end gap-3`}>
            <Button
                className='outline-button'
                onClick={() => setShowConfirmation(false)}
                disabled={activeWorkMutation.isPending}
            >
                Cancel
            </Button>
            <Button disabled={activeWorkMutation.isPending} className='solid-button' onClick={() => activeWorkMutation.mutate()}>Confirm & Activate ${formatAUD(defaultPrice || "0.00")}/month
                {activeWorkMutation.isPending && <ProgressSpinner style={{ width: '18px', height: '18px', marginLeft: '8px' }}></ProgressSpinner>}
            </Button>
        </div>
    );

    return (
        <>
            <button className="paynow d-flex gap-1 align-items-center" onClick={() => setShowConfirmation(true)}>
                Active Work Subscription
            </button>
            <Dialog header={headerElement} footer={footerElement} visible={showConfirmation} onHide={() => setShowConfirmation(false)} className={`${style.modal} custom-modal`}>
                <div className={`${style.modalContent}`}>
                    <p className={`${style.modalText}`}>You’re about to activate the Work Subscription, which enables job assignment, shift tracking, and team collaboration features.</p>
                    <Row className='gap-2 mb-2'>
                        <Col sm={6} className={style.col}>
                            <label className={style.colLabel}>Current  Cost</label>
                            <p className={style.colValue1}>${formatAUD(currentPrice || "0.00")}</p>
                            <p className={style.month}>/month</p>
                        </Col>
                        <Col sm={6} className={style.col}>
                            <label className={style.colLabel}>New cost</label>
                            <p className={style.colValue}>${formatAUD(defaultPrice || "0.00")}</p>
                            <p className={style.month}>/month</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} className={style.col} style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div className={style.infoBox}>
                                    <InfoCircle color='#475467' size={20} />
                                </div>
                                <div>
                                    <label className='font-14' style={{ color: '#344054', fontWeight: 600 }}>Note:</label>
                                    <p className='mb-0 font-14' style={{ color: '#475467' }}>Activating this add-on will immediately update your monthly subscription cost. Charges will apply starting with your next billing cycle.</p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Dialog>
        </>
    );
};
