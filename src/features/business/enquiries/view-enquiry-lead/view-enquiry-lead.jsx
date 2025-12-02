import React, { useState, useEffect } from 'react';
import { X, Envelope, Telephone, Person, Calendar, FileText } from 'react-bootstrap-icons';
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

const formatFieldLabel = (key) => {
    return key
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const ViewEnquiryLead = ({ visible, editData, onClose }) => {
    console.log('editData: ', editData);
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
            <Modal.Header className={style.modalHeader}>
                <div className={style.headerContent}>
                    <div className={style.headerIcon}>
                        <FileText size={20} color="#17B26A" />
                    </div>
                    <div className={style.headerText}>
                        <h2 className={style.headerTitle}>Lead Details</h2>
                        {leadData?.form_title && (
                            <p className={style.headerSubtitle}>{leadData.form_title}</p>
                        )}
                    </div>
                </div>
                <button className={style.closeButton} onClick={handleClose} aria-label="Close">
                    <X size={24} />
                </button>
            </Modal.Header>
            <Modal.Body className='p-0'>
                <div className={style.modalContent}>
                    <Row className="g-0">
                        <Col lg={6} className={style.leftColumn}>
                            <div className={style.sectionHeader}>
                                <h3>Lead Information</h3>
                            </div>
                            <div className={style.scrollContainer}>
                                {isFetching ? (
                                    <div className={style.loadingContainer}>
                                        <ProgressSpinner style={{ width: '40px', height: '40px' }} />
                                    </div>
                                ) : (
                                    <div className={style.leadInfoSection}>
                                        {/* Primary Contact Information */}
                                        {leadData?.data?.name && (
                                            <div className={style.infoCard}>
                                                <div className={style.infoIcon}>
                                                    <Person size={18} />
                                                </div>
                                                <div className={style.infoContent}>
                                                    <span className={style.infoLabel}>Name</span>
                                                    <span className={style.infoValue}>{leadData.data.name}</span>
                                                </div>
                                            </div>
                                        )}

                                        {leadData?.data?.email && (
                                            <div className={style.infoCard}>
                                                <div className={style.infoIcon}>
                                                    <Envelope size={18} />
                                                </div>
                                                <div className={style.infoContent}>
                                                    <span className={style.infoLabel}>Email</span>
                                                    <a href={`mailto:${leadData.data.email}`} className={style.infoLink}>
                                                        {leadData.data.email}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {leadData?.data?.phone && (
                                            <div className={style.infoCard}>
                                                <div className={style.infoIcon}>
                                                    <Telephone size={18} />
                                                </div>
                                                <div className={style.infoContent}>
                                                    <span className={style.infoLabel}>Phone</span>
                                                    <a href={`tel:${leadData.data.phone}`} className={style.infoLink}>
                                                        {leadData.data.phone}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {/* Form Metadata */}
                                        <div className={style.divider}>
                                            <span>Form Details</span>
                                        </div>

                                        <div className={style.infoRow}>
                                            <span className={style.label}>Form Type</span>
                                            <span className={style.badge}>
                                                {leadData?.form_type === 'web' ? 'Web Form' : 'Custom Form'}
                                            </span>
                                        </div>

                                        {leadData?.submitted_at && (
                                            <div className={style.infoRow}>
                                                <span className={style.label}>Submitted At</span>
                                                <span className={style.value}>
                                                    <Calendar size={14} className="me-1" />
                                                    {formatDate(leadData.submitted_at)}
                                                </span>
                                            </div>
                                        )}

                                        {/* Additional Form Fields - Table Format */}
                                        {leadData?.data && Object.entries(leadData.data).filter(([key, value]) => 
                                            !['name', 'email', 'phone'].includes(key) && value
                                        ).length > 0 && (
                                            <div className={style.tableContainer}>
                                                <table className={style.dataTable}>
                                                    <tbody>
                                                        {Object.entries(leadData.data).map(([key, value]) => {
                                                            if (!['name', 'email', 'phone'].includes(key) && value) {
                                                                return (
                                                                    <tr key={key}>
                                                                        <td className={style.tableLabel}>{formatFieldLabel(key)}</td>
                                                                        <td className={style.tableValue}>{value}</td>
                                                                    </tr>
                                                                );
                                                            }
                                                            return null;
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}

                                        {/* Assignment Information */}
                                        {leadData?.assigned_to && (
                                            <>
                                                <div className={style.divider}>
                                                    <span>Assignment</span>
                                                </div>
                                                <div className={style.infoRow}>
                                                    <span className={style.label}>Assigned To</span>
                                                    <span className={style.value}>
                                                        {leadData.assigned_to.first_name} {leadData.assigned_to.last_name}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Col>
                        <Col lg={6} className={style.rightColumn}>
                            <div className={style.actionsRow}>
                                <AddNote submissionId={editData?.id} />
                                <NewTask submission={leadData} reInitialize={reInitialize} />
                                <SendSMS submissionId={editData?.id} phone={leadData?.data?.phone} />
                                <ComposeEmail submissionId={editData?.id} email={leadData?.data?.email} />
                            </div>
                            <div className={style.activitySection}>
                                <div className={style.sectionHeader}>
                                    <h3>Activity History</h3>
                                </div>
                                <div className={style.activityScroll}>
                                    {/* TODO: Implement activity history */}
                                    <div className={style.emptyState}>
                                        <div className={style.emptyIcon}>
                                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect width="48" height="48" rx="24" fill="#F9FAFB"/>
                                                <path d="M24 16V32M16 24H32" stroke="#98A2B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </div>
                                        <p className={style.emptyText}>No activity history available yet.</p>
                                        <p className={style.emptySubtext}>
                                            Activities like notes, tasks, emails, and SMS will appear here.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Modal.Body>
            <Modal.Footer className={style.modalFooter}>
                <Button className="outline-button" onClick={handleClose}>
                    Close
                </Button>
                <Button 
                    className="solid-button"
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
