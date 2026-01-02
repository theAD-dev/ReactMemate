import { useState, useEffect } from 'react';
import { X, Envelope, Person, Calendar, FileText, ChatText, JournalText, ChatDots, CardChecklist, Check2Circle } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { ProgressSpinner } from 'primereact/progressspinner';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { toast } from 'sonner';
import AddNote from './components/add-note';
import ComposeEmail from './components/compose-email/compose-email';
import NewTask from './components/new-task';
import SendSMS from './components/send-sms/send-sms';
import style from './view-enquiry-lead.module.scss';
import { getEnquiryHistory } from '../../../../APIs/enquiries-api';
import { searchClients } from '../../../../APIs/global-search-api';

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
    const navigate = useNavigate();
    const enquiryId = editData?.id;
    const [isFetching] = useState(false);
    const [leadData, setLeadData] = useState(null);
    const [isMovingToSale, setIsMovingToSale] = useState(false);

    const enquiryHistoryQuery = useQuery({
        queryKey: ['enquiry-history', enquiryId],
        queryFn: () => getEnquiryHistory(enquiryId),
        enabled: !!enquiryId
    });

    const history = enquiryHistoryQuery?.data?.results || [];
    const isHistoryLoading = enquiryHistoryQuery?.isFetching;
    const hasHistory = history?.length > 0;

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
        enquiryHistoryQuery.refetch();
    };

    const handleMoveToSale = async () => {
        const email = leadData?.data?.email;
        
        if (!email) {
            // No email, store lead data and navigate to new client page
            const enquiryData = {
                name: leadData?.data?.name || '',
                email: '',
                phone: leadData?.data?.phone || '',
                formData: leadData?.data || {},
                enquiryId: enquiryId,
                formTitle: leadData?.form_title || ''
            };
            sessionStorage.setItem('enquiry-to-sale', JSON.stringify(enquiryData));
            handleClose();
            navigate('/sales/newquote/selectyourclient/new-clients');
            return;
        }

        setIsMovingToSale(true);
        
        try {
            // Search for client by email
            const response = await searchClients(email, 100);
            const clients = response?.results || [];
            
            // Find exact email match
            const existingClient = clients.find(client => {
                // Check client email
                if (client.email?.toLowerCase() === email.toLowerCase()) {
                    return true;
                }
                // Check contact persons emails (for business clients)
                if (client.contact_persons?.length > 0) {
                    return client.contact_persons.some(
                        contact => contact.email?.toLowerCase() === email.toLowerCase()
                    );
                }
                return false;
            });

            if (existingClient) {
                // Client exists, navigate to scope of work with client ID
                handleClose();
                navigate(`/sales/newquote/selectyourclient/client-information/scope-of-work/${existingClient.id}`);
            } else {
                // Client doesn't exist, store lead data and navigate to new client page
                const enquiryData = {
                    name: leadData?.data?.name || '',
                    email: email,
                    phone: leadData?.data?.phone || '',
                    formData: leadData?.data || {},
                    enquiryId: enquiryId,
                    formTitle: leadData?.form_title || ''
                };
                sessionStorage.setItem('enquiry-to-sale', JSON.stringify(enquiryData));
                handleClose();
                navigate('/sales/newquote/selectyourclient/new-clients');
            }
        } catch (error) {
            console.error('Error searching for client:', error);
            toast.error('Failed to search for client. Please try again.');
        } finally {
            setIsMovingToSale(false);
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
        const dayOptions = { weekday: 'short' };
        const timeString = new Intl.DateTimeFormat('en-US', timeOptions).format(date);
        const dayString = new Intl.DateTimeFormat('en-US', dayOptions).format(date);
        const day = date.getDate();
        const monthAbbreviation = new Intl.DateTimeFormat("en-US", {
            month: "short",
        }).format(date);
        const year = date.getFullYear();
        const dateString = `${day} ${monthAbbreviation} ${year}`;
        return `${timeString} | ${dayString} | ${dateString}`;
    };
    const getActivityIcon = (type) => {
        switch (type) {
            case 'note':
                return <CardChecklist size={16} color="#1AB2FF" />;
            case 'task':
                return <Check2Circle size={18} color="#1AB2FF" />;
            case 'email':
                return <Envelope size={16} color="#1AB2FF" />;
            case 'sms':
                return <ChatDots size={16} color="#1AB2FF" />;
            default:
                return <JournalText size={16} color="#1AB2FF" />;
        }
    };

    const renderHistoryItem = (item) => {
        console.log('item: ', item);
        let recipients = [];
        if (item.type === 'email' && item?.meta) {
            recipients = [...item?.meta?.to || [], ...item?.meta?.cc || [], ...item?.meta?.bcc || []];
        }
        return (
            <div key={item?.id} className="d-flex flex-column">
                <div className={style.historyHeader}>
                    {getActivityIcon(item?.type)}
                    <span className={style?.historyTitle}>{item?.title}</span>
                </div>

                {
                    item?.type === 'email' ? (
                        <div className={style.emailPreview}>
                            <div className='d-flex gap-2 flex-wrap'>
                                <strong className="font-12">Subject:</strong>
                                <span className='font-12'>{item?.text?.split(':')[1]}</span>
                            </div>
                            <div className='d-flex gap-2 flex-wrap'>
                                <strong className="font-12">Recipients:</strong>
                                <span className='font-12'>{recipients?.toString()}</span>
                            </div>
                            <div className={clsx('font-12', style.emailBody)} dangerouslySetInnerHTML={{ __html: item?.meta?.body }}>
                            </div>
                        </div>
                    ) : (
                        <p className={style.historyText}>{item?.text}</p>
                    )
                }
                <p className={style.historyTimestamp}>{formatTimestamp(+item?.created_at)} by {item?.created_by?.full_name}</p>
            </div>
        );

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
            contentClassName={style.modalContentClass}
        >
            <Modal.Header className={style.modalHeader}>
                <div className={style.headerContent}>
                    <div className={style.headerIcon}>
                        <FileText size={20} color="#17B26A" />
                    </div>
                    <div className={style.headerText}>
                        <h2 className={style.headerTitle}>Lead Details</h2>
                        {leadData?.form_title && (
                            <p className={style.headerSubtitle}>{leadData?.form_title}</p>
                        )}
                    </div>
                </div>
                <button className={style.closeButton} onClick={handleClose} aria-label="Close">
                    <X size={24} />
                </button>
            </Modal.Header>
            <Modal.Body className='p-0'>
                <div className={style.modalContent}>
                    <Row className="g-0 h-100">
                        <Col sm={6} className={style.leftColumn}>
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
                                        {leadData?.data?.name && (
                                            <div className={style.infoCard}>
                                                <div className={style.infoIcon}>
                                                    <Person size={18} />
                                                </div>
                                                <div className={style.infoContent}>
                                                    <span className={style.infoLabel}>Name</span>
                                                    <span className={style.infoValue}>{leadData?.data?.name}</span>
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
                                                    <a href={`mailto:${leadData?.data?.email}`} className={style.infoLink}>
                                                        {leadData?.data?.email}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        {leadData?.data?.phone && (
                                            <div className={style.infoCard}>
                                                <div className={style.infoIcon}>
                                                    <ChatText size={18} />
                                                </div>
                                                <div className={style.infoContent}>
                                                    <span className={style.infoLabel}>Phone</span>
                                                    <a href={`tel:${leadData?.data.phone}`} className={style.infoLink}>
                                                        {leadData?.data?.phone}
                                                    </a>
                                                </div>
                                            </div>
                                        )}

                                        <div className={style.divider}>
                                            <span>Form Details</span>
                                        </div>

                                        <div className={style.infoRow}>
                                            <span className={style.label}>Form Type</span>
                                            <span className={style.badge}>
                                                {leadData?.form_type === 'web' ? 'Web' : 'Form'}
                                            </span>
                                        </div>

                                        {leadData?.submitted_at && (
                                            <div className={style.infoRow}>
                                                <span className={style.label}>Submitted At</span>
                                                <span className={style.value}>
                                                    <Calendar size={14} className="me-1" />
                                                    {formatDate(leadData?.submitted_at)}
                                                </span>
                                            </div>
                                        )}

                                        {leadData?.data && Object.entries(leadData?.data).filter(([key, value]) =>
                                            !['name', 'email', 'phone'].includes(key) && value
                                        )?.length > 0 && (
                                                <div className={style.tableContainer}>
                                                    <table className={style.dataTable}>
                                                        <tbody>
                                                            {Object.entries(leadData?.data)?.map(([key, value]) => {
                                                                if (!['name', 'email', 'phone'].includes(key) && value) {
                                                                    return (
                                                                        <tr key={key}>
                                                                            <td className={style.tableLabel}>{formatFieldLabel(key)}</td>
                                                                            <td className={style.tableValue}>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</td>
                                                                        </tr>
                                                                    );
                                                                }
                                                                return null;
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}

                                        {leadData?.assigned_to && (
                                            <>
                                                <div className={style.divider}>
                                                    <span>Assignment</span>
                                                </div>
                                                <div className={style.infoRow}>
                                                    <span className={style.label}>Assigned To</span>
                                                    <span className={style.value}>
                                                        {leadData?.assigned_to?.first_name} {leadData?.assigned_to?.last_name}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </Col>

                        <Col sm={6} className={style.rightColumn}>
                            <div className={style.actionsRow}>
                                <AddNote submissionId={editData?.id} reInitialize={reInitialize} />
                                <NewTask submissionId={editData?.id} reInitialize={reInitialize} />
                                <SendSMS submissionId={editData?.id} phone={leadData?.data?.phone} reInitialize={reInitialize} />
                                <ComposeEmail submissionId={editData?.id} contactPersons={leadData?.data?.email ? [{ email: leadData?.data?.email }] : []} reInitialize={reInitialize} />
                            </div>

                            <div className={style.activitySection}>
                                <div className={style.sectionHeader}>
                                    <h3>Activity History</h3>
                                </div>
                                <div className={style.activityScroll}>
                                    {isHistoryLoading && (
                                        <div className={style.skeletonContainer}>
                                            {[1, 2, 3, 4].map((i) => (
                                                <div key={i} className='d-flex flex-column mb-3'>
                                                    <div className={style.activityItem}>
                                                        <div className={style.activityIcon}>
                                                            <div className={style.skeletonCircle}></div>
                                                        </div>
                                                        <div className={style.activityContent}>
                                                            <div className={style.skeletonLineShort}></div>
                                                            <div className={style.skeletonLine}></div>
                                                            <div className={style.skeletonLineLong}></div>
                                                        </div>
                                                    </div>
                                                    <div className={style.skeletonLine}></div>
                                                    <div className={style.skeletonLineLong}></div>
                                                    <div className={style.skeletonLine}></div>
                                                    <div className={style.skeletonLineLong}></div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {!isHistoryLoading && !hasHistory && (
                                        <div className={style.emptyState}>
                                            <div className={style.emptyIcon}>
                                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="48" height="48" rx="24" fill="#F9FAFB" />
                                                    <path d="M24 16V32M16 24H32" stroke="#98A2B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <p className={style.emptyText}>No activity history available yet.</p>
                                            <p className={style.emptySubtext}>
                                                Activities like notes, tasks, emails, and SMS will appear here.
                                            </p>
                                        </div>
                                    )}

                                    {!isHistoryLoading && hasHistory && (
                                        <div className={style.activityList}>
                                            {history.map(renderHistoryItem)}
                                        </div>
                                    )}
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
                    onClick={handleMoveToSale}
                    disabled={isMovingToSale}
                >
                    {isMovingToSale ? (
                        <>
                            <ProgressSpinner style={{ width: '16px', height: '16px' }} strokeWidth="4" />
                            &nbsp;Processing...
                        </>
                    ) : (
                        'Move to Sale'
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ViewEnquiryLead;