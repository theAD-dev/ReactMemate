import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { RadioButton } from 'primereact/radiobutton';
import { toast } from 'sonner';
import style from './cancel-subscription.module.scss';
import { submitHubspotForm } from '../../../../../APIs/hubspot-api';
import { cancelSubscription } from '../../../../../APIs/settings-subscription-api';
import { useAuth } from '../../../../../app/providers/auth-provider';
import illustrationImage2 from '../../../../../assets/Illustration-2.svg';
import illustrationImage1 from '../../../../../assets/Illustration.svg';

const CancelSubscription = () => {
    const { session } = useAuth();
    const [showInitialConfirmation, setShowInitialConfirmation] = React.useState(false);
    const [showFeedbackForm, setShowFeedbackForm] = React.useState(false);
    const [showSuccess, setShowSuccess] = React.useState(false);
    const [selectedReason, setSelectedReason] = React.useState('');
    const [otherReason, setOtherReason] = React.useState('');

    const cancelSubscriptionMutation = useMutation({
        mutationFn: cancelSubscription,
        onSuccess: () => {
            setShowFeedbackForm(false);
            setShowSuccess(true);
        },
        onError: (error) => {
            console.error("Error canceling subscription:", error);
            toast.error("Failed to cancel subscription. Please try again.");
        },
    });

    const handleSubmitFeedback = async () => {
        if (!selectedReason) {
            toast.error("Please select a reason for cancellation.");
            return;
        }

        const response = await submitHubspotForm({
            firstname: session.first_name,
            lastname: session.last_name,
            email: session.email,
            company: session?.organization?.legal_name,
            whay_leaving: otherReason ? `Other reason: ${otherReason}` : selectedReason
        });

        if (response) {
            console.log("✅ HubSpot form submitted:", response);
            cancelSubscriptionMutation.mutate();
        }
    };

    const handleConfirmCancellation = () => {
        setShowInitialConfirmation(false);
        setShowFeedbackForm(true);
    };

    const reasons = [
        { id: 'The software didn\'t meet my expectations', label: "The software didn't meet my expectations" },
        { id: 'Too expensive', label: 'Too expensive' },
        { id: 'Found an alternative', label: 'Found an alternative' },
        { id: 'Temporary, I\'ll be back later', label: "Temporary, I'll be back later" },
        { id: 'other', label: 'Other (please specify):' }
    ];

    const initialConfirmationHeaderElement = (
        <div className={`${style.modalHeader}`}>
            <div className="w-100 d-flex align-items-center gap-2">
                <span className={`white-space-nowrap mt-2 mb-2 ${style.headerTitle}`}>
                    Are you sure you want to go?
                </span>
            </div>
        </div>
    );

    const initialConfirmationFooterElement = (
        <div className={`d-flex justify-content-between`}>
            <Button
                className='danger-button'
                onClick={handleConfirmCancellation}
            >
                Confirm Cancellation
            </Button>
            <Button className='info-button' onClick={() => setShowInitialConfirmation(false)}>Stay with us</Button>
        </div>
    );

    const headerElement = (
        <div className={`${style.modalHeader}`}>
            <div className="w-100 d-flex align-items-center gap-2">
                <span className={`white-space-nowrap mt-2 mb-2 ${style.headerTitle}`}>
                    We’re sorry to see you go!
                </span>
            </div>
        </div>
    );

    const footerElement = (
        <div className={`d-flex justify-content-between`}>
            <Button
                className='danger-button'
                onClick={handleSubmitFeedback}
                disabled={cancelSubscriptionMutation.isPending || !selectedReason}
            >
                Submit Feedback & Complete Cancellation
                {cancelSubscriptionMutation.isPending && <ProgressSpinner style={{ width: '18px', height: '18px', marginLeft: '8px' }}></ProgressSpinner>}
            </Button>
            <Button className='info-button' onClick={() => setShowFeedbackForm(false)}>Keep Subscription</Button>
        </div>
    );
    const successHeaderElement = (
        <div className={`${style.modalHeader}`}>
            <div className="w-100 d-flex align-items-center gap-2">
                <span className={`white-space-nowrap mt-2 mb-2 ${style.headerTitle}`}>
                    You've successfully unsubscribed.
                </span>
            </div>
        </div>
    );

    const successFooterElement = (
        <div className={`d-flex justify-content-center`}>
            <Button
                className='outline-button'
                onClick={() => {
                    setShowSuccess(false);
                    window.location.reload();
                }}
            >
                Close
            </Button>
        </div>
    );

    return (
        <>
            <button className="closeSubscription" disabled={cancelSubscriptionMutation.isPending} onClick={() => setShowInitialConfirmation(true)}>
                Cancel Subscription
                {cancelSubscriptionMutation.isPending && <ProgressSpinner style={{ width: '18px', height: '18px' }}></ProgressSpinner>}
            </button>

            {/* Initial Confirmation Modal */}
            <Dialog header={initialConfirmationHeaderElement} footer={initialConfirmationFooterElement} visible={showInitialConfirmation} onHide={() => setShowInitialConfirmation(false)} className={`${style.modal} custom-modal`}>
                <div className={`${style.modalContent}`}>
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <img src={illustrationImage2} alt="Cancellation" style={{ width: '220px', height: '160px', borderRadius: '50%' }} />
                        </div>
                        <p style={{
                            color: '#6b7280',
                            fontSize: '16px',
                            lineHeight: '24px'
                        }}>
                            We'll miss having you around, but you're always welcome back!
                        </p>
                    </div>
                </div>
            </Dialog>

            {/* Feedback Form Modal */}
            <Dialog header={headerElement} footer={footerElement} visible={showFeedbackForm} onHide={() => setShowFeedbackForm(false)} className={`${style.modal} custom-modal`}>
                <div className={`${style.modalContent}`}>
                    <div className={style.formContainer}>
                        <div className={style.formSection}>
                            <p className={style.sectionTitle}>
                                Could you tell us why you're leaving? Your feedback helps us improve.
                            </p>
                            <div className={style.radioGroup}>
                                {reasons.map((reason) => (
                                    <div key={reason.id} className={style.radioOption}>
                                        <RadioButton
                                            inputId={reason.id}
                                            name="cancellationReason"
                                            value={reason.id}
                                            onChange={(e) => { setSelectedReason(e.value); setOtherReason(''); }}
                                            checked={selectedReason === reason.id}
                                        />
                                        <label htmlFor={reason.id}>
                                            {reason.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {selectedReason === 'other' && (
                                <div className={style.formSection} style={{ marginTop: '16px' }}>
                                    <p className={style.sectionTitle}>
                                        Let us know what influenced your decision to cancel
                                    </p>
                                    <textarea
                                        className={style.textArea}
                                        value={otherReason}
                                        onChange={(e) => setOtherReason(e.target.value)}
                                        placeholder="Feel free to share any thoughts or suggestions..."
                                        rows={4}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Dialog>

            {/* Success Modal */}
            <Dialog header={successHeaderElement} footer={successFooterElement} visible={showSuccess} onHide={() => setShowSuccess(false)} className={`${style.modal} custom-modal`}>
                <div className={`${style.modalContent}`}>
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <p style={{
                            color: '#6b7280',
                            fontSize: '16px',
                            lineHeight: '24px',
                            marginBottom: '20px',
                            textAlign: 'center'
                        }}>
                            Thanks for being part of our journey. Your subscription has been cancelled, and no further charges will occur.
                        </p>

                        <div style={{ marginBottom: '20px' }}>
                            <img src={illustrationImage1} alt="Success" style={{ width: '220px', height: '160px', borderRadius: '50%' }} />
                        </div>

                        <p style={{
                            color: '#6b7280',
                            fontSize: '16px',
                            lineHeight: '24px',
                            textAlign: 'center',
                        }}>
                            You're always welcome back, we'll be here when you need us.
                        </p>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default CancelSubscription;