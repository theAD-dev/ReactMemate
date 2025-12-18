import { useState } from "react";
import { Google, X } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "sonner";
import { sendComposeEmail } from "../../../../../../APIs/management-api";
import { useAuth } from "../../../../../../app/providers/auth-provider";
import googleLogo from "../../../../../../assets/images/icon/googleLogo.png";
import GoogleReviewIcon from "../../../../../../assets/images/icon/googleReviewIcon.svg";
import SendDynamicEmailForm from "../../../../../../ui/send-email-2/send-email";

const GoogleReviewEmail = ({ projectId, contactPersons = [], hasGoogleReviewEmailSend, reInitialize }) => {
    const { session } = useAuth();
    const [, setPayload] = useState({});
    const [viewShow, setViewShow] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    const handleShow = () => {
        if (session?.has_google_review) {
            setViewShow(true);
        } else {
            setShowInstructions(true);
        }
    };

    const mutation = useMutation({
        mutationFn: (data) => sendComposeEmail(projectId, "google-review", data),
        onSuccess: () => {
            setViewShow(false);
            reInitialize();
            toast.success(`Email send successfully.`);
        },
        onError: (error) => {
            console.error('Error sending email:', error);
            toast.error(`Failed to send email. Please try again.`);
        }
    });

    return (
        <>
            <Button
                variant="light"
                className={clsx('rounded-circle px-2')}
                onClick={handleShow}
                title='Add to Mailchimp'
                style={{ width: '38px', height: '38px' }}
            >
                {
                    hasGoogleReviewEmailSend ? (
                        <img src={GoogleReviewIcon} alt="GoogleReview" style={{ width: '18px', height: '18px' }} />
                    ) : (
                        <Google size={16} color="#667085" />
                    )
                }
            </Button>

            {/* Instructions modal when Google Review is not connected */}
            <Modal
                show={showInstructions}
                onHide={() => setShowInstructions(false)}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="taskModelProject"
                animation={false}
            >
                <Modal.Header className="mb-0 pb-0 border-0">
                    <div className="modelHeader d-flex justify-content-between align-items-start">
                        <span>
                            <svg width="56" height="57" viewBox="0 0 56 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="4" y="4.5" width="48" height="48" rx="24" fill="#FEE4E2" />
                                <rect x="4" y="4.5" width="48" height="48" rx="24" stroke="#FEF3F2" strokeWidth="8" />
                                <path d="M28 18C22.48 18 18 22.48 18 28C18 33.52 22.48 38 28 38C33.52 38 38 33.52 38 28C38 22.48 33.52 18 28 18ZM29 33H27V31H29V33ZM29 29H27V23H29V29Z" fill="#F04438" />
                            </svg>
                            <span className='ms-3'>Google Review is currently unavailable</span>
                        </span>
                    </div>
                    <button className='CustonCloseModal' onClick={() => setShowInstructions(false)}>
                        <X size={24} color='#667085' />
                    </button>
                </Modal.Header>
                <Modal.Body>
                    <div className="ContactModel">
                        <p style={{ color: '#475467', fontSize: '14px', fontWeight: '400', lineHeight: '20px', textAlign: 'center' }}>
                            Google Review functionality is currently unavailable. To use this feature, please connect your Google Review account via <Link to="/settings/integrations?openGoogleReview=true" style={{ color: '#158ECC' }}>Settings &gt; Integrations</Link>.
                        </p>

                        <div className={clsx("d-flex align-items-center justify-content-center flex-column gap-1 m-auto border p-3 rounded")} style={{ marginTop: '16px', width: 'fit-content' }}>
                            <div className={clsx("d-flex align-items-center justify-content-center gap-2")}>
                                <img src={googleLogo} alt="Google Review" style={{ width: '20px', height: '20px' }} />
                                <h6 className="mb-0" style={{ color: '#101828', fontSize: '16px', fontWeight: '400', lineHeight: '24px' }}>
                                    Google Review
                                </h6>
                            </div>
                            <span className="px-2 py-1" style={{ fontSize: '12px', color: '#F79009', backgroundColor: '#FEF6EE', borderRadius: '16px' }}>
                                Disconnected
                                &nbsp;
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="9" viewBox="0 0 8 9" fill="none">
                                    <circle cx="4" cy="4.5" r="3" fill="#F79009" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <SendDynamicEmailForm show={viewShow} mutation={mutation} isLoading={false} setShow={setViewShow} setPayload={setPayload} contactPersons={contactPersons} defaultTemplateId={'Google Review'} />
        </>
    );
};

export default GoogleReviewEmail;
