import React, { useState, useEffect } from 'react';
import { X } from 'react-bootstrap-icons';
import { ProgressSpinner } from 'primereact/progressspinner';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import AddNote from './components/add-note';
import ComposeEmail from './components/compose-email';
import NewTask from './components/new-task';
import SendSMS from './components/send-sms';
import style from './view-enquiry-lead.module.scss';

const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(+timestamp * 1000);
    const formatter = new Intl.DateTimeFormat("en-AU", {
        timeZone: 'Australia/Sydney',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    return formatter.format(date);
};

const ViewEnquiryLead = ({ visible, editData, onClose }) => {
    const [isFetching] = useState(false);
    const [leadData, setLeadData] = useState(null);

    useEffect(() => {
        if (visible && editData?.leadData) {
            setLeadData(editData.leadData);
        }
    }, [visible, editData]);

    const handleClose = () => {
        onClose();
        setLeadData(null);
    };

    const reInitialize = () => {
        // TODO: Implement refetch logic
        console.log('Reinitialize called');
    };

    return (
        <Modal
            show={visible}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            className="projectCardModel"
            onHide={handleClose}
            animation={false}
            enforceFocus={false}
            size="xl"
        >
            <Modal.Header className="mb-0 pb-0 justify-content-between">
                <div className="modelHeader" style={{ flex: '1', maxWidth: "calc(100% - 100px)" }}>
                    <ul className='d-flex align-items-center'>
                        <li className='me-1 d-flex align-items-center'>
                            <span className='cardId text-nowrap' style={{ fontSize: '18px', fontWeight: 600, color: '#101828' }}>
                                Lead Details
                            </span>
                        </li>
                    </ul>
                </div>
                <div className='d-flex align-items-center' style={{ gap: '15px' }}>
                    <button className='CustonCloseModal' onClick={handleClose}>
                        <X size={24} color='#667085' />
                    </button>
                </div>
            </Modal.Header>
            <Modal.Body className='p-0'>
                <div className="ContactModel">
                    <Row className="text-left mt-0 projectCardMain">
                        <Col sm={6} className='orderDiscription'>
                            <strong>Lead Information</strong>
                            <div className='customScrollBar'>
                                {isFetching ? (
                                    <ProgressSpinner style={{ width: '30px', height: '30px' }} />
                                ) : (
                                    <div className={style.leadInfoSection}>
                                        <div className={style.infoRow}>
                                            <span className={style.label}>Form Title:</span>
                                            <span className={style.value}>{leadData?.form_title || '-'}</span>
                                        </div>
                                        <div className={style.infoRow}>
                                            <span className={style.label}>Form Type:</span>
                                            <span className={style.value}>
                                                {leadData?.form_type === 'web' ? 'Web Form' : 'Custom Form'}
                                            </span>
                                        </div>
                                        <div className={style.infoRow}>
                                            <span className={style.label}>Submitted At:</span>
                                            <span className={style.value}>{formatDate(leadData?.submitted_at)}</span>
                                        </div>
                                        <div className={style.infoRow}>
                                            <span className={style.label}>Name:</span>
                                            <span className={style.value}>{leadData?.data?.name || '-'}</span>
                                        </div>
                                        <div className={style.infoRow}>
                                            <span className={style.label}>Email:</span>
                                            <span className={style.value}>{leadData?.data?.email || '-'}</span>
                                        </div>
                                        <div className={style.infoRow}>
                                            <span className={style.label}>Phone:</span>
                                            <span className={style.value}>{leadData?.data?.phone || '-'}</span>
                                        </div>
                                        
                                        {/* Display other form fields */}
                                        {leadData?.data && Object.entries(leadData.data).map(([key, value]) => {
                                            if (!['name', 'email', 'phone'].includes(key) && value) {
                                                return (
                                                    <div key={key} className={style.infoRow}>
                                                        <span className={style.label}>
                                                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}:
                                                        </span>
                                                        <span className={style.value}>{value}</span>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}

                                        {leadData?.assigned_to && (
                                            <div className={style.infoRow}>
                                                <span className={style.label}>Assigned To:</span>
                                                <span className={style.value}>
                                                    {leadData.assigned_to.first_name} {leadData.assigned_to.last_name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Col>
                        <Col sm={6} className='projectHistoryCol'>
                            <Row>
                                <Col className='tabModelMenu d-flex justify-content-between align-items-center p-0'>
                                    <AddNote submissionId={editData?.id} />
                                    <NewTask submission={leadData} reInitialize={reInitialize} />
                                    <SendSMS submissionId={editData?.id} phone={leadData?.data?.phone} />
                                    <ComposeEmail submissionId={editData?.id} email={leadData?.data?.email} />
                                </Col>
                            </Row>
                            <Row className='projectHistoryWrap'>
                                <Col className='p-0'>
                                    <h3>Activity History</h3>
                                    <div className='projectHistoryScroll'>
                                        {/* TODO: Implement activity history */}
                                        <div className='projectHistorygroup'>
                                            <p style={{ color: '#98A2B3', fontSize: '14px' }}>
                                                No activity history available yet.
                                            </p>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-end gap-2 border-top pt-3'>
                <Button variant="outline-secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button 
                    variant="primary" 
                    onClick={() => {
                        // TODO: Implement move to quote functionality
                        console.log('Move to Quote clicked');
                    }}
                >
                    Move to Quote
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ViewEnquiryLead;
